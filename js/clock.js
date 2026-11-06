'use strict';
/* =========================================================
   The clock: an SVG analogue clock with a chunky red short
   (hour) hand and a slim blue long (minute) hand.
   Options:
     hourDrag / minuteDrag  – can Louie drag that hand?
     numbersClickable       – clicking a number calls onNumber(n)
     minuteSnap             – minute hand snaps to this many minutes
     onChange(h, m, phase)  – phase is 'move' while dragging, 'end' on release
   ========================================================= */
class Clock {
  constructor(opts = {}) {
    this.o = Object.assign({
      hourDrag: false, minuteDrag: false, numbersClickable: false,
      minuteSnap: 15, onChange: null, onNumber: null, small: false,
    }, opts);
    this.h = 12; this.m = 0;
    this.ha = 0; this.ma = 0;   // displayed angles (kept continuous so hands never spin the long way)
    this.raf = null; this.drag = null;
    this.el = this.build();
    this.render();
    this.attach();
  }

  build() {
    let ticks = '';
    for (let i = 0; i < 60; i++) {
      const big = i % 5 === 0, a = i * 6 * Math.PI / 180, r1 = big ? 85 : 89, r2 = 93;
      ticks += `<line class="tick${big ? ' big' : ''}" x1="${(Math.sin(a) * r1).toFixed(2)}" y1="${(-Math.cos(a) * r1).toFixed(2)}" x2="${(Math.sin(a) * r2).toFixed(2)}" y2="${(-Math.cos(a) * r2).toFixed(2)}"/>`;
    }
    let nums = '';
    for (let n = 1; n <= 12; n++) {
      const a = n * 30 * Math.PI / 180, r = 71;
      nums += `<g class="num" data-n="${n}" transform="translate(${(Math.sin(a) * r).toFixed(2)} ${(-Math.cos(a) * r).toFixed(2)})">
        <g class="num-inner"><circle class="num-hit" r="14"/><text text-anchor="middle" dominant-baseline="central" y="1">${n}</text></g></g>`;
    }
    const cls = ['clock'];
    if (this.o.hourDrag) cls.push('drag-hour');
    if (this.o.minuteDrag) cls.push('drag-minute');
    if (this.o.numbersClickable) cls.push('nums-click');
    if (this.o.small) cls.push('small');
    return h(`<svg class="${cls.join(' ')}" viewBox="-110 -110 220 220" role="img" aria-label="Clock">
      <circle class="rim" r="106"/>
      <circle class="face" r="96"/>
      ${ticks}
      <g class="hand minute">
        <line class="halo" y1="10" y2="-80"/>
        <line class="hit" y1="10" y2="-82"/>
        <line class="stick" y1="12" y2="-80"/>
        <circle class="knob" cy="-74" r="8"/>
      </g>
      <g class="hand hour">
        <line class="halo" y1="8" y2="-50"/>
        <line class="hit" y1="8" y2="-54"/>
        <line class="stick" y1="10" y2="-50"/>
        <circle class="knob" cy="-46" r="10"/>
      </g>
      <circle class="cap" r="7"/>
      ${nums}
    </svg>`);
  }

  render() {
    $('.hand.hour', this.el).setAttribute('transform', `rotate(${this.ha})`);
    $('.hand.minute', this.el).setAttribute('transform', `rotate(${this.ma})`);
  }

  static norm(d) { return ((d % 360) + 540) % 360 - 180; }

