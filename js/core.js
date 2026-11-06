'use strict';
/* =========================================================
   Core: helpers, saved progress, sound effects, voice
   ========================================================= */

// ---------- Helpers ----------
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const shuffle = arr => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
function h(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}
const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const sayAttr = parts => `data-say='${JSON.stringify(parts).replace(/'/g, '&#39;')}'`;

// ---------- Time words ----------
const nextHour = h => (h % 12) + 1;
const prevHour = h => (h === 1 ? 12 : h - 1);
// What kind of time is it, and at which stage does Louie learn it?
function kindOf(m) {
  if (m === 0) return 'oclock';
  if (m === 30) return 'half';
  if (m === 15 || m === 45) return 'quarter';
  return 'other';
}
const KIND_STAGE = { oclock: 1, half: 2, quarter: 3, other: 4 };
const MIN_WORDS = { 5: 'five', 10: 'ten', 20: 'twenty', 25: 'twenty-five' };

// Voice parts for a time, e.g. 7:30 -> ['halfpast', 'n7']
function timeParts(h, m) {
  if (m === 0) return ['n' + h, 'oclock'];
  if (m === 30) return ['halfpast', 'n' + h];
  if (m === 15) return ['quarterpast', 'n' + h];
  if (m === 45) return ['quarterto', 'n' + nextHour(h)];
  if (m < 30) return [{ t: (MIN_WORDS[m] || m + ' minutes') + ' past' }, 'n' + h];
  return [{ t: (MIN_WORDS[60 - m] || (60 - m) + ' minutes') + ' to' }, 'n' + nextHour(h)];
}
// Display words for a time, with the number in bold
function timeLabel(h, m) {
  if (m === 0) return `<b>${h}</b> o'clock`;
  if (m === 30) return `half past <b>${h}</b>`;
  if (m === 15) return `quarter past <b>${h}</b>`;
  if (m === 45) return `quarter to <b>${nextHour(h)}</b>`;
  if (m < 30) return `${MIN_WORDS[m] || m + ' minutes'} past <b>${h}</b>`;
  return `${MIN_WORDS[60 - m] || (60 - m) + ' minutes'} to <b>${nextHour(h)}</b>`;
}
const timePlain = (h, m) => timeLabel(h, m).replace(/<\/?b>/g, '');
const digital = (h, m) => `${h}:${String(m).padStart(2, '0')}`;

// ---------- Content ----------
const DEFAULT_ROUTINE = [
  { id: 'breakfast', emoji: '🥣', name: 'Breakfast', h: 7, m: 30 },
  { id: 'school', emoji: '🎒', name: 'School', h: 8, m: 40 },
  { id: 'dinner', emoji: '🍝', name: 'Dinner', h: 5, m: 15 },
  { id: 'bath', emoji: '🛁', name: 'Bath time', h: 6, m: 30 },
  { id: 'bed', emoji: '🛏️', name: 'Bedtime', h: 7, m: 0 },
];

const STICKERS = [
  { e: '⚽', n: 'Football' }, { e: '🕷️', n: 'Spider' }, { e: '🐻', n: 'Bear' },
  { e: '🦸', n: 'Superhero' }, { e: '🐹', n: 'Little critter' }, { e: '🥅', n: 'Goal net' },
  { e: '🕸️', n: 'Spider web' }, { e: '🍯', n: 'Honey' }, { e: '👟', n: 'Football boot' },
  { e: '🏆', n: 'Trophy' }, { e: '🌲', n: 'Forest tree' }, { e: '🧢', n: 'Cap' },
  { e: '🎄', n: 'Christmas tree' }, { e: '⛄', n: 'Snowman' }, { e: '🎁', n: 'Present' },
  { e: '🥇', n: 'Gold medal' }, { e: '🌈', n: 'Rainbow' }, { e: '🦌', n: 'Reindeer' },
  { e: '🦖', n: 'Dinosaur' }, { e: '🎅', n: 'Father Christmas' }, { e: '🍕', n: 'Pizza' },
  { e: '🐶', n: 'Puppy' }, { e: '❄️', n: 'Snowflake' }, { e: '🌟', n: 'Super star' },
];

