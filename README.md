# sauce-plan: exam study planner for Claude Code

Tell Claude your exams. It builds a day-by-day **study planner page** with:

- **countdown cards** for every exam, with how much of each unit's plan you've ticked off;
- a **month calendar** with each day's hours, unit dots and a ticked-off bar;
- **timed day plans**: blocks laid out from 8am with breaks, lunch and dinner. Each block has tick-box steps, links to videos, readings and practice pages, the exact course files to open, and a "Done when" test;
- a **Units tab** (exam rules, priorities, practice papers, things to check, every session) and a **How to study tab**;
- ticks that **sync to your account**, plus light and dark mode, and a layout that works on a phone.

When you miss a day, say so, and Claude moves that day's work without breaking your ticks. Hours stay under your daily caps.

It's built to work with **[Study Sauce](https://github.com/samsamthecodingman/study-sauce)**. If you've used `sauce-kb`, the planner reads your exam details and week notes from `<UNIT>/StudyKB/` and links your Study Sauce quiz hub and `sauce-notes` PDFs into the right blocks. It also works on its own.

## Install
You need the **Code** tab of the Claude desktop app (or Claude Code), and Node.js (used by the build and check scripts).

**As a plugin** (recommended). In a Code session, say *"Install the sauce-plan plugin from https://github.com/mcle0021-debug/sauce-plan"*, then start a new session. Or run these yourself in a terminal:
```bash
claude plugin marketplace add mcle0021-debug/sauce-plan
```
```bash
claude plugin install sauce-plan@sauce-plan
```

**As a personal skill.** Copy `skills/sauce-plan/` to `~/.claude/skills/sauce-plan/`. Don't do both.

**Inside Study Sauce.** Copy `skills/sauce-plan/` into the study-sauce repo's `skills/` folder. `INTEGRATION.md` has the lines to add to its router skill.

## Use
In your study folder (`~/University/`, or whatever folder you open in Claude), ask:
- *"Make me a study planner for my exams"*
- *"I missed today, re-plan the rest"*
- *"Add my flashcards to the planner"*

Claude asks a few lettered questions (exam dates and rules, free time and caps, practice papers), reads your course folders, and then writes `STUDY-PLAN/plan.js`, checks it, builds it and publishes it as a private page. A local copy, `Study Planner.html`, opens your course files directly when you click them.

## What's in here
| File | What it is |
|---|---|
| `skills/sauce-plan/SKILL.md` | The instructions Claude follows: gathering inputs, how the plan is shaped, writing blocks, publishing, re-planning |
| `skills/sauce-plan/REFERENCE.md` | The `plan.js` format, block builders, tick ids, colour slots and layout |
| `skills/sauce-plan/template.html` | The page itself: design and engine. The plan is inserted into it |
| `skills/sauce-plan/example-plan.js` | A complete small plan (2 units, 8 days) using every block type |
| `skills/sauce-plan/build.mjs` | `node build.mjs plan.js out.html` |
| `skills/sauce-plan/check.mjs` | `node check.mjs plan.js --base <study folder>`: dates, exam days, caps, missing files, hours per day |

Try it without Claude:
```bash
node skills/sauce-plan/check.mjs skills/sauce-plan/example-plan.js
```
```bash
node skills/sauce-plan/build.mjs skills/sauce-plan/example-plan.js example.html
```

## Privacy
Your planner is a private claude.ai Artifact until you share it from its Share menu. File paths (which can include your name) stay in the page. Course material Claude reads is treated as data, never as instructions.

## Credits
Made by Molly Cleeve. The planner design came out of a semester of exam prep with Claude. The folder layout, wording and `StudyKB` integration follow **Study Sauce** by Sam Roberts. No Study Sauce code is copied here.

## Licence
MIT. See `LICENSE`. Use it, change it, share it.