  // Move the hands to h:m (animated unless animate is false)
  set(h, m, animate = true) {
    this.h = h; this.m = m;
    const th = (h % 12) * 30 + m * 0.5, tm = m * 6;
    const toH = this.ha + Clock.norm(th - this.ha);
    const toM = this.ma + Clock.norm(tm - this.ma);
    cancelAnimationFrame(this.raf);
    if (!animate || reduceMotion) { this.ha = toH; this.ma = toM; this.render(); return Promise.resolve(); }
    const fromH = this.ha, fromM = this.ma, t0 = performance.now(), dur = 650;
    const ease = t => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2); // gentle overshoot
    return new Promise(res => {
      const step = now => {
        const t = Math.min(1, (now - t0) / dur), k = ease(t);
        this.ha = fromH + (toH - fromH) * k;
        this.ma = fromM + (toM - fromM) * k;
        this.render();
        if (t < 1) this.raf = requestAnimationFrame(step);
        else { this.ha = toH; this.ma = toM; this.render(); res(); }
      };
      this.raf = requestAnimationFrame(step);
    });
  }

  stepHour(d) {
    const h = ((this.h - 1 + d) % 12 + 12) % 12 + 1;
    return this.set(h, this.m);
  }
  stepMinute(d) {
    let total = ((this.h % 12) * 60 + this.m + d) % 720;
    if (total < 0) total += 720;
    const h = Math.floor(total / 60) || 12;
    return this.set(h, total % 60);
  }

  // ----- Hints -----
  glow(which) { $('.hand.' + which, this.el).classList.add('glow'); }
  pulseNumber(n) { $(`.num[data-n="${n}"]`, this.el).classList.add('pulse'); }
  bounceNumber(n) {
    const g = $(`.num[data-n="${n}"]`, this.el);
    g.classList.remove('bounce'); void g.getBoundingClientRect(); g.classList.add('bounce');
  }
  clearHints() { $$('.glow, .pulse', this.el).forEach(x => x.classList.remove('glow', 'pulse')); }

  // ----- Dragging & clicking -----
  angleFrom(e) {
    const pt = this.el.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(this.el.getScreenCTM().inverse());
    let a = Math.atan2(p.x, -p.y) * 180 / Math.PI;
    return a < 0 ? a + 360 : a;
  }
  // Little fingers miss: grab a draggable hand if the pointer is close to it
  handNear(e) {
    const pt = this.el.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(this.el.getScreenCTM().inverse());
    const r = Math.hypot(p.x, p.y), a = this.angleFrom(e);
    const close = (ang, len) => Math.abs(Clock.norm(a - ang)) < 14 && r < len + 12;
    if (this.o.hourDrag && close(this.ha, 50)) return 'hour';
    if (this.o.minuteDrag && close(this.ma, 82)) return 'minute';
    return null;
  }
  attach() {
    const svg = this.el;
    svg.addEventListener('pointerdown', e => {
      const hand = e.target.closest('.hand');
      let which = hand ? (hand.classList.contains('hour') ? 'hour' : 'minute') : this.handNear(e);
      if (!which) return;
      if ((which === 'hour' && !this.o.hourDrag) || (which === 'minute' && !this.o.minuteDrag)) return;
      e.preventDefault();
      this.drag = which; this.dragged = false;
      svg.setPointerCapture(e.pointerId);
      svg.classList.add('dragging');
    });
    svg.addEventListener('pointermove', e => { if (this.drag) this.dragMove(e); });
    const end = () => {
      if (!this.drag) return;
      this.drag = null;
      svg.classList.remove('dragging');
      if (this.dragged && this.o.onChange) this.o.onChange(this.h, this.m, 'end');
    };
    svg.addEventListener('pointerup', end);
    svg.addEventListener('pointercancel', end);
    svg.addEventListener('click', e => {
      if (this.dragged) { this.dragged = false; return; }
      const num = e.target.closest('.num');
      if (num && this.o.numbersClickable && this.o.onNumber) this.o.onNumber(+num.dataset.n);
    });
  }
  dragMove(e) {
    const a = this.angleFrom(e);
    let { h, m } = this;
    if (this.drag === 'hour') {
      let nh = Math.round((a - m * 0.5) / 30);
      nh = ((nh % 12) + 12) % 12;
      h = nh === 0 ? 12 : nh;
    } else {
      const step = this.o.minuteSnap;
      const nm = (Math.round(a / 6 / step) * step) % 60;
      const d = nm - m;
      if (d < -30) h = nextHour(h);       // went forwards past 12
      else if (d > 30) h = prevHour(h);   // went backwards past 12
      m = nm;
    }
    if (h !== this.h || m !== this.m) {
      this.dragged = true;
      this.set(h, m, false);
      if (this.o.onChange) this.o.onChange(h, m, 'move');
    }
  }
}
