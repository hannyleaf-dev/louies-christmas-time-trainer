'use strict';
/* =========================================================
   Grown-ups' corner: progress, Mum's voice, routine, settings
   ========================================================= */

Screens.parent = el => {
  el.innerHTML = `<div class="parent">
      <div class="p-head">
        <h1>Grown-ups' corner</h1>
        <button class="p-back">← Back to the game</button>
      </div>
      <nav class="p-tabs">
        <button data-tab="progress" class="on">Progress</button>
        <button data-tab="voice">Mum's voice</button>
        <button data-tab="routine">Louie's day</button>
        <button data-tab="settings">Settings</button>
      </nav>
      <section class="p-body"></section>
    </div>`;
  const body = $('.p-body', el);
  const tabs = { progress: pProgress, voice: pVoice, routine: pRoutine, settings: pSettings };
  const show = name => {
    if (Recorder.active) Recorder.release();
    $$('.p-tabs button', el).forEach(b => b.classList.toggle('on', b.dataset.tab === name));
    tabs[name](body);
  };
  $$('.p-tabs button', el).forEach(b => b.onclick = () => show(b.dataset.tab));
  $('.p-back', el).onclick = () => go('home');
  App.cleanup = () => Recorder.release();
  show('progress');
};

function pProgress(b) {
  const s = Store.state;
  const acc = k => { const t = s.totals[k]; return t.tries ? Math.round(100 * t.right / t.tries) + '%' : '–'; };
  const dots = k => s.results[k].length
    ? s.results[k].map(x => `<span class="dot ${x ? 'ok' : 'no'}">${x ? '✓' : '✗'}</span>`).join('')
    : '<em>No answers yet</em>';
  const last10 = k => { const r = s.results[k]; return r.length ? `${r.reduce((a, c) => a + c, 0)} / ${r.length}` : '–'; };
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    days.push({ label: d.toLocaleDateString('en-GB', { weekday: 'short' }), n: s.daily[Store.dayKey(d)] || 0 });
  }
  const max = Math.max(10, ...days.map(d => d.n));
  const tricky = Object.entries(s.mistakes).sort((a, c) => c[1] - a[1]).slice(0, 6);

  b.innerHTML = `
    <div class="p-grid">
      <div class="p-card">
        <h3>Stage</h3>
        <select id="p-stage">
          <option value="1" ${s.stage === 1 ? 'selected' : ''}>Stage 1: o'clock</option>
          <option value="2" ${s.stage >= 2 ? 'selected' : ''}>Stage 2: o'clock + half past</option>
        </select>
        <p class="muted">Louie moves up automatically when he gets 8 of his last 10 o'clock questions right first time.
        Half past also unlocks breakfast (7:30) and bath (6:30) in “Louie's day”.</p>
        ${s.halfMastered ? '<p>🏆 Half past mastered!</p>' : ''}
      </div>
      <div class="p-card">
        <h3>Stars</h3>
        <div class="p-big">${Store.starsToday()} <small>today</small></div>
        <p>${s.starsTotal} stars in total · ${Store.stickersUnlocked()} / ${STICKERS.length} stickers</p>
        <div class="bars">${days.map(d => `<div class="bar"><div class="bar-fill" style="height:${Math.round(100 * d.n / max)}%"></div><span class="bar-n">${d.n || ''}</span><span class="bar-l">${d.label}</span></div>`).join('')}</div>
      </div>
      <div class="p-card">
        <h3>O'clock</h3>
        <p>Last 10 (first try): <b>${last10('oclock')}</b> · All time: <b>${acc('oclock')}</b></p>
        <div class="dots">${dots('oclock')}</div>
      </div>
      <div class="p-card">
        <h3>Half past</h3>
        <p>Last 10 (first try): <b>${last10('half')}</b> · All time: <b>${acc('half')}</b></p>
        <div class="dots">${dots('half')}</div>
      </div>
      <div class="p-card wide">
        <h3>Tricky times</h3>
        ${tricky.length ? `<ul class="tricky">${tricky.map(([t, n]) => `<li><b>${t}</b> missed ${n}×</li>`).join('')}</ul>` : '<p class="muted">Nothing tricky yet.</p>'}
      </div>
    </div>`;
  $('#p-stage', b).onchange = e => { s.stage = +e.target.value; Store.save(); };
}

