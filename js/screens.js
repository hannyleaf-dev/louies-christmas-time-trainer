'use strict';
/* =========================================================
   Screens: splash, buddy picker, home, the four games,
   sticker book, plus celebrations and the top bar.
   ========================================================= */
const App = { screen: null, cleanup: null, gen: 0, busy: false };
const Screens = {};

function go(name, arg) {
  Voice.stop();
  if (App.cleanup) { try { App.cleanup(); } catch (e) { console.warn(e); } App.cleanup = null; }
  App.gen++; App.busy = false;
  closeOverlay();
  const main = $('#screen');
  main.innerHTML = '';
  main.className = 'screen-' + name;
  App.screen = name;
  $('#topbar').hidden = ['splash', 'picker', 'parent'].includes(name);
  document.body.classList.toggle('no-topbar', $('#topbar').hidden);
  document.body.classList.toggle('in-parent', name === 'parent');
  document.body.classList.toggle('on-home', name === 'home');
  updateTopbar();
  Screens[name](main, arg);
}
const alive = gen => gen === App.gen;

// ---------- Top bar ----------
function updateTopbar(popNewest = false) {
  const n = Store.starsToday();
  const track = $('#star-track');
  let html = '';
  for (let i = 0; i < 10; i++) {
    const on = i < n;
    html += `<span class="slot${on ? ' on' : ''}${popNewest && i === Math.min(n, 10) - 1 ? ' pop' : ''}">${on ? '⭐' : '☆'}</span>`;
  }
  if (n > 10) html += `<span class="extra">+${n - 10}</span>`;
  track.innerHTML = html;
  $('#tb-buddy').innerHTML = Store.state.mascot ? currentMascot().svg : '';
}

function setupTopbar() {
  $('#tb-home').onclick = () => { Sound.pop(); go('home'); };
  $('#tb-stickers').onclick = () => { Sound.pop(); go('stickers'); };
  $('#tb-full').onclick = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen().catch(() => {});
  };
  attachGate($('#tb-lock'), $('#lock-tip'));
}

// Parent gate: press and hold the button for 3 seconds (too long for a 4-year-old's click)
function attachGate(btn, tip) {
  let t = null, tipT = null;
  const cancel = () => { clearTimeout(t); btn.classList.remove('holding'); };
  btn.addEventListener('pointerdown', e => {
    e.preventDefault();
    btn.classList.add('holding');
    if (tip) { tip.classList.add('show'); clearTimeout(tipT); tipT = setTimeout(() => tip.classList.remove('show'), 3500); }
    t = setTimeout(() => { cancel(); if (tip) tip.classList.remove('show'); go('parent'); }, 3000);
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, cancel));
}

// Speak things when the mouse rests on them (Louie can't read yet)
function setupHoverSpeech() {
  let timer = null, current = null;
  document.addEventListener('pointerover', e => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    const t = e.target.closest('[data-say]');
    if (t === current) return;
    current = t;
    clearTimeout(timer);
    if (!t) return;
    timer = setTimeout(() => {
      if (t.disabled || !document.body.contains(t)) return;
      try { Voice.say(JSON.parse(t.dataset.say)); } catch (err) { /* ignore */ }
    }, 350);
  });
}

// ---------- Buddy (mascot + speech bubble) ----------
const buddyHTML = (extra = '') => `<div class="buddy">
  <div class="mascot idle">${currentMascot().svg}</div>
  <div class="bubble"><p class="bubble-text"></p><button class="replay" aria-label="Say it again">🔊</button></div>${extra}
</div>`;

class Buddy {
  constructor(root) {
    this.root = root;
    this.m = $('.mascot', root);
    this.text = $('.bubble-text', root);
    this.last = null;
    $('.replay', root).onclick = () => { if (this.last) Voice.say(this.last); };
  }
  say(parts, html) {
    this.last = parts;
    if (html != null) {
      this.text.innerHTML = html;
      const b = this.text.parentElement;
      b.classList.remove('in'); void b.offsetWidth; b.classList.add('in');
    }
    return Voice.say(parts);
  }
  mood(c) {
    this.m.classList.remove('idle', 'dance', 'think', 'wave');
    void this.m.offsetWidth;
    this.m.classList.add(c);
    clearTimeout(this.moodT);
    if (c !== 'idle') this.moodT = setTimeout(() => { this.m.classList.remove(c); this.m.classList.add('idle'); }, c === 'dance' ? 2200 : 1300);
  }
}