// Every phrase the game says. Mum can record any of these in the grown-ups area.
const NUM_WORDS = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const PHRASES = [
  ...NUM_WORDS.slice(1).map((w, i) => ['n' + (i + 1), w, 'Numbers']),
  ['oclock', "o'clock", 'Clock words'],
  ['halfpast', 'half past', 'Clock words'],
  ['quarterpast', 'quarter past', 'Clock words'],
  ['quarterto', 'quarter to', 'Clock words'],
  ['its', "It's", 'Clock words'],
  ['q_whattime', 'What time is it?', 'Questions'],
  ['q_make', 'Can you make the clock say', 'Questions'],
  ['q_which', 'Which clock says', 'Questions'],
  ['is_at', 'is at', 'Questions'],
  ['p_goal', 'GOAL!', 'Praise'],
  ['p_welldone', 'Well done, Louie!', 'Praise'],
  ['p_amazing', 'Amazing!', 'Praise'],
  ['p_brilliant', 'Brilliant!', 'Praise'],
  ['p_youdidit', 'You did it!', 'Praise'],
  ['p_yay', 'Yay!', 'Praise'],
  ['h_nearly', "Ooh, nearly! Let's look again.", 'Hints'],
  ['h_short', 'Look at the short red hand. Which number is it pointing to?', 'Hints'],
  ['h_half', 'The long blue hand is pointing down. That means half past!', 'Hints'],
  ['h_halfshort', 'Now look at the short red hand. Which number has it just gone past?', 'Hints'],
  ['h_find', 'Can you find the number', 'Hints'],
  ['e_breakfast', 'Breakfast', "Louie's day"],
  ['e_school', 'School', "Louie's day"],
  ['e_dinner', 'Dinner', "Louie's day"],
  ['e_bath', 'Bath time', "Louie's day"],
  ['e_bed', 'Bedtime', "Louie's day"],
  ['i_hello', 'Hi Louie!', 'Menus & buddies'],
  ['i_pick', 'Who do you want to play with today?', 'Menus & buddies'],
  ['i_whatplay', 'What shall we play?', 'Menus & buddies'],
  ['i_playground', "Move the hands and I'll tell you the time!", 'Menus & buddies'],
  ['i_pressball', "Press the football when you're ready!", 'Menus & buddies'],
  ['i_sticker', 'You got a new sticker!', 'Menus & buddies'],
  ['i_stickerbook', 'Here are all your stickers!', 'Menus & buddies'],
  ['i_trophy', 'You won a trophy!', 'Menus & buddies'],
  ['i_trophy1', "You can read o'clock! Now let's learn half past!", 'Menus & buddies'],
  ['i_trophy2', "You can read half past! You're a clock champion!", 'Menus & buddies'],
  ['i_seeyou', 'Ten stars today! See you tomorrow, Louie!', 'Menus & buddies'],
  ['i_dayintro', "Let's look at Louie's day!", 'Menus & buddies'],
  ['m_play', 'Play with the clock', 'Menus & buddies'],
  ['m_what', 'What time is it?', 'Menus & buddies'],
  ['m_make', 'Make the time', 'Menus & buddies'],
  ['m_day', "Louie's day", 'Menus & buddies'],
  ['m_stickers', 'Sticker book', 'Menus & buddies'],
  ['t_home', 'Home', 'Menus & buddies'],
  ['x_short', 'Move the short red hand', 'Menus & buddies'],
  ['x_long', 'Move the long blue hand', 'Menus & buddies'],
  ['x_surprise', 'Surprise!', 'Menus & buddies'],
  ['c_hero', 'Webster the web hero', 'Menus & buddies'],
  ['c_bear', 'Bruno the bear', 'Menus & buddies'],
  ['c_critters', 'The Nibblers', 'Menus & buddies'],
  ['hi_hero', "I'm Webster! Let's play!", 'Menus & buddies'],
  ['hi_bear', "I'm Bruno! Let's play!", 'Menus & buddies'],
  ['hi_critters', "We're the Nibblers! Let's play!", 'Menus & buddies'],
];
const PHRASE_TEXT = Object.fromEntries(PHRASES.map(([k, t]) => [k, t]));

