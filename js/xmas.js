'use strict';
/* =========================================================
   Christmas: night-sky backdrop, snow, neon fairy lights
   and the "sleeps to Christmas" countdown sign.
   ========================================================= */

// Nights left until 25 December (0 on Christmas Day)
function sleepsToChristmas(now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let xmas = new Date(now.getFullYear(), 11, 25);
  if (today > xmas) xmas = new Date(now.getFullYear() + 1, 11, 25);
  return Math.round((xmas - today) / 86400000);
}

// ---------- Backdrop: stars, snowy hills and lit-up trees ----------
function buildBackdrop() {
  // Stars
  let stars = '';
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * 1440, y = Math.random() * 520, r = Math.random() < 0.15 ? 2.2 : 1 + Math.random();
    stars += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="#fff" opacity="${(0.4 + Math.random() * 0.6).toFixed(2)}"/>`;
  }
  const starSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">${stars}</svg>`;

  // Pine trees with neon baubles
  const lights = ['#FF3EA5', '#2DE2E6', '#FFD23F', '#B6FF3B', '#FF8A3D'];
  const tree = (x, y, s) => {
    let dots = '';
    for (let i = 0; i < 9; i++) {
      const ty = -18 - i * 9, w = 30 - i * 3;
      dots += `<circle cx="${(Math.random() * 2 - 1) * w * 0.8}" cy="${ty}" r="2.6" fill="${lights[i % lights.length]}"/>`;
    }
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <rect x="-5" y="-6" width="10" height="14" fill="#5B3A29"/>
      <polygon points="0,-110 -26,-62 26,-62" fill="#1E6B55"/>
      <polygon points="0,-84 -34,-34 34,-34" fill="#1A5E4B"/>
      <polygon points="0,-58 -42,-4 42,-4" fill="#164F40"/>
      <path d="M-16 -70 L0 -110 L16 -70 M-22 -42 L0 -84 L22 -42 M-28 -12 L0 -58 L28 -12" fill="none" stroke="#fff" stroke-width="3" opacity=".55"/>
      ${dots}
      <polygon points="0,-122 4,-112 14,-112 6,-106 9,-96 0,-102 -9,-96 -6,-106 -14,-112 -4,-112" fill="#FFD23F"/>
    </g>`;
  };
  const hills = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 240" preserveAspectRatio="xMidYMax slice">
    <path d="M0 90 C200 30 420 40 640 80 S1080 140 1440 60 V240 H0Z" fill="#C9D9F2"/>
    ${tree(110, 92, 0.9)}${tree(190, 78, 0.7)}${tree(1250, 96, 0.85)}${tree(1340, 78, 1)}
    <path d="M0 150 C260 100 520 120 760 140 S1200 175 1440 125 V240 H0Z" fill="#F2F6FF"/>
    <path d="M0 196 C400 178 1040 178 1440 196" stroke="#C9D9F2" stroke-width="4" fill="none" stroke-dasharray="18 14"/>
  </svg>`;
  const url = svg => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  document.body.style.setProperty('--stars', url(starSvg));
  document.body.style.setProperty('--hills', url(hills));
}

// ---------- Falling snow ----------
function startSnow() {
  const cv = $('#snow');
  if (!cv || reduceMotion) return;
  const ctx = cv.getContext('2d');
  let W = 0, H = 0;
  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  addEventListener('resize', resize);
  const flakes = Array.from({ length: 110 }, () => ({
    x: Math.random() * W, y: Math.random() * H, r: 1 + Math.random() * 3,
    s: 0.3 + Math.random() * 0.9, d: Math.random() * 6.28,
  }));
  const frame = () => {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,255,255,.85)';
    for (const p of flakes) {
      p.y += p.s; p.d += 0.012; p.x += Math.sin(p.d) * 0.45;
      if (p.y > H + 5) { p.y = -5; p.x = Math.random() * W; }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.29); ctx.fill();
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

// ---------- Neon fairy lights along the top ----------
function buildGarland() {
  const colours = ['pink', 'cyan', 'gold', 'lime', 'orange'];
  let bulbs = '';
  for (let i = 0; i < 48; i++) bulbs += `<span class="bulb ${colours[i % colours.length]}" style="--i:${i}"></span>`;
  $('#garland').innerHTML = `<div class="wire"></div>${bulbs}`;
}

// ---------- "Sleeps to Christmas" sign ----------
function xmasSignHTML() {
  const n = sleepsToChristmas();
  if (n === 0) {
    return `<div class="xmas-sign" ${sayAttr([{ t: "It's Christmas Day! Merry Christmas, Louie!" }])}>
      <span class="xs-tree">🎅</span><span class="xs-label big">It's Christmas!</span></div>`;
  }
  const digits = String(n).split('').map(d =>
    `<span class="roll" data-d="${d}"><span class="roll-col">${'0123456789'.split('').map(x => `<span>${x}</span>`).join('')}</span></span>`).join('');
  const words = n === 1 ? 'sleep to' : 'sleeps to';
  return `<div class="xmas-sign" ${sayAttr([{ t: `${n} ${n === 1 ? 'sleep' : 'sleeps'} until Christmas!` }])}>
      <span class="xs-tree">🎄</span>
      <span class="xs-num">${digits}</span>
      <span class="xs-label">${words}<br><b>Christmas!</b></span>
    </div>`;
}
// Roll the digits up into place
function animateXmasSign(root) {
  $$('.roll', root).forEach((r, i) => {
    const col = $('.roll-col', r);
    col.style.transform = 'translateY(0)';
    setTimeout(() => { col.style.transform = `translateY(-${+r.dataset.d * 1.3}em)`; }, 250 + i * 250);
  });
}

function setupChristmas() {
  buildBackdrop();
  buildGarland();
  startSnow();
}