function pVoice(b) {
  const groups = {};
  PHRASES.forEach(([key, text, group]) => (groups[group] = groups[group] || []).push([key, text]));
  const samples = [
    { label: "It's seven o'clock", parts: ['its', 'n7', 'oclock'] },
    { label: 'Half past seven', parts: ['halfpast', 'n7'] },
    { label: "Bedtime is at seven o'clock", parts: ['e_bed', 'is_at', 'n7', 'oclock'] },
    { label: 'GOAL! Well done, Louie!', parts: ['p_goal', 'p_welldone'] },
  ];
  b.innerHTML = `
    <div class="p-card">
      <h3>Record your voice</h3>
      <p>Louie will hear <b>your</b> voice instead of the computer's. Press <b>● Record</b>, say the words, then press <b>■ Stop</b>.
      Small pieces are joined together, so “half past” + “seven” becomes “half past seven”.
      Anything you haven't recorded yet uses the computer voice.</p>
      <p class="muted">Tip: start with the Numbers and Clock words. Recordings stay on this laptop and are never uploaded.
      Clearing the browser's data would delete them.</p>
      <p><b class="rec-count"></b></p>
      <div class="p-try">${samples.map((s, i) => `<button class="p-btn" data-sample="${i}">▶ ${s.label}</button>`).join('')}</div>
    </div>
    ${Object.entries(groups).map(([g, list]) => `
      <div class="p-card">
        <h3>${g}</h3>
        ${list.map(([key, text]) => `
          <div class="rec-row" data-key="${key}">
            <div class="rec-text">“${text}”</div>
            <span class="rec-status"></span>
            <button class="p-btn rec">● Record</button>
            <button class="p-btn play" title="Listen">▶</button>
            <button class="p-btn del" title="Delete recording">✕</button>
          </div>`).join('')}
      </div>`).join('')}`;

  const refresh = () => {
    $$('.rec-row', b).forEach(row => {
      const has = Voice.has(row.dataset.key);
      $('.rec-status', row).textContent = has ? '✓ Mum' : 'Computer';
      $('.rec-status', row).className = 'rec-status ' + (has ? 'mum' : '');
      $('.del', row).disabled = !has;
    });
    $('.rec-count', b).textContent = `${Voice.count()} of ${PHRASES.length} phrases recorded`;
  };
  refresh();

  $$('[data-sample]', b).forEach(btn => btn.onclick = () => Voice.say(samples[+btn.dataset.sample].parts));

  let activeRow = null;
  const stopActive = async () => {
    if (!activeRow) return;
    const row = activeRow;
    activeRow = null;
    row.classList.remove('recording');
    $('.rec', row).textContent = '… saving';
    await Recorder.stop();
    $('.rec', row).textContent = '● Record';
    refresh();
    Voice.say([row.dataset.key]);
  };
  Recorder.onAuto = stopActive;

  $$('.rec-row', b).forEach(row => {
    const key = row.dataset.key;
    $('.rec', row).onclick = async () => {
      if (activeRow === row) return stopActive();
      if (activeRow) await stopActive();
      try {
        await Recorder.start(key);
        activeRow = row;
        row.classList.add('recording');
        $('.rec', row).textContent = '■ Stop';
      } catch (e) {
        alert('Could not use the microphone. Please allow microphone access for this page and try again.\n\n' + e.message);
      }
    };
    $('.play', row).onclick = () => Voice.say([key]);
    $('.del', row).onclick = async () => {
      if (!confirm(`Delete your recording of “${PHRASE_TEXT[key]}”?`)) return;
      await Voice.deleteClip(key);
      refresh();
    };
  });
}

