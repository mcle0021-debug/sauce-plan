# sauce-plan reference

## plan.js at a glance
`plan.js` is plain JavaScript that runs inside the page, before the engine. It defines five things: `CONFIG`, `SUBJ`, `ORDER`, `INFO` and `DAYS`. It may also define its own helpers (folder maps, link makers). It must **not** redefine the built-in builders `Y V R P F B X IV Bat`, or `CFG`, `BASE`, `SEP`, `KEY`, `done`. It must not contain `</script`.

```js
const CONFIG = {
  title: "Sem 2 Exam Planner",          // <title> and heading: a 2–4 word name
  subtitle: "Mon 19 Oct → Tue 17 Nov · ENG1014, ENG1005",
  base: "C:\\Users\\you\\University",   // study folder; F() paths are relative to it (Windows \\ or macOS /)
  key: "sem2-planner-done-v1",          // localStorage key for ticks; new plan = new key
  dayStart: 8 * 60,                      // clock days start here (minutes after midnight)
  lms: "Moodle",                         // "Check on Moodle" heading in the Units tab
  caps: {Sat: 6 * 60, default: 10 * 60},// check.mjs only: max minutes per weekday (Mon…Sun keys) or default
  warmup: true, closeout: true,          // automatic 20-min recall warm-up / 10-min close-out each day
  flexKinds: ["Full study day"],         // day kinds that also get a 45-min catch-up/flex block
  howBuilt: ["…"],                       // bullets on the Method tab ("How this plan is built")
  examDay: ["Time off after the ENG1005 exam"],  // extra bullets for the Method tab's Exam day panel
  classNote: "Class week: fit these blocks around your classes. They’re listed in priority order.",
  markDone: {before: "2026-11-12", ids: ["24-0-0"]} // optional: pre-tick every step on days before `before`, plus these step ids
};

const SUBJ = {   // key = short id used in blocks; never "ALL" (that's built in for whole-day blocks)
  "1005": {code: "ENG1005", name: "Engineering Mathematics", exam: "2026-11-05", time: "2–5pm", weight: "50%", slot: 1}
};
const ORDER = ["1005"];                  // countdown cards, legend and Units tab order (usually by exam date)

const INFO = {   // Units tab; any field can be left out
  "1005": {exam: "Thu 5 Nov, 2–5pm · 50%", style: "Format, room, rules, practice papers and results so far.",
    focus: ["Priorities…"], practice: ["Course practice you'll use…"], unknown: ["Things to check on Moodle…"]}
};

const DAYS = [   // one entry per calendar day, consecutive, no gaps
  {date: "2026-10-24", kind: "Light day (gym + work)", clock: true, warm: true,
   focus: "One line shown at the top of the day.",
   blocks: [ /* B(...), Bat(...), X(...), IV(...) */ ]}
];
```

## Block builders (provided by the template)
| Builder | Makes | Arguments |
|---|---|---|
| `B(s, m, t, steps, links, files, doneWhen)` | a study block | unit id (or `"ALL"`), minutes, title, `["step", …]`, `[V/R/P…]`, `[F…]`, "Done when" text |
| `Bat(at, before, s, m, t, steps, links, files, doneWhen)` | a block pinned to a clock time | `at` = minutes after midnight (`14*60` = 2pm); `before` = what the gap before it is called ("Lunch", "Travel"), or `null` |
| `X(s, label, at, m, room, bring, before)` | an exam | label ("ENG1005 exam · 50%"), start, length, room/seat, what to bring, what the gap before it is |
| `IV(...)` | a viva/interview/oral | same arguments as `X`; shown as "Q&A" on the calendar and not counted as the unit's exam |
| `V(label, youtubeId)` | Video link | label includes channel and length |
| `R(label, url)` | Read link | |
| `P(label, url)` | Practice link | practice pages, Study Sauce hub, flashcard decks, practice exams |
| `F(label, path)` | local file | path relative to `CONFIG.base`, with `/` separators; or an absolute path |