// ---------- Saved progress (localStorage) ----------
const Store = {
  KEY: 'louieClock.v1',
  state: null,
  defaults() {
    return {
      mascot: null,
      stage: 1,                 // 1 = o'clock, 2 = half past
      halfMastered: false,
      starsTotal: 0,
      daily: {},                // 'YYYY-MM-DD' -> stars
      results: { oclock: [], half: [] },   // last 10 first-try results (1/0)
      totals: { oclock: { right: 0, tries: 0 }, half: { right: 0, tries: 0 } },
      mistakes: {},             // '7:30' -> count
      routine: DEFAULT_ROUTINE.map(r => ({ ...r })),
      sound: true,
      ttsRate: 0.9,
      voiceName: null,
    };
  },
  load() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(this.KEY)); } catch (e) { /* ignore */ }
    const d = this.defaults();
    this.state = Object.assign(d, saved || {});
    for (const k of ['oclock', 'half']) {
      if (!Array.isArray(this.state.results[k])) this.state.results[k] = [];
      if (!this.state.totals[k]) this.state.totals[k] = { right: 0, tries: 0 };
    }
  },
  save() {
    try { localStorage.setItem(this.KEY, JSON.stringify(this.state)); } catch (e) { /* ignore */ }
  },
  dayKey(d = new Date()) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },
  starsToday() { return this.state.daily[this.dayKey()] || 0; },
  stickersUnlocked() { return Math.min(STICKERS.length, Math.floor(this.state.starsTotal / 5)); },
  addStar() {
    const s = this.state, t = this.dayKey();
    s.starsTotal++;
    s.daily[t] = (s.daily[t] || 0) + 1;
    const idx = s.starsTotal / 5;
    const newSticker = Number.isInteger(idx) && idx <= STICKERS.length ? STICKERS[idx - 1] : null;
    this.save();
    return { newSticker, dailyGoal: s.daily[t] === 10 };
  },
  // Record a first-try answer. Returns 'stage2' / 'halfDone' when Louie levels up.
  record(kind, correct, label) {
    const s = this.state;
    if (!s.results[kind]) return null;
    const r = s.results[kind];
    r.push(correct ? 1 : 0);
    if (r.length > 10) r.shift();
    s.totals[kind].tries++;
    if (correct) s.totals[kind].right++;
    else s.mistakes[label] = (s.mistakes[label] || 0) + 1;
    const score = r.reduce((a, b) => a + b, 0);
    let event = null;
    if (kind === 'oclock' && s.stage === 1 && r.length >= 10 && score >= 8) { s.stage = 2; event = 'stage2'; }
    else if (kind === 'half' && s.stage >= 2 && !s.halfMastered && r.length >= 10 && score >= 8) { s.halfMastered = true; event = 'halfDone'; }
    this.save();
    return event;
  },
  resetProgress() {
    const keep = { mascot: this.state.mascot, routine: this.state.routine, sound: this.state.sound, ttsRate: this.state.ttsRate, voiceName: this.state.voiceName };
    this.state = Object.assign(this.defaults(), keep);
    this.save();
  },
};

