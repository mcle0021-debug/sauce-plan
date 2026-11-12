/* Example plan for sauce-plan: two made-up units over 8 days, using every block type.
   Copy this to <study folder>/STUDY-PLAN/plan.js and replace everything. Format: REFERENCE.md. */

const CONFIG = {
  title: "Exam Planner",                                   // <title> and heading (2–4 words)
  subtitle: "Mon 1 Jun → Mon 8 Jun · MTH1030, PHS1001",
  base: "C:\\Users\\you\\University",                      // study folder; F() paths are relative to it
  key: "exam-planner-done-v1",                             // localStorage key; change it for a brand-new plan
  lms: "Moodle",                                           // "Check on Moodle" heading in the Units tab
  caps: {Sat: 6 * 60, default: 10 * 60},                   // check.mjs flags days over these (minutes)
  howBuilt: [
    "Mon 1 Jun is a class day: blocks are listed in priority order, fitted around classes",
    "Full study days run about 9–10 hours from 8am; Saturday is lighter (work)",
    "Both units run in parallel, then each gets a heavy run before its exam"],
  examDay: ["Time off after each exam"]
};

const SUBJ = {
  MTH: {code: "MTH1030", name: "Techniques for Modelling", exam: "2026-06-04", time: "9:30am", weight: "60%", slot: 1},
  PHS: {code: "PHS1001", name: "Foundation Physics", exam: "2026-06-08", time: "2–5pm", weight: "50%", slot: 2}
};
const ORDER = ["MTH", "PHS"];

/* Unit-specific file helpers: keep them here, not in the template. */
const kb = (unit, wk, slug) => F(`Week ${wk} notes (Study Sauce)`, `${unit}/StudyKB/week-${String(wk).padStart(2, "0")}-${slug}.md`);
const PAUL = p => "https://tutorial.math.lamar.edu/Classes/" + p + ".aspx";
const HUB = "https://claude.ai/artifact/your-study-sauce-hub";   // from STUDY-HUB.md, if they use sauce-quiz

const INFO = {
  MTH: {exam: "Thu 4 Jun, 9:30am · 60%", style: "On-campus e-exam, 3 hours. Formula sheet provided, no notes. Two past papers on Moodle.",
    focus: ["Second-order ODEs (highest value)", "Eigenvalues for systems", "Series convergence tests"],
    practice: ["2024 and 2025 finals", "Applied class sheets Wks 1–11", "Study Sauce quizzes Wks 8–11"],
    unknown: ["Is Week 12 examinable?"]},
  PHS: {exam: "Mon 8 Jun, 2–5pm · 50%", style: "On-campus written exam. One A4 double-sided cheat sheet.",
    focus: ["Rotational dynamics", "Energy methods"], practice: ["Mock exam", "Workshop sheets"], unknown: ["Cheat sheet: handwritten only?"]}
};

const DAYS = [
{date: "2026-06-01", kind: "Class week", clock: false,
 focus: "Classes today. Start ODEs and write your PHS1001 cheat-sheet outline.",
 blocks: [
  B("MTH", 120, "Second-order ODEs I: the three root cases (Wk 9)", [
    "Watch the constant-coefficients video",
    "Week 9 notes: characteristic equation, real/repeated/complex roots",
    "Applied Wk 9 Q1–Q4, closed book, then check"],
    [V("Constant-coefficient ODEs – Trefor Bazett (7 min)", "znO6v-8pvXo"), R("Paul’s Notes: Complex Roots", PAUL("DE/ComplexRoots")), P("Study Sauce: quiz Week 9", HUB)],
    [kb("MTH1030", 9, "second-order-odes"), F("Applied class Wk 9", "MTH1030/Applied/week9.pdf")],
    "You write the general solution in all 3 cases without notes."),
  B("PHS", 60, "Cheat sheet: outline", ["List every formula from Wks 1–6", "Leave space for worked examples"], [], [F("Cheat sheet rules", "PHS1001/exam-info.pdf")])
 ]},
{date: "2026-06-02", kind: "Full study day", clock: true,
 focus: "MTH1030 past paper at the real exam time, then fix it. Rotational dynamics.",
 blocks: [
  Bat(9 * 60 + 30, "Free time", "MTH", 180, "MTH1030 2025 final, timed (9:30am, like the real exam)", ["Formula sheet only, 3 hours", "Mark it strictly against the solutions"], [], [F("2025 final", "MTH1030/Past papers/2025.pdf")]),
  B("MTH", 90, "Fix the 2025 final", ["Redo every question you lost marks on", "Log each one in your Mistake Log"], [], [F("MTH1030 Mistake Log", "MTH1030 Mistake Log.txt")]),
  B("PHS", 150, "Rotational dynamics (Wk 7)", ["Week 7 notes: torque, moment of inertia, rolling", "Workshop 7 Q1–Q6"], [], [], "You solve a rolling-without-slipping problem start to finish.")
 ]},
{date: "2026-06-03", kind: "MTH1030 exam tomorrow", clock: true,
 focus: "Light day: the 2024 paper's weak spots, then pack and sleep early.",
 blocks: [
  B("MTH", 120, "Weak spots", ["Redo your Mistake Log entries for MTH1030"]),
  B("MTH", 30, "Pack + early night", ["Charge your laptop. Pack ID and calculator", "Lights out early"])
 ]},
{date: "2026-06-04", kind: "MTH1030 EXAM", clock: true, warm: false,
 focus: "MTH1030 exam at 9:30am. Afternoon off.",
 blocks: [
  Bat(8 * 60, null, "MTH", 45, "Exam warm-up", ["Skim the formula sheet", "One easy ODE to warm up"]),
  X("MTH", "MTH1030 exam · 60%", 9 * 60 + 30, 180, "Exhibition Hall · seat on the board", "student ID, calculator", "Travel. Arrive 30 minutes early")
 ]},
{date: "2026-06-05", kind: "Day off", clock: false, warm: false,
 focus: "Rest day after the exam. Nothing planned.", blocks: []},
{date: "2026-06-06", kind: "Light day (work)", clock: true,
 focus: "Short day around work: energy methods and the PHS1001 mock.",
 blocks: [
  B("PHS", 150, "Energy methods (Wk 8)", ["Week 8 notes", "Workshop 8 Q1–Q5"]),
  IV("PHS", "PHS1001 lab interview", 15 * 60, 15, "Lab 3", "lab book", "Free time before the interview"),
  B("PHS", 90, "Cheat sheet: fill in", ["Add worked examples for Wks 7–8"])
 ]},
{date: "2026-06-07", kind: "Full study day", clock: true,
 focus: "PHS1001 mock at the real exam time (2pm), then fix it.",
 blocks: [
  B("PHS", 150, "Memory sweep, weeks 1–8", ["Blurt one page per week from memory, then check"]),
  Bat(14 * 60, "Lunch", "PHS", 180, "PHS1001 mock, timed (2–5pm)", ["Cheat sheet only, same rules as the exam"], [], [F("Mock exam", "PHS1001/mock.pdf")]),
  B("PHS", 90, "Mark + fix the mock", ["Mark strictly", "Redo every lost mark"])
 ]},
{date: "2026-06-08", kind: "PHS1001 EXAM", clock: true, warm: false,
 focus: "Last exam: PHS1001 2–5pm.",
 blocks: [
  Bat(10 * 60, null, "PHS", 60, "Exam warm-up", ["Read your cheat sheet once", "Pack: ID, calculator, cheat sheet"]),
  X("PHS", "PHS1001 exam · 50%", 14 * 60, 180, "Building 25, room 1", "student ID, calculator, cheat sheet", "Lunch, then travel")
 ]}
];
