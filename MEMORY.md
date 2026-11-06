# MEMORY: Louie's Christmas-tell-the-time-trainer

Project log. Read this together with CLAUDE.md at the start of every session.

## Project context
- Website game for Louie (age 4) to learn to tell the time on an analogue clock.
- Must be fun, friendly and gamified. Louie should enjoy it.
- Owner: Hannah (Louie's mum).
- Full spec lives in `PRD.md`.

## About Louie (from Hannah, 5 Nov 2026)
- Plays mostly on a **laptop**.
- Loves **Spider-Man, Grizzy and the Lemmings, Arsenal**.
- **Knows his numbers.** Gets **o'clock right ~70%** of the time.
- Routine: breakfast **7:30**, school **8:40**, dinner **5:15**, bath **6:30**, bed **7:00**.

## Progress
- **5 Nov 2026, session 1:**
  - Read CLAUDE.md (MEMORY.md was empty). Wrote PRD draft v1.
  - Hannah answered all six open questions. Updated the PRD to draft v2.

- **5 Nov 2026, session 1 (cont.):** Built the MVP. Tested in the browser at laptop size (1366×800):
  - splash → buddy picker → home
  - What time is it? (wrong-answer hint + GOAL!)
  - Make the time (mouse drag + Done)
  - Playground (dragging the long hand to 6 → "half past 3")
  - Louie's day (bedtime at stage 1; breakfast and bath unlock at stage 2)
  - sticker and trophy pop-ups, sticker book, grown-ups area (all 4 tabs)
  - Voice storage and stitching were checked with a generated test sound. **Not yet tested with a real microphone.**

## How to play / files
- Open `index.html` in **Google Chrome** (double-click, or drag it into Chrome). No internet or install needed.
- Grown-ups' corner: **press and hold the "🔒 Grown-ups" button** (top right, also on the start screen) for 3 seconds. A purple bar fills while you hold.
  - 5 Nov 2026: Hannah couldn't find the old lock. It was a tiny faded 40px icon, missing from the start screen and the buddy picker, and it could be pushed off the edge in a narrow window. Replaced it with a labelled button, added it to the start screen, and made the top bar fit narrow windows.
- Files:
  - `index.html`
  - `css/style.css`
  - `js/core.js`: progress, sounds, voice/recording, phrase list
  - `js/clock.js`: the clock
  - `js/mascots.js`: the 3 buddies
  - `js/screens.js`: games, rewards, top bar
  - `js/parent.js`: grown-ups area
  - `js/app.js`: start-up
- Progress is saved in localStorage key `louieClock.v1`. Voice clips are saved in IndexedDB `louieClockVoice` (as trimmed WAV files).
- Testing note: macOS privacy blocks local servers from reading the Desktop, so for testing the files are copied to a scratch folder and served with `/usr/bin/ruby -run -e httpd` (no python/node on this Mac).

- **5 Nov 2026, restyle:** Hannah wanted it to feel more "Bluey": less dated and more visually interesting. We borrowed the soft, sunny, flat-illustration *feel* only, with no Bluey characters, names or logos.
  - Palette (CSS variables in `css/style.css`):
    - coral `#EF6F57` (short hand / "red")
    - cornflower `#4C7FE0` (long hand / "blue")
    - butter yellow `#FFC857`
    - sage `#7CC17A`
    - lilac `#A98BE8`
    - soft navy text `#22345E`
    - cream cards `#FFFDF8`
  - Scenery: sky gradient, sun and clouds (`body::before`), rolling sage hills with a dashed pitch line (`body::after`, inline SVG).
  - Clock: butter-yellow rim on a cream face. Tiles: soft bubble shapes, icons in cream circles, colour-matched shadows. Shadows are navy-tinted rather than black.
  - Webster and the confetti were recoloured to match. The short/long hand colour coding is kept (coral = short, blue = long).

- **5 Nov 2026, Christmas neon restyle** (replaces the pastel look above): Hannah wanted more character and punch, modern bold fonts, neon, and a countdown-to-Christmas backdrop.
  - **Renamed to "Louie's Christmas-tell-the-time-trainer"**: page title, splash neon sign and PRD.
  - **Fonts:** Fredoka (bold, rounded, modern) for everything; Tilt Neon for neon signs. Both load from Google Fonts. Offline, it falls back to the Mac's rounded system font.
  - **Backdrop:** a night sky (navy → purple) with stars, a glowing moon (hidden on home, where the sign sits), falling snow (canvas), and snowy hills with lit-up Christmas trees. Built in `js/xmas.js`.
  - **Neon:** fairy-light garland of twinkling neon bulbs under the top bar (at the top on screens without one). Glowing headings, tiles, Play button, clock, answer hovers and stars.
  - **"Sleeps to Christmas" sign** (top right of home): pink neon box with a swinging 🎄. The digits roll into place, and hovering speaks it. It counts nights to 25 Dec (it was 50 on 5 Nov 2026), shows "It's Christmas!" on the day, then counts to next year.
  - **Santa hats** on all three buddies. 6 stickers swapped for Christmas ones (tree, snowman, present, reindeer, Father Christmas, snowflake).
  - Palette is now punchier: red `#FF5A4E` (short hand), blue `#3D7BFF` (long hand), gold, green, purple, plus neon pink `#FF3EA5`, cyan `#2DE2E6`, gold `#FFD23F`, lime `#B6FF3B`.
  - The neon theme lives in a block at the end of `css/style.css`, so it's easy to swap back after Christmas.

- **5 Nov 2026, GitHub:** Hannah wants the code on GitHub.
  - This Mac has **no git** (only Apple's placeholder that prompts to install developer tools) and **no `gh`**.
  - Hannah chose to **upload via github.com** (drag and drop) into a **private** repo, because the files mention Louie's name and routine. Free GitHub Pages hosting would need a public repo or a paid plan.
  - Added `README.md` and `.gitignore` (ignores `.claude/` and `.DS_Store`). Gave Hannah the upload steps.
  - Future updates: re-upload changed files on github.com, or install git or GitHub Desktop later.

## Key decisions
- **Learning order:** meet the clock → o'clock → half past → "my day" → quarter past/to.
- **Louie starts at Stage 1 (o'clock).** Target is 80%+ before half past unlocks. Stage gate: ~8 of the last 10 correct; parent can unlock by hand.
- **Mascot: Louie chooses** on first play from 3 ORIGINAL characters: web-slinging superhero kid (red/blue), big friendly grizzly bear, gang of cheeky critters.
- **Football theme:** red & white, correct answer = "GOAL!" + crowd cheer, stage complete = trophy.
- **No real IP:** no real Spider-Man / Grizzy / Lemmings / Arsenal names, logos or art (copyright/trademark). We make original characters "in the spirit of" them.
- **Voice:** Mum's recorded voice is in the MVP. Phrases are recorded in pieces (numbers, "o'clock", "half past", prompts, praise, hints) and stitched together. Stored in IndexedDB on the laptop, never uploaded. Text-to-speech fills in any gaps.
- **Laptop-first input:** click-a-number and ◀ ▶ arrow buttons as well as drag; keyboard shortcuts; landscape layout; full-screen button.
- **Routine cards unlock by stage:** bedtime 7:00 (o'clock) works now; breakfast 7:30 and bath 6:30 come with half past; dinner 5:15 with quarter past (v2); school 8:40 later ("twenty to").
- **No failure states:** no lives, timers or buzzers. Wrong answers get a gentle hint.
- **Tech:** static HTML/CSS/JS, no server/login/ads/analytics, progress in localStorage.

- **Build details:**
  - Buddies are Webster (web hero), Bruno (bear) and The Nibblers (critters), drawn as SVG.
  - Every right answer = GOAL! with whistle, crowd and confetti, plus 1 star. Every 5 stars = a sticker (24 in total). Trophies for o'clock and half past. 10 stars in a day = "See you tomorrow".
  - Wrong-answer choices are deliberately teaching ones: neighbouring hours, "12 o'clock", and "one hour too many" for half past.
  - Louie's day alternates "which clock?" with "make the clock".
  - When the mouse rests on a button, it's spoken aloud (Louie can't read).
  - Clock numbers are drawn on top of the hands so they stay readable. Grabbing near a hand picks it up.

## Key takeaways / learnings
- Design for a 4-year-old: big targets, 2–3 choices max, 5–10 minute sessions, snapping, tie times to his real day.
- A mouse is harder than touch for a 4-year-old, so always offer click/arrow alternatives to dragging.
- His real routine mixes difficulty levels (o'clock, half past, quarter past, twenty to), so it has to be revealed stage by stage.

## Open questions
- None right now.

## Next steps
- Hannah to try it in Chrome and record her voice (start with Numbers and Clock words).
- Watch Louie play and note anything too hard, too easy or confusing.
- v2 ideas (PRD §12): Make the Time for half past, quarter past (unlocks dinner 5:15), works offline / installable.