// ---------- Overlays & celebrations ----------
function showOverlay(html, cls = '') {
  const ov = $('#overlay');
  ov.innerHTML = '';
  const node = h(`<div class="ov ${cls}">${html}</div>`);
  ov.appendChild(node);
  ov.classList.add('open');
  return node;
}
function closeOverlay() { const ov = $('#overlay'); ov.classList.remove('open'); ov.innerHTML = ''; }
const waitClick = el => new Promise(res => el.addEventListener('click', () => { Sound.pop(); res(); }, { once: true }));

function confetti() {
  if (reduceMotion) return;
  const cv = $('#confetti'), ctx = cv.getContext('2d'), dpr = window.devicePixelRatio || 1;
  const W = innerWidth, H = innerHeight;
  cv.width = W * dpr; cv.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cols = ['#EF6F57', '#FFFFFF', '#4C7FE0', '#FFC857', '#7CC17A', '#A98BE8'];
  const P = [];
  for (let i = 0; i < 170; i++) {
    P.push({
      x: W / 2 + (Math.random() - 0.5) * 240, y: H * 0.55,
      vx: (Math.random() - 0.5) * 18, vy: -Math.random() * 17 - 6,
      r: Math.random() * 360, vr: (Math.random() - 0.5) * 14,
      w: 8 + Math.random() * 9, h: 5 + Math.random() * 6, c: pick(cols),
    });
  }
  const t0 = performance.now();
  cancelAnimationFrame(confetti.raf);
  const frame = t => {
    ctx.clearRect(0, 0, W, H);
    for (const p of P) {
      p.vy += 0.42; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r * Math.PI / 180);
      ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.strokeStyle = 'rgba(0,0,0,.12)'; ctx.strokeRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (t - t0 < 3200) confetti.raf = requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, W, H);
  };
  confetti.raf = requestAnimationFrame(frame);
}

function goalOverlay() {
  showOverlay(`<div class="goal-scene">
      <div class="net"></div>
      <div class="ball">⚽</div>
      <div class="goal-text">GOAL!</div>
    </div>`, 'goal clear');
  return sleep(reduceMotion ? 1000 : 1800).then(closeOverlay);
}

async function stickerOverlay(st) {
  Sound.sparkle();
  const node = showOverlay(`<div class="card pop-in">
      <div class="ov-title">New sticker!</div>
      <div class="big-sticker">${st.e}</div>
      <button class="big-btn green" ${sayAttr(['p_yay'])}>Yay! ⭐</button>
    </div>`);
  Voice.say(['i_sticker', { t: st.n + '!' }]);
  await waitClick($('button', node));
  closeOverlay();
}

async function trophyOverlay(ev) {
  Sound.goal();
  confetti();
  const line = ev === 'stage2' ? 'i_trophy1' : 'i_trophy2';
  const node = showOverlay(`<div class="card pop-in trophy-card">
      <div class="ov-title">You won a trophy!</div>
      <div class="big-trophy">🏆</div>
      <p class="ov-sub">${PHRASE_TEXT[line]}</p>
      <div class="mascot dance">${currentMascot().svg}</div>
      <button class="big-btn yellow" ${sayAttr(['p_yay'])}>Yay! 🎉</button>
    </div>`);
  Voice.say(['i_trophy', line]);
  await waitClick($('button', node));
  closeOverlay();
}

async function seeYouOverlay() {
  Sound.chime();
  const node = showOverlay(`<div class="card pop-in">
      <div class="ov-title">10 stars today!</div>
      <div class="ten-stars">${'⭐'.repeat(10)}</div>
      <div class="mascot wave">${currentMascot().svg}</div>
      <p class="ov-sub">See you tomorrow, Louie!</p>
      <button class="big-btn blue" ${sayAttr(['t_home'])}>👋 Bye bye!</button>
    </div>`);
  Voice.say(['i_seeyou']);
  await waitClick($('button', node));
  go('home');
}