function pRoutine(b) {
  const s = Store.state;
  const stageNote = r => {
    const k = kindOf(r.m);
    return { oclock: "Stage 1 (o'clock): available now", half: 'Stage 2 (half past)', quarter: 'Coming later (quarter past / to)', other: 'Coming later (harder time)' }[k]
      + (KIND_STAGE[k] <= s.stage ? ' ✓' : '');
  };
  b.innerHTML = `
    <div class="p-card">
      <h3>Louie's day</h3>
      <p>These times appear in the “Louie's day” game. Each card only shows once Louie has reached the stage for that kind of time.</p>
      <div class="routine">${s.routine.map((r, i) => `
        <div class="r-row" data-i="${i}">
          <span class="r-emoji">${r.emoji}</span><span class="r-name">${r.name}</span>
          <select class="r-h">${Array.from({ length: 12 }, (_, k) => k + 1).map(v => `<option ${v === r.h ? 'selected' : ''}>${v}</option>`).join('')}</select>
          :
          <select class="r-m">${Array.from({ length: 12 }, (_, k) => k * 5).map(v => `<option value="${v}" ${v === r.m ? 'selected' : ''}>${String(v).padStart(2, '0')}</option>`).join('')}</select>
          <span class="r-note">${stageNote(r)}</span>
        </div>`).join('')}
      </div>
      <button class="p-btn" id="r-reset">Reset to the original times</button>
    </div>`;
  $$('.r-row', b).forEach(row => {
    const r = s.routine[+row.dataset.i];
    const upd = () => {
      r.h = +$('.r-h', row).value; r.m = +$('.r-m', row).value;
      Store.save();
      $('.r-note', row).textContent = stageNote(r);
    };
    $('.r-h', row).onchange = upd; $('.r-m', row).onchange = upd;
  });
  $('#r-reset', b).onclick = () => { s.routine = DEFAULT_ROUTINE.map(r => ({ ...r })); Store.save(); pRoutine(b); };
}

function pSettings(b) {
  const s = Store.state;
  const voices = Voice.voices || [];
  b.innerHTML = `
    <div class="p-grid">
      <div class="p-card">
        <h3>Sound</h3>
        <label class="p-check"><input type="checkbox" id="s-sound" ${s.sound ? 'checked' : ''}> Sound effects (whistle, crowd, chimes)</label>
        <h3>Computer voice</h3>
        <p class="muted">Used for anything you haven't recorded.</p>
        <select id="s-voice">${voices.length ? voices.map(v => `<option ${Voice.voice && v.name === Voice.voice.name ? 'selected' : ''}>${v.name}</option>`).join('') : '<option>Default voice</option>'}</select>
        <label>Speed <input type="range" id="s-rate" min="0.6" max="1.2" step="0.05" value="${s.ttsRate}"></label>
        <button class="p-btn" id="s-test">▶ Test</button>
      </div>
      <div class="p-card">
        <h3>Buddy</h3>
        <p>Louie is playing with <b>${currentMascot().name}</b>.</p>
        <button class="p-btn" id="s-buddy">Let Louie choose again</button>
      </div>
      <div class="p-card">
        <h3>Start again</h3>
        <p class="muted">Progress is saved in this browser on this laptop.</p>
        <button class="p-btn danger" id="s-reset">Reset Louie's progress</button>
        <button class="p-btn danger" id="s-delvoice">Delete all voice recordings</button>
      </div>
    </div>`;
  $('#s-sound', b).onchange = e => { s.sound = e.target.checked; Store.save(); };
  $('#s-voice', b).onchange = e => { s.voiceName = e.target.value; Store.save(); Voice.pickVoice(); };
  $('#s-rate', b).oninput = e => { s.ttsRate = +e.target.value; Store.save(); };
  $('#s-test', b).onclick = () => Voice.speak("Hi Louie! It's half past seven.");
  $('#s-buddy', b).onclick = () => go('picker');
  $('#s-reset', b).onclick = () => {
    if (confirm("Reset all of Louie's stars, stickers, trophies and stage? (Buddy, routine and recordings are kept.)")) { Store.resetProgress(); pSettings(b); }
  };
  $('#s-delvoice', b).onclick = async () => {
    if (confirm('Delete ALL your voice recordings?')) { await Voice.deleteAll(); alert('Recordings deleted.'); }
  };
}