// ---------- Sound effects (made with Web Audio, no files needed) ----------
const Sound = {
  ctx: null,
  ensureCtx() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  },
  on() { return Store.state.sound && this.ensureCtx(); },
  tone(freq, start, dur, type = 'sine', vol = 0.2) {
    const c = this.ctx, t = c.currentTime + start;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t); o.stop(t + dur + 0.05);
  },
  pop() { if (!this.on()) return; this.tone(660, 0, 0.12, 'sine', 0.15); this.tone(990, 0.05, 0.1, 'sine', 0.1); },
  tick() { if (!this.on()) return; this.tone(1400, 0, 0.04, 'square', 0.04); },
  chime() { if (!this.on()) return; [523, 659, 784, 1047].forEach((f, i) => this.tone(f, i * 0.09, 0.4, 'triangle', 0.18)); },
  soft() { if (!this.on()) return; this.tone(392, 0, 0.25, 'triangle', 0.12); this.tone(330, 0.18, 0.35, 'triangle', 0.12); },
  sparkle() { if (!this.on()) return; [1047, 1319, 1568, 2093, 2637].forEach((f, i) => this.tone(f, i * 0.07, 0.3, 'sine', 0.12)); },
  whistle(start = 0) {
    const c = this.ctx;
    [0, 0.28].forEach((off, i) => {
      const t = c.currentTime + start + off, len = i ? 0.45 : 0.18;
      const o = c.createOscillator(), lfo = c.createOscillator(), lg = c.createGain(), g = c.createGain();
      o.type = 'sine'; o.frequency.value = 2800;
      lfo.frequency.value = 32; lg.gain.value = 140;
      lfo.connect(lg).connect(o.frequency);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.09, t + 0.02);
      g.gain.setValueAtTime(0.09, t + len - 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      o.connect(g).connect(c.destination);
      o.start(t); lfo.start(t); o.stop(t + len + 0.05); lfo.stop(t + len + 0.05);
    });
  },
  crowd(start = 0, dur = 2.2) {
    const c = this.ctx, t = c.currentTime + start;
    const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(); src.buffer = buf;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.5;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.35, t + 0.35);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp).connect(g).connect(c.destination);
    src.start(t); src.stop(t + dur);
  },
  goal() {
    if (!this.on()) return;
    this.crowd(0.05);
    this.whistle(0);
    [523, 659, 784, 1047, 1319].forEach((f, i) => this.tone(f, 0.4 + i * 0.08, 0.4, 'triangle', 0.14));
  },
};

