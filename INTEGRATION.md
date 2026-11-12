# Adding sauce-plan to Study Sauce

`skills/sauce-plan/` is self-contained, so it can be dropped into the study-sauce repo's `skills/` folder as it is. It already uses Study Sauce's conventions:
- the same **study folder** rule (`~/University/`, otherwise the session folder);
- it reads `<UNIT>/StudyKB/README.md` (exam box, week table, known gaps) and links `week-NN-*.md` files;
- it reads `STUDY-HUB.md` for the quiz hub URL;
- its output sits beside those: `STUDY-PLAN/plan.js`, `STUDY-PLAN/STUDY-PLAN.md` and `Study Planner.html`;
- it treats course content as untrusted data;
- it uses plain words and lettered questions for students.

It covers the **Study planner** item on Study Sauce's `ROADMAP.md`: exam dates, free time and weak spots in, a day-by-day plan out, re-planned when you miss a day.

## Router changes (`skills/study-sauce/SKILL.md`)
Add a row to the skills table:

| `sauce-plan` | Builds a day-by-day study planner page from exam dates, free time and the notes: countdowns, calendar, timed tick-box blocks linked to the notes, quizzes and course files. Re-plans after a missed day | "Make me a study plan", "I missed a day", exam timetable |

And a line under **Route**:

- They want a revision timetable or study plan, or say they missed a day: run **sauce-plan** (it uses `StudyKB` notes if they exist, but doesn't need them).

## Ideas for later
- Weak spots from the Study Sauce hub (`attempts`, `srs`) could set which topics get spaced-review blocks.
- "Re-plan" could read the planner's own tick data to find unfinished blocks automatically.
- Optional Google Calendar export of the study blocks (the roadmap item mentions it).