// The big "GOAL!" moment after a right answer, then star, sticker, trophy, daily goal.
async function celebrate(buddy, event) {
  const gen = App.gen;
  Sound.goal();
  confetti();
  buddy.mood('dance');
  const praise = pick(['p_welldone', 'p_amazing', 'p_brilliant', 'p_youdidit']);
  await Promise.all([goalOverlay(), buddy.say(['p_goal', praise], `GOAL! ⚽ ${PHRASE_TEXT[praise]}`)]);
  if (!alive(gen)) return;
  const r = Store.addStar();
  updateTopbar(true);
  if (r.newSticker) { await stickerOverlay(r.newSticker); if (!alive(gen)) return; }
  if (event) { await trophyOverlay(event); if (!alive(gen)) return; }
  if (r.dailyGoal) { await seeYouOverlay(); }
}

// ---------- Choosing questions ----------
function newTarget(last) {
  const half = Store.state.stage >= 2 && Math.random() < 0.6;
  let hr;
  do { hr = randInt(1, 12); } while (last && hr === last.h);
  return { h: hr, m: half ? 30 : 0 };
}
// Wrong answers that teach: neighbouring hours, "12 o'clock" (reading the long hand),
// and for half past, the classic "one hour too many" mistake.
function distractors(t, n = 2) {
  const kind = kindOf(t.m), c = [];
  if (kind === 'oclock') {
    c.push({ h: nextHour(t.h), m: 0 }, { h: prevHour(t.h), m: 0 });
    if (t.h !== 12) c.push({ h: 12, m: 0 });
    for (let i = 0; i < 3; i++) c.push({ h: randInt(1, 12), m: 0 });
  } else if (kind === 'half') {
    c.push({ h: nextHour(t.h), m: 30 }, { h: t.h, m: 0 }, { h: prevHour(t.h), m: 30 });
    if (t.h !== 6) c.push({ h: 6, m: 0 });
  } else {
    c.push({ h: t.h, m: 0 }, { h: t.h, m: 30 }, { h: nextHour(t.h), m: t.m }, { h: prevHour(t.h), m: t.m });
  }
  const key = x => x.h + ':' + x.m, seen = new Set([key(t)]), out = [];
  for (const x of shuffle(c)) {
    if (out.length >= n) break;
    if (!seen.has(key(x))) { seen.add(key(x)); out.push(x); }
  }
  return out;
}

function hintFor(kind, tries, t) {
  if (kind === 'half') {
    return tries === 1
      ? { parts: ['h_nearly', 'h_half'], html: "Ooh, nearly! The long blue hand points down. That means <b>half past</b>!", glow: 'minute' }
      : { parts: ['h_halfshort'], html: 'Now look at the short red hand. Which number has it just gone past?', glow: 'hour', pulse: t.h };
  }
  return tries === 1
    ? { parts: ['h_nearly', 'h_short'], html: "Ooh, nearly! Look at the <b class='red'>short red hand</b>. Which number is it pointing to?", glow: 'hour' }
    : { parts: ['h_short'], html: "Look at the <b class='red'>short red hand</b>. Which number is it pointing to?", glow: 'hour', pulse: t.h };
}

// ---------- Game layout ----------
function gameLayout(el, top = '') {
  el.innerHTML = `${top}<div class="game">
      <div class="clock-area"></div>
      <div class="side">${buddyHTML()}<div class="controls"></div></div>
    </div>`;
  return { clockArea: $('.clock-area', el), controls: $('.controls', el), buddy: new Buddy($('.buddy', el)) };
}

const miniHand = color => `<svg class="mini-hand" viewBox="0 0 40 20"><line x1="4" y1="10" x2="${color === 'red' ? 28 : 36}" y2="10" stroke="${color === 'red' ? '#EF6F57' : '#4C7FE0'}" stroke-width="${color === 'red' ? 8 : 5}" stroke-linecap="round"/></svg>`;