// ---------- Voice: Mum's recordings, with computer voice as a fallback ----------
const Voice = {
  db: null, urls: {}, token: 0, voice: null, voices: [],
  audio: null, audioResolve: null, speakResolve: null,

  async init() {
    this.pickVoice();
    if (window.speechSynthesis) speechSynthesis.onvoiceschanged = () => this.pickVoice();
    try {
      this.db = await new Promise((res, rej) => {
        const r = indexedDB.open('louieClockVoice', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('clips');
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      });
      const clips = await this.allClips();
      for (const [k, blob] of clips) this.urls[k] = URL.createObjectURL(blob);
    } catch (e) {
      console.warn('Voice recordings unavailable', e);
    }
  },
  allClips() {
    return new Promise(res => {
      const out = [];
      const req = this.db.transaction('clips').objectStore('clips').openCursor();
      req.onsuccess = () => {
        const c = req.result;
        if (c) { out.push([c.key, c.value]); c.continue(); } else res(out);
      };
      req.onerror = () => res(out);
    });
  },
  idb(mode, fn) {
    return new Promise((res, rej) => {
      if (!this.db) return rej(new Error('Storage is not available in this browser.'));
      const tx = this.db.transaction('clips', mode);
      fn(tx.objectStore('clips'));
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
  },
  async saveClip(key, blob) {
    await this.idb('readwrite', s => s.put(blob, key));
    if (this.urls[key]) URL.revokeObjectURL(this.urls[key]);
    this.urls[key] = URL.createObjectURL(blob);
  },
  async deleteClip(key) {
    await this.idb('readwrite', s => s.delete(key));
    if (this.urls[key]) URL.revokeObjectURL(this.urls[key]);
    delete this.urls[key];
  },
  async deleteAll() {
    await this.idb('readwrite', s => s.clear());
    Object.values(this.urls).forEach(u => URL.revokeObjectURL(u));
    this.urls = {};
  },
  has(key) { return !!this.urls[key]; },
  count() { return Object.keys(this.urls).length; },

  pickVoice() {
    if (!window.speechSynthesis) return;
    const vs = speechSynthesis.getVoices();
    const gb = vs.filter(x => /en[-_]GB/i.test(x.lang));
    this.voices = gb.length ? gb : vs.filter(x => /^en/i.test(x.lang));
    let v = vs.find(x => x.name === Store.state.voiceName);
    if (!v) {
      const pref = ['Serena', 'Kate', 'Martha', 'Stephanie', 'Google UK English Female', 'Daniel', 'Arthur'];
      v = pref.map(n => gb.find(x => x.name.includes(n))).find(Boolean)
        || gb.find(x => x.localService) || gb[0] || vs.find(x => /^en/i.test(x.lang));
    }
    this.voice = v || null;
  },
  // Safari needs speech to be started from a click once
  unlock() {
    try {
      if (window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance(' ');
        u.volume = 0;
        speechSynthesis.speak(u);
      }
    } catch (e) { /* ignore */ }
  },

  // Turn phrase keys into things to play: recordings or computer speech
  expand(parts) {
    const segs = [];
    for (const p of parts) {
      if (p == null) continue;
      if (typeof p === 'string') {
        if (this.urls[p]) segs.push({ url: this.urls[p] });
        else segs.push({ text: PHRASE_TEXT[p] ?? p });
      } else if (p.t) segs.push({ text: p.t });
    }
    const out = [];
    for (const s of segs) {
      const last = out[out.length - 1];
      if (s.text != null && last && last.text != null) {
        const join = /^[A-Z]/.test(s.text) && !/[.!?,]$/.test(last.text) ? '. ' : ' ';
        last.text += join + s.text;
      } else out.push({ ...s });
    }
    return out;
  },
  async say(parts) {
    const my = ++this.token;
    const wasBusy = this.stopPlayback();
    if (wasBusy) await sleep(60);
    if (my !== this.token) return;
    for (const s of this.expand(parts)) {
      if (my !== this.token) return;
      if (s.url) await this.playUrl(s.url);
      else await this.speak(s.text);
    }
  },
  stop() { this.token++; this.stopPlayback(); },
  stopPlayback() {
    let busy = false;
    try {
      if (window.speechSynthesis && (speechSynthesis.speaking || speechSynthesis.pending)) busy = true;
      if (window.speechSynthesis) speechSynthesis.cancel();
    } catch (e) { /* ignore */ }
    if (this.audio) {
      busy = true;
      this.audio.pause();
      this.audio = null;
      const r = this.audioResolve; this.audioResolve = null; r && r();
    }
    if (this.speakResolve) { const r = this.speakResolve; this.speakResolve = null; r(); }
    return busy;
  },
  playUrl(url) {
    return new Promise(res => {
      const a = new Audio(url);
      this.audio = a;
      this.audioResolve = res;
      const done = () => { if (this.audio === a) { this.audio = null; this.audioResolve = null; } res(); };
      a.onended = done; a.onerror = done;
      a.play().catch(done);
    });
  },
  speak(text) {
    return new Promise(res => {
      if (!window.speechSynthesis) return res();
      const u = new SpeechSynthesisUtterance(text);
      if (this.voice) { u.voice = this.voice; u.lang = this.voice.lang; } else u.lang = 'en-GB';
      u.rate = Store.state.ttsRate || 0.9;
      u.pitch = 1.05;
      let finished = false;
      const fin = () => {
        if (finished) return;
        finished = true; clearTimeout(to);
        if (this.speakResolve === fin) this.speakResolve = null;
        res();
      };
      const to = setTimeout(fin, 2500 + text.length * 90);
      this.speakResolve = fin;
      this.utt = u; // keep a reference so Chrome doesn't drop the 'end' event
      u.onend = fin; u.onerror = fin;
      speechSynthesis.speak(u);
    });
  },
};

// ---------- Recording Mum's voice ----------
async function trimToWav(blob) {
  const ctx = Sound.ensureCtx();
  const buf = await ctx.decodeAudioData(await blob.arrayBuffer());
  const data = buf.getChannelData(0), sr = buf.sampleRate;
  let peak = 0;
  for (let i = 0; i < data.length; i++) { const a = Math.abs(data[i]); if (a > peak) peak = a; }
  const th = Math.max(0.02, peak * 0.08);
  let s = 0; while (s < data.length && Math.abs(data[s]) < th) s++;
  let e = data.length - 1; while (e > s && Math.abs(data[e]) < th) e--;
  const pad = Math.floor(sr * 0.08);
  s = Math.max(0, s - pad); e = Math.min(data.length, e + pad * 2);
  if (e - s < sr * 0.15) { s = 0; e = data.length; }
  const gain = peak > 0 ? Math.min(4, 0.9 / peak) : 1;
  return encodeWav(data.subarray(s, e), sr, gain);
}
function encodeWav(samples, sr, gain) {
  const buf = new ArrayBuffer(44 + samples.length * 2), v = new DataView(buf);
  const w = (o, str) => { for (let i = 0; i < str.length; i++) v.setUint8(o + i, str.charCodeAt(i)); };
  w(0, 'RIFF'); v.setUint32(4, 36 + samples.length * 2, true); w(8, 'WAVE'); w(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  w(36, 'data'); v.setUint32(40, samples.length * 2, true);
  for (let i = 0, o = 44; i < samples.length; i++, o += 2) {
    const x = Math.max(-1, Math.min(1, samples[i] * gain));
    v.setInt16(o, x < 0 ? x * 0x8000 : x * 0x7FFF, true);
  }
  return new Blob([buf], { type: 'audio/wav' });
}

const Recorder = {
  stream: null, rec: null, key: null, chunks: [], timer: null, onAuto: null,
  get active() { return !!this.rec; },
  async start(key) {
    if (!navigator.mediaDevices || !window.MediaRecorder) throw new Error('Recording is not supported in this browser. Please try Google Chrome.');
    if (!this.stream) this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
    Voice.stop();
    this.chunks = []; this.key = key;
    const type = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find(t => MediaRecorder.isTypeSupported(t));
    this.rec = new MediaRecorder(this.stream, type ? { mimeType: type } : undefined);
    this.rec.ondataavailable = e => { if (e.data && e.data.size) this.chunks.push(e.data); };
    this.rec.start();
    this.timer = setTimeout(() => this.onAuto && this.onAuto(), 8000);
  },
  stop() {
    return new Promise(res => {
      const rec = this.rec, key = this.key;
      clearTimeout(this.timer);
      if (!rec) return res(null);
      rec.onstop = async () => {
        const raw = new Blob(this.chunks, { type: rec.mimeType || 'audio/webm' });
        let blob = raw;
        try { blob = await trimToWav(raw); } catch (e) { console.warn('Could not trim recording', e); }
        try { await Voice.saveClip(key, blob); } catch (e) { alert('Sorry, the recording could not be saved: ' + e.message); }
        res(key);
      };
      this.rec = null; this.key = null;
      rec.stop();
    });
  },
  release() {
    clearTimeout(this.timer);
    if (this.rec && this.rec.state !== 'inactive') { try { this.rec.onstop = null; this.rec.stop(); } catch (e) { /* ignore */ } }
    this.rec = null; this.key = null;
    if (this.stream) { this.stream.getTracks().forEach(t => t.stop()); this.stream = null; }
  },
};