Day fields: `date` (YYYY-MM-DD), `kind` (free text shown under the date; `"Full study day"` gets the flex block, and `"Day off"` is the convention for an emptied day), `clock` (true = timed layout from `dayStart`; false = priority list for class days), `warm` (false = no automatic warm-up/close-out/flex, used on exam days and days off), `focus`, `blocks` (may be empty).

## Tick ids
Each step's tick is stored as `"<dayIndex>-<blockIndex>-<stepIndex>"`, counting the automatic warm-up, which is block 0 when it's on. In practice:
- don't insert, delete or reorder days, or blocks/steps that come before ticked ones;
- append at the end, or edit the text in place;
- links, files, "Done when", focus lines and minutes can change freely.

## Design system (keep it: it's what makes every planner look the same)
**Fonts** (Google Fonts): Bricolage Grotesque (headings, numbers), IBM Plex Sans (body), IBM Plex Mono (times, codes, file paths).

**Neutrals** (light / dark): background `#f3f5f2` / `#111613`, surface `#ffffff` / `#18201b`, sunk `#e9ede8` / `#1f2822`, ink `#18211c` / `#e4ebe6`, muted `#5a6760` / `#97a69d`, lines `#d9e0da` / `#2b3630`, accent green `#1d6b58` / `#59c0a2`.

**Unit colour slots**: each unit gets `slot` 1–6, used for its chip, block edge, countdown card, calendar dot and Units-tab border. The second column is the tint behind chips.

| slot | light | tint | dark | dark tint | was used for |
|---|---|---|---|---|---|
| 1 | `#3d55b8` blue | `#e6e9f7` | `#8fa1ff` | `#232a46` | maths (ENG1005) |
| 2 | `#bb5226` orange | `#f7e8e0` | `#f0905f` | `#3a271d` | mechanics (ENG1011) |
| 3 | `#2b7f4f` green | `#e2f1e7` | `#6fd398` | `#1d3326` | programming (ENG1014) |
| 4 | `#8a3c86` purple | `#f3e5f2` | `#e08ad9` | `#36213a` | discrete maths (FIT1058) |
| 5 | `#1f6f8b` teal | `#e1eff4` | `#6cc3e0` | `#1b3440` | |
| 6 | `#8a6410` gold | `#f4ecd9` | `#e0b45a` | `#3a3020` | |
| all | `#5a6760` grey | `#e9ede8` | `#97a69d` | `#222b25` | whole-day blocks (warm-up, flex, close-out) |

Companion pages for the same unit (flashcard decks, practice exams) reuse the unit's slot colour as their accent, so everything for one unit looks alike.

**Layout** (all in `template.html`):
1. Header: title, subtitle, sync status ("Synced to your account" / "Saved on this device").
2. Countdown cards: one per unit in `ORDER`, showing days to go, the exam time and % ticked, with a progress bar (4 across, 2 on phones).
3. Sticky tabs: **Day plan**, **Subjects** (Units), **How to study** (Method).
4. Day plan: a Mon–Sun month grid (each cell shows hours or an exam tag, unit dots, and a ticked-progress bar along the bottom; today and the selected day are outlined), then the selected day: date, kind, Prev/Today/Next, hour pills per unit, the focus line, then the blocks. On clock days each block shows its start time and length, with breaks, lunch and dinner between blocks. Exam blocks are boxed, with the room and what to bring.
5. Block: unit chip and title, tick-box steps, link chips (Video / Read / Practice), file rows (label · path · Copy path), and a "Done when" box.
6. Subjects tab: per unit, the exam line, hours planned, % ticked, style paragraph, Priorities, Course practice, Check on <LMS>, and every session (each one jumps to its day).
7. Method tab: the study loop, every day, mocks, exam day, and how this plan is built.

Accessibility: the colour tokens are redefined for dark mode, both from `prefers-color-scheme` and from `data-theme`; it has visible focus rings, works at 375 px width without sideways scrolling, and respects reduced motion.