// "Make the clock say …" – resolves with any level-up event once Louie gets it right
function makeChallenge(L, clock, t, intro, firstTime) {
  return new Promise(resolve => {
    let start;
    do { start = randInt(1, 12); } while (start === t.h);
    clock.clearHints();
    clock.set(start, 0, false);
    L.controls.innerHTML = `
      <div class="hand-ctrl red">
        <button class="arrow" data-d="-1" ${sayAttr(['x_short'])} aria-label="Move short hand back">◀</button>
        <span class="hand-label">${miniHand('red')}</span>
        <button class="arrow" data-d="1" ${sayAttr(['x_short'])} aria-label="Move short hand forward">▶</button>
      </div>
      <button class="shoot" ${sayAttr(['i_pressball'])}><span class="ball-ico">⚽</span><span>Done!</span></button>`;
    let tries = 0, done = false, pending = null;
    const moved = () => { Sound.tick(); clock.clearHints(); };
    clock.o.onChange = (hh, mm, phase) => { if (phase === 'move') moved(); if (phase === 'end') Voice.say(['n' + hh]); };
    clock.o.onNumber = n => { if (done) return; Sound.pop(); clock.set(n, 0); clock.bounceNumber(n); Voice.say(['n' + n]); };
    $$('.arrow', L.controls).forEach(b => b.onclick = () => {
      if (done) return;
      clock.stepHour(+b.dataset.d); moved(); Voice.say(['n' + clock.h]);
    });
    const shoot = $('.shoot', L.controls);
    shoot.onclick = () => {
      if (done) return;
      const ok = clock.h === t.h;
      if (tries === 0) pending = Store.record('oclock', ok, digital(t.h, 0));
      if (ok) { done = true; shoot.classList.add('scored'); resolve(pending); return; }
      tries++;
      Sound.soft();
      L.buddy.mood('think');
      shoot.classList.remove('shake'); void shoot.offsetWidth; shoot.classList.add('shake');
      if (tries >= 2) clock.pulseNumber(t.h);
      L.buddy.say(['h_nearly', 'h_find', 'n' + t.h], `Ooh, nearly! Can you find the number <b>${t.h}</b>?`);
    };
    L.buddy.mood('idle');
    L.buddy.say(firstTime ? [...intro.parts, 'i_pressball'] : intro.parts, intro.html);
  });
}

// Pick the right answer from 2–3 buttons (words) or clocks (Louie's day)
function choiceChallenge(L, container, t, choices, render, onWrongHint, intro, afterRender) {
  return new Promise(resolve => {
    const kind = kindOf(t.m);
    container.innerHTML = choices.map((c, i) => render(c, i)).join('');
    if (afterRender) afterRender(container);
    let tries = 0, done = false, pending = null;
    $$('[data-i]', container).forEach(btn => btn.onclick = () => {
      if (done || btn.disabled) return;
      const c = choices[+btn.dataset.i];
      const ok = c.h === t.h && c.m === t.m;
      if (tries === 0 && (kind === 'oclock' || kind === 'half')) pending = Store.record(kind, ok, digital(t.h, t.m));
      if (ok) { done = true; btn.classList.add('right'); resolve(pending); return; }
      tries++;
      btn.disabled = true;
      btn.classList.add('wrong');
      Sound.soft();
      L.buddy.mood('think');
      const hint = hintFor(kind, tries, t);
      onWrongHint(hint);
      L.buddy.say(hint.parts, hint.html);
    });
    L.buddy.mood('idle');
    L.buddy.say(intro.parts, intro.html);
  });
}

// ================= SCREENS =================

Screens.splash = el => {
  el.innerHTML = `<div class="splash">
      <div class="splash-clock"></div>
      <h1 class="neon-title"><span class="t1">Louie's</span><span class="t2">Christmas-</span><span class="t3">tell-the-time-trainer</span></h1>
      <button class="play-btn" aria-label="Play"><span class="ball-ico">⚽</span><span>Play!</span></button>
      <div class="splash-gate">
        <button class="gate-btn" aria-label="Grown-ups: press and hold"><span class="gate-fill"></span><span class="gate-label">🔒 Grown-ups</span></button>
        <div class="lock-tip">Keep holding for 3 seconds…</div>
      </div>
    </div>`;
  attachGate($('.splash-gate .gate-btn', el), $('.splash-gate .lock-tip', el));
  const c = new Clock();
  $('.splash-clock', el).appendChild(c.el);
  c.set(3, 0, false);
  const timer = setInterval(() => c.stepMinute(30), 1100);
  App.cleanup = () => clearInterval(timer);
  $('.play-btn', el).onclick = () => {
    Sound.ensureCtx(); Voice.unlock(); Sound.chime();
    go(Store.state.mascot ? 'home' : 'picker');
  };
};

