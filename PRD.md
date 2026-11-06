# PRD: Louie's Christmas-tell-the-time-trainer

**Owner:** Hannah (Louie's mum)
**Player:** Louie, age 4
**Status:** Draft v2, 5 Nov 2026 (updated with Hannah's answers)
**Name:** *Louie's Christmas-tell-the-time-trainer* (renamed 5 Nov 2026; was "Louie's Clock Adventure")

---

## 1. Summary

A small, friendly website game that helps Louie learn to tell the time on an analogue clock. It moves step by step from "what is a clock?" to reading o'clock and half past times, and ties those times to his own day (breakfast, park, bath, bed). Every round ends in praise and a reward. Nobody fails.

## 2. Problem & goal

Four-year-olds can learn to read the hour on a clock, but worksheets and abstract explanations don't hold their attention. Louie needs short, playful, repeated practice that feels like a game.

**Goal:** Louie can read and set **o'clock** times on his own, then **half past** times, and enjoys playing enough to ask for it.

### Success measures
| Measure | Target |
|---|---|
| Louie asks to play again | Most days in the first 2 weeks |
| Reads o'clock times correctly | 8 out of 10 within ~3 weeks |
| Reads half past times correctly | 8 out of 10 within ~6 weeks |
| Can play without adult help | Navigates menu → game → reward alone |
| Session ends happy | No tears or frustration (Hannah's judgement) |

## 3. Who it's for

**Louie (primary user)**
- 4 years old: can't read yet, but **knows his numbers**.
- **Already gets o'clock right about 70% of the time**, so he starts at Stage 1 (o'clock), not at the beginning.
- Short attention span: 5–10 minute sessions.
- Plays mostly on a **laptop** (mouse or trackpad, keyboard).
- Loves **Spider-Man, Grizzy and the Lemmings, and Arsenal**.
- Motivated by characters, sounds, collecting things and being told he's clever.

**Hannah (secondary user)**
- Wants to see progress and set the difficulty.
- Wants it safe: no ads, no links out, no accounts, no data collection.

## 4. Design principles for a 4-year-old

1. **No reading required.** Every instruction is spoken aloud and shown with pictures. Text is only a backup.
2. **Big and simple.** Tap targets at least 80px; one task per screen; few choices (2–3 answers, not 4+).
3. **No failure states.** A wrong answer gets a gentle "Ooh, nearly! Let's look again" and a hint, never a buzzer, a lost life or a timer.
4. **Celebrate everything.** Confetti, happy sounds and a cheering mascot after every correct answer.
5. **Small steps.** Learn one thing at a time and repeat it often before moving on.
6. **Connect to real life.** Times link to things Louie does ("8 o'clock is breakfast time!").
7. **Short sessions.** A natural "well done, see you tomorrow!" stop after about 10 rounds.
8. **Calm, not overstimulating.** Bright and cheerful, with no flashing, ads or pop-ups.

## 5. Learning path

UK English throughout ("o'clock", "half past").

| Stage | Skill | What Louie learns |
|---|---|---|
| 0 | **Meet the clock** | The clock has numbers 1–12; there's a short hand and a long hand. |
| 1 | **O'clock** | Long hand points straight up to 12 → read the short hand. "3 o'clock." |
| 2 | **Half past** | Long hand points down to 6 → "half past". Short hand sits between two numbers. |
| 3 | **My day** | Matches o'clock and half past times to daily routine pictures. |
| 4 *(later)* | **Quarter past / quarter to** | Optional stretch once Stages 1–3 are solid. |

Louie moves to the next stage after roughly **8 correct out of the last 10** in the current stage. Hannah can also unlock stages by hand.

**Louie's starting point:** he begins at **Stage 1 (o'clock)**. Stage 0 stays available as free play. At 70% he's close: the aim is to get him to a steady 80%+ (about 1–2 weeks), then start half past.

## 6. Game modes (MVP)

### 6.1 Clock Playground (Stage 0, free play)
- A big friendly clock. Louie drags the hands around and the clock speaks the time ("It's 4 o'clock!").
- Tapping a number makes it say its name and bounce.
- No right or wrong answers. This mode is for exploring.

### 6.2 What Time Is It? (read the clock)
- A clock shows a time. The mascot asks, "What time is it?"
- Louie picks from **2–3 big answer buttons**, each showing a digital time and spoken aloud when tapped.
- Right answer: celebration plus a sticker point. Wrong answer: the correct hand glows and the mascot gives a hint.

### 6.3 Make the Time (set the clock)
- The mascot says, "Can you make the clock say **7 o'clock**?"
- Louie moves the short hand (in o'clock mode the long hand is locked on 12 to keep it simple).
- **Laptop-friendly:** dragging with a mouse or trackpad is hard at 4, so he can also **click a number** on the clock to send the short hand there, or use big **◀ ▶ arrow buttons** to step it round.
- Hands snap to the nearest valid position, so precise dragging isn't needed.

### 6.4 Louie's Day (match time to routine)
Uses Louie's real routine:

| Picture | Event | Real time | How it's said | Stage it appears |
|---|---|---|---|---|
| 🥣 | Breakfast | 7:30 | half past seven | Stage 2 (half past) |
| 🎒 | School starts | 8:40 | twenty to nine | Stage 4+ (stretch) |
| 🍝 | Dinner | 5:15 | quarter past five | Stage 4 (quarter past) |
| 🛁 | Bath time | 6:30 | half past six | Stage 2 (half past) |
| 🛏️ | Bedtime | 7:00 | seven o'clock | Stage 1 (o'clock) |

- "Bedtime is at 7 o'clock. Which clock says 7 o'clock?" Louie picks the matching clock.
- Each card only shows up once Louie has reached the stage for that kind of time. **Bedtime works straight away**, breakfast and bath come with half past, and dinner and school come later.
- Hannah can edit the routine times in the parent area.

## 7. Rewards & gamification

- **Louie picks his mascot.** The first time he plays, he chooses from three original characters inspired by what he loves:
  - 🕷️ **a web-slinging superhero kid** in red and blue (Spider-Man feel)
  - 🐻 **a big, clumsy, friendly grizzly bear** (Grizzy feel)
  - 🐹 **a gang of small, cheeky, chaotic furry critters** (Lemmings feel)

  He can change his mind later. The mascot guides, cheers, gives hints and dances when he gets it right.
- **Football theme (Arsenal feel):** red-and-white kit colours, and every correct answer is a **GOAL!** with a crowd cheer. Finishing a stage wins a **trophy**.
- **Sticker book:** each round earns a star; every 5 stars unlocks a sticker (superheroes, bears, critters, footballs, boots, trophies). He can open the sticker book any time.
- **Note on characters:** we design our **own** characters "in the style of" his favourites rather than using the real Spider-Man, Grizzy, Lemmings or Arsenal names, logos or artwork. Those are copyrighted and trademarked, and original characters also mean we can make them do anything we like.
- **Celebrations:** confetti, a cheer and a mascot dance on correct answers, plus a bigger party when a stage is completed.
- **Daily goal:** a little "ten stars today" path that fills up and ends with a "See you tomorrow!" scene.
- **Personalisation:** says "Well done, Louie!" by name. Optional: Louie picks the mascot's colour.
- **No** leaderboards, timers, lives, streak-breaking guilt or purchases.

## 8. Parent area

- Behind a simple **parent gate** (e.g. "press and hold for 3 seconds" or a sum Louie can't do yet).
- See progress: stars earned, accuracy per stage, which times he finds tricky.
- Set or unlock the stage.
- Edit "Louie's Day" routine times.
- Sound on/off and voice volume.
- Reset progress.

## 9. Audio & voice

- Every prompt, answer button and number is spoken.
- **Hannah's own voice (MVP).** In the parent area there is a **"Record Mum's voice"** screen: a list of phrases, each with a big ● record, ▶ play back and ↺ redo button. Recordings are saved on the laptop (browser storage) and are never uploaded.
- **Phrases are built from small pieces** so there's not much to record:
  - numbers: "one" … "twelve"
  - "o'clock", "half past", "it's"
  - prompts: "What time is it?", "Can you make the clock say…", "Which clock says…"
  - praise: "Well done, Louie!", "GOAL!", "Amazing!", "You did it!"
  - hints: "Ooh, nearly! Let's look again", "Look at the short red hand"
  - routine: "Breakfast time", "Bath time", "Bedtime"…
  - So "half past" + "seven" plays as *"half past seven"*.
- **Fallback:** any phrase not recorded yet uses the browser's text-to-speech (Web Speech API, UK English voice). The game works on day one, before anything is recorded.
- Recording needs microphone permission once, in the parent area only.
- Short, cheerful sound effects for taps, correct answers and stickers.

## 10. Visual design

- Bright, warm palette with plenty of white space. High contrast between clock hands and face.
- **Short hand and long hand in different colours and thicknesses** (e.g. short = chunky red, long = slim blue). These colours stay the same everywhere so Louie can say "the red hand".
- Rounded, chunky shapes and a playful font for any visible text.
- **Designed for a laptop screen first** (landscape): big clock on the left, mascot and answer buttons on the right. Fills the screen, and a full-screen button helps avoid stray clicks.
- Big cursor-friendly buttons with clear hover states. The number keys 1–9 can also be used to answer.
- Colours lean on his favourites: **red & white** (football), **red & blue** (superhero), warm browns (bear).

## 11. Technical requirements

| Area | Requirement |
|---|---|
| Platform | Web, runs in a browser. **Primary: laptop** (Chrome/Safari). Tablet support is a bonus. |
| Voice recording | MediaRecorder API; recordings stored in IndexedDB on the device. |
| Build | Simple static site: HTML, CSS, JavaScript. No server, no login. |
| Storage | Progress saved on the device (browser localStorage). |
| Offline | Works offline after first load (nice-to-have: installable as a home-screen app). |
| Input | Mouse/trackpad first: click-to-set and arrow buttons as well as drag (pointer events with snapping). Keyboard shortcuts. Touch also works. |
| Privacy | No analytics, no ads, no external links, no personal data leaves the device. |
| Performance | Loads in under 3 seconds; animations are smooth on an older iPad. |
| Accessibility | Large targets, spoken prompts, no time pressure, respects "reduce motion". |

## 12. Scope

**MVP (v1)**
- Mascot picker (superhero kid / grizzly bear / cheeky critters)
- Clock Playground
- What Time Is It? (o'clock and half past)
- Make the Time (o'clock), with click-a-number and arrow controls
- Louie's Day with **bedtime (7 o'clock)**, plus breakfast and bath once half past unlocks
- Football "GOAL!" celebrations, stars, sticker book and trophies
- Spoken prompts: **Mum's recorded voice** with text-to-speech fallback
- Parent area (progress, stage unlock, routine times, voice recording, reset)

**v2**
- Make the Time for half past
- Quarter past (unlocks dinner at 5:15)
- Installable app / works offline

**Later**
- Quarter to and "twenty to" (unlocks school at 8:40)
- Digital ↔ analogue matching
- Seasonal stickers and new mascots

## 13. Risks

| Risk | Mitigation |
|---|---|
| Too hard, so Louie gets frustrated | Few answer choices, hints, snapping hands, stage gating, no failure. |
| Gets bored | Short sessions, variety of modes, collectible stickers, his name and interests. |
| Text-to-speech sounds robotic | Pick the best UK voice; plan for recorded voice in v2. |
| Dragging with a mouse is fiddly at 4 | Click-a-number and arrow buttons as alternatives; big handles; snapping. |
| Progress or voice recordings lost if browser data is cleared | Note it in the parent area; offer a "download backup" later. |
| Real routine times are too hard (8:40, 5:15) | Those cards stay hidden until the matching stage is unlocked. |
| Using real Spider-Man/Grizzy/Arsenal artwork | Original look-alike-in-spirit characters only; no real names, logos or art. |

## 14. Decisions from Hannah (5 Nov 2026)

| Question | Answer |
|---|---|
| Device | Mostly a laptop |
| Interests | Spider-Man, Grizzy and the Lemmings, Arsenal |
| Mascot | Louie chooses |
| Numbers | Knows them |
| O'clock | Right about 70% of the time |
| Voice | Hannah will record her own voice |
| Routine | Breakfast 7:30, school 8:40, dinner 5:15, bath 6:30, bed 7:00 |