Screens.picker = el => {
  el.innerHTML = `<div class="picker">
      <h2>Who do you want to play with?</h2>
      <div class="picker-row">${Object.entries(MASCOTS).map(([id, m]) => `
        <button class="pick-card" data-id="${id}" ${sayAttr([m.phrase])}>
          <div class="mascot idle">${m.svg}</div>
          <div class="pick-name">${m.name}</div>
          <div class="pick-title">${m.title}</div>
        </button>`).join('')}
      </div>
    </div>`;
  const gen = App.gen;
  setTimeout(() => { if (alive(gen)) Voice.say(['i_pick']); }, 300);
  $$('.pick-card', el).forEach(b => b.onclick = async () => {
    if (App.busy) return;
    App.busy = true;
    const id = b.dataset.id;
    Store.state.mascot = id; Store.save();
    Sound.chime();
    $$('.pick-card', el).forEach(x => x.classList.toggle('chosen', x === b));
    $$('.pick-card', el).forEach(x => x.classList.toggle('faded', x !== b));
    $('.mascot', b).className = 'mascot dance';
    await Promise.all([Voice.say(['i_hello', MASCOTS[id].hi]), sleep(1800)]);
    if (alive(gen)) go('home');
  });
};

Screens.home = el => {
  const tiles = [
    { id: 'playground', icon: '🕰️', label: 'Play with the clock', say: 'm_play', cls: 't-blue' },
    { id: 'whattime', icon: '⏰', label: 'What time is it?', say: 'm_what', cls: 't-red' },
    { id: 'make', icon: '👆', label: 'Make the time', say: 'm_make', cls: 't-green' },
    { id: 'day', icon: '🌞', label: "Louie's day", say: 'm_day', cls: 't-yellow' },
    { id: 'stickers', icon: '📒', label: 'Sticker book', say: 'm_stickers', cls: 't-purple' },
  ];
  el.innerHTML = `<div class="home">
      <div class="home-sign">${xmasSignHTML()}</div>
      <div class="home-buddy">${buddyHTML(`<button class="swap-buddy" ${sayAttr(['i_pick'])}>🔄 Change buddy</button>`)}</div>
      <div class="tiles">${tiles.map(t => `
        <button class="tile ${t.cls}" data-go="${t.id}" ${sayAttr([t.say])}>
          <span class="tile-icon">${t.icon}</span><span class="tile-label">${t.label}</span>
        </button>`).join('')}
      </div>
    </div>`;
  const b = new Buddy($('.buddy', el));
  const gen = App.gen;
  animateXmasSign(el);
  setTimeout(() => { if (alive(gen)) { b.mood('wave'); b.say(['i_hello', 'i_whatplay'], 'Hi Louie! What shall we play?'); } }, 250);
  $$('[data-go]', el).forEach(x => x.onclick = () => { Sound.pop(); go(x.dataset.go); });
  $('.swap-buddy', el).onclick = () => { Sound.pop(); go('picker'); };
};

Screens.playground = el => {
  const L = gameLayout(el);
  const readout = h(`<div class="readout"><div class="readout-words"></div><div class="readout-digital"></div></div>`);
  let speakT = null;
  const update = () => {
    $('.readout-words', readout).innerHTML = timeLabel(clock.h, clock.m);
    $('.readout-digital', readout).textContent = digital(clock.h, clock.m);
  };
  const announce = () => {
    update();
    clearTimeout(speakT);
    speakT = setTimeout(() => Voice.say(['its', ...timeParts(clock.h, clock.m)]), 150);
  };
  const clock = new Clock({
    hourDrag: true, minuteDrag: true, numbersClickable: true, minuteSnap: 15,
    onChange: (hh, mm, phase) => { update(); if (phase === 'move') Sound.tick(); else announce(); },
    onNumber: n => { Sound.pop(); clock.bounceNumber(n); Voice.say(['n' + n]); },
  });
  L.clockArea.append(clock.el, readout);
  L.controls.innerHTML = `
    <div class="hand-ctrl red">
      <button class="arrow" data-hand="h" data-d="-1" ${sayAttr(['x_short'])} aria-label="Short hand back">◀</button>
      <span class="hand-label">${miniHand('red')}</span>
      <button class="arrow" data-hand="h" data-d="1" ${sayAttr(['x_short'])} aria-label="Short hand forward">▶</button>
    </div>
    <div class="hand-ctrl blue">
      <button class="arrow" data-hand="m" data-d="-15" ${sayAttr(['x_long'])} aria-label="Long hand back">◀</button>
      <span class="hand-label">${miniHand('blue')}</span>
      <button class="arrow" data-hand="m" data-d="15" ${sayAttr(['x_long'])} aria-label="Long hand forward">▶</button>
    </div>
    <button class="big-btn yellow surprise" ${sayAttr(['x_surprise'])}>🎲 Surprise!</button>`;
  $$('.arrow', L.controls).forEach(b => b.onclick = () => {
    Sound.tick();
    if (b.dataset.hand === 'h') clock.stepHour(+b.dataset.d); else clock.stepMinute(+b.dataset.d);
    announce();
  });
  $('.surprise', L.controls).onclick = () => {
    Sound.pop();
    clock.set(randInt(1, 12), pick([0, 30]));
    L.buddy.mood('dance');
    announce();
  };
  clock.set(3, 0, false);
  update();
  L.buddy.say(['i_playground'], "Move the hands and I'll tell you the time!");
  App.cleanup = () => clearTimeout(speakT);
};

Screens.whattime = el => {
  const L = gameLayout(el);
  const clock = new Clock();
  L.clockArea.append(clock.el);
  clock.set(12, 0, false);
  const gen = App.gen;
  let last = null;
  const round = async () => {
    if (!alive(gen)) return;
    const t = newTarget(last); last = t;
    clock.clearHints();
    clock.set(t.h, t.m);
    const choices = shuffle([t, ...distractors(t)]);
    L.controls.innerHTML = '<div class="answers"></div>';
    const ev = await choiceChallenge(L, $('.answers', L.controls), t, choices,
      (c, i) => `<button class="answer" data-i="${i}" ${sayAttr(timeParts(c.h, c.m))}>
          <span class="ans-words">${timeLabel(c.h, c.m)}</span><span class="ans-digital">${digital(c.h, c.m)}</span></button>`,
      hint => { if (hint.glow) clock.glow(hint.glow); if (hint.pulse) clock.pulseNumber(hint.pulse); },
      { parts: ['q_whattime'], html: 'What time is it?' });
    if (!alive(gen)) return;
    await celebrate(L.buddy, ev);
    round();
  };
  round();
};

Screens.make = el => {
  const L = gameLayout(el);
  const clock = new Clock({ hourDrag: true, numbersClickable: true });
  L.clockArea.append(clock.el);
  const gen = App.gen;
  let last = null, first = true;
  const round = async () => {
    if (!alive(gen)) return;
    let hr;
    do { hr = randInt(1, 12); } while (hr === last);
    last = hr;
    const t = { h: hr, m: 0 };
    const ev = await makeChallenge(L, clock, t, {
      parts: ['q_make', ...timeParts(t.h, 0)],
      html: `Can you make the clock say <b>${t.h} o'clock</b>?`,
    }, first);
    first = false;
    if (!alive(gen)) return;
    await celebrate(L.buddy, ev);
    round();
  };
  round();
};

Screens.day = el => {
  const s = Store.state;
  const unlocked = r => KIND_STAGE[kindOf(r.m)] <= s.stage;
  const strip = `<div class="day-strip">${s.routine.map(r => {
    const open = unlocked(r);
    return `<div class="ev ${open ? '' : 'locked'}" data-ev="${r.id}" ${open ? sayAttr(['e_' + r.id, 'is_at', ...timeParts(r.h, r.m)]) : ''}>
        <div class="ev-emoji">${r.emoji}</div><div class="ev-name">${r.name}</div>
        <div class="ev-time">${open ? timeLabel(r.h, r.m) : '🔒 soon'}</div></div>`;
  }).join('')}</div>`;
  const L = gameLayout(el, strip);
  const big = new Clock({ hourDrag: true, numbersClickable: true });
  const grid = h('<div class="clock-grid"></div>');
  L.clockArea.append(big.el, grid);
  const events = s.routine.filter(unlocked);
  if (!events.length) {
    big.el.style.display = 'none';
    L.buddy.say(['i_dayintro'], 'More cards are coming soon!');
    return;
  }
  const gen = App.gen;
  let n = 0, order = [], firstMake = true;
  const round = async () => {
    if (!alive(gen)) return;
    if (!order.length) order = shuffle(events);
    const ev = order.pop();
    n++;
    $$('.ev', el).forEach(x => x.classList.toggle('active', x.dataset.ev === ev.id));
    const t = { h: ev.h, m: ev.m }, words = timePlain(t.h, t.m);
    const intro = ['e_' + ev.id, 'is_at', ...timeParts(t.h, t.m)];
    let result;
    if (kindOf(t.m) === 'oclock' && n % 2 === 0) {
      big.el.style.display = ''; grid.style.display = 'none';
      result = await makeChallenge(L, big, t, {
        parts: [...intro, 'q_make', ...timeParts(t.h, t.m)],
        html: `${ev.emoji} <b>${ev.name}</b> is at <b>${words}</b>. Can you make the clock say ${words}?`,
      }, firstMake);
      firstMake = false;
    } else {
      big.el.style.display = 'none'; grid.style.display = '';
      L.controls.innerHTML = '';
      const choices = shuffle([t, ...distractors(t)]);
      const clocks = [];
      result = await choiceChallenge(L, grid, t, choices,
        (c, i) => `<button class="clock-choice" data-i="${i}" aria-label="Clock ${i + 1}"></button>`,
        hint => clocks.forEach(c => c.glow(hint.glow || 'hour')),
        {
          parts: [...intro, 'q_which', ...timeParts(t.h, t.m)],
          html: `${ev.emoji} <b>${ev.name}</b> is at <b>${words}</b>. Which clock says ${words}?`,
        },
        cont => $$('.clock-choice', cont).forEach((btn, i) => {
          const c = new Clock({ small: true });
          c.set(choices[i].h, choices[i].m, false);
          btn.appendChild(c.el);
          clocks.push(c);
        }));
    }
    if (!alive(gen)) return;
    await celebrate(L.buddy, result);
    round();
  };
  round();
};

Screens.stickers = el => {
  const s = Store.state, n = Store.stickersUnlocked();
  const into = s.starsTotal % 5;
  const allDone = n >= STICKERS.length;
  el.innerHTML = `<div class="book">
      <div class="book-head">
        <h2>Louie's Sticker Book</h2>
        <div class="trophies">
          <div class="trophy ${s.stage >= 2 ? 'won' : ''}" ${sayAttr([{ t: "O'clock trophy" }])}>🏆<span>o'clock</span></div>
          <div class="trophy ${s.halfMastered ? 'won' : ''}" ${sayAttr([{ t: 'Half past trophy' }])}>🏆<span>half past</span></div>
        </div>
        ${allDone ? '<div class="next">You collected them all! 🎉</div>' :
          `<div class="next"><span class="next-label">Next sticker</span>${[0, 1, 2, 3, 4].map(i => `<span class="slot ${i < into ? 'on' : ''}">${i < into ? '⭐' : '☆'}</span>`).join('')}</div>`}
      </div>
      <div class="sticker-grid">${STICKERS.map((st, i) => i < n
        ? `<button class="sticker" ${sayAttr([{ t: st.n }])}>${st.e}</button>`
        : `<div class="sticker locked">?</div>`).join('')}</div>
    </div>`;
  $$('button.sticker', el).forEach(b => b.onclick = () => {
    Sound.sparkle();
    b.classList.remove('boing'); void b.offsetWidth; b.classList.add('boing');
  });
  Voice.say(['i_stickerbook']);
};
