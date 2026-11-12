// Usage: node check.mjs <plan.js> [--base <folder>] [--quiet]
// Validates a plan and prints hours per day. Exit code 1 if there are errors (warnings don't fail).
import fs from "node:fs";
import path from "node:path";
import {loadPlan} from "./load-plan.mjs";

const args = process.argv.slice(2);
const planPath = args.find(a => !a.startsWith("--"));
const baseArg = args.includes("--base") ? args[args.indexOf("--base") + 1] : null;
const quiet = args.includes("--quiet");
if (!planPath) { console.error("Usage: node check.mjs <plan.js> [--base <folder>] [--quiet]"); process.exit(2); }

const {CONFIG = {}, SUBJ, ORDER, DAYS} = loadPlan(planPath);
const errors = [], warns = [];
const E = m => errors.push(m), W = m => warns.push(m);
if (!SUBJ || !ORDER || !DAYS) { console.error("plan.js must define SUBJ, ORDER and DAYS"); process.exit(1); }

const CFG = Object.assign({warmup: true, flexKinds: ["Full study day"], closeout: true, caps: {}}, CONFIG);
const base = baseArg || CFG.base || "";
const parse = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const dow = s => parse(s).toLocaleDateString("en-AU", {weekday: "short"});
const fmt = m => `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, "0") : ""}`;

// ---- units ----
const slots = new Set();
for (const s of ORDER) {
  const S = SUBJ[s];
  if (!S) { E(`ORDER lists "${s}" but SUBJ has no entry for it`); continue; }
  for (const k of ["code", "name", "exam", "time", "weight"]) if (!S[k]) W(`SUBJ["${s}"] has no ${k}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(S.exam || "")) E(`SUBJ["${s}"].exam must be "YYYY-MM-DD"`);
  if (S.slot != null) { if (!(S.slot >= 1 && S.slot <= 6)) E(`SUBJ["${s}"].slot must be 1–6`); if (slots.has(S.slot)) W(`two units share colour slot ${S.slot}`); slots.add(S.slot); }
}
if (ORDER.length > 6) W("more than 6 units: colours repeat");
if (SUBJ.ALL && ORDER.includes("ALL")) E(`"ALL" is built in for whole-day blocks: don't put it in ORDER`);

// ---- days ----
const seen = new Set();
DAYS.forEach((d, i) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date || "")) E(`day ${i}: date must be "YYYY-MM-DD"`);
  if (seen.has(d.date)) E(`${d.date} appears twice`); seen.add(d.date);
  if (i && parse(d.date) - parse(DAYS[i - 1].date) !== 864e5) E(`gap or wrong order between ${DAYS[i - 1].date} and ${d.date}: days must be consecutive`);
  if (!d.kind) W(`${d.date}: no kind (e.g. "Full study day", "Light day", "Class week", "Day off")`);
  if (!d.focus) W(`${d.date}: no focus line`);
  (d.blocks || []).forEach((b, bi) => {
    const where = `${d.date} block ${bi + 1} "${b.t}"`;
    if (b.s !== "ALL" && !SUBJ[b.s]) E(`${where}: unknown unit "${b.s}"`);
    if (b.exam) {
      if (!(b.at >= 0 && b.at < 1440)) E(`${where}: exam needs a start time in minutes after midnight (e.g. 14*60 for 2pm)`);
      if (!(b.m > 0)) E(`${where}: exam needs a duration in minutes`);
      if (!b.room) W(`${where}: no room`); if (!b.bring) W(`${where}: no "bring" list`);
      return;
    }
    if (!(b.m > 0)) E(`${where}: minutes must be > 0`);
    if (!b.d.length) E(`${where}: no steps (ticks need at least one step)`);
    if (b.at != null && !d.clock) W(`${where}: has a clock time but the day has clock:false, so the time is ignored`);
    for (const [k, l, u] of b.r) if (!/^https?:\/\//.test(u || "")) E(`${where}: link "${l}" is not an http(s) URL`); else if (!["Video", "Read", "Practice"].includes(k)) W(`${where}: link kind "${k}" (use V, R or P)`);
    for (const f of b.f) {
      const [label, p] = f;
      if (!p) { E(`${where}: file "${label}" has no path`); continue; }
      if (base && fs.existsSync(base)) {
        const full = path.isAbsolute(p) ? p : path.join(base, p);
        if (!fs.existsSync(full)) E(`${where}: file not found: ${p}`);
      }
    }
  });
});
if (base && !fs.existsSync(base)) W(`base folder not found on this computer (${base}), so file links weren't checked`);

// ---- exams inside the range and on their day ----
const first = DAYS[0] && DAYS[0].date, last = DAYS[DAYS.length - 1] && DAYS[DAYS.length - 1].date;
for (const s of ORDER) {
  const S = SUBJ[s]; if (!S || !S.exam) continue;
  const day = DAYS.find(d => d.date === S.exam);
  if (!day) { W(`${S.code} exam (${S.exam}) is outside the plan (${first} → ${last})`); continue; }
  if (!day.blocks.some(b => b.exam && b.s === s && !b.interview)) E(`${S.exam}: no exam block X("${s}", ...) on ${S.code}'s exam day`);
}

// ---- hours (same automatic blocks as the page) ----
const caps = CFG.caps || {};
const capFor = d => caps[dow(d.date)] ?? caps.default;
const perUnit = {};
console.log(`${"date".padEnd(15)} ${"total".padStart(6)}  by unit`);
DAYS.forEach(d => {
  let m = 0; const per = {};
  const blocks = (d.blocks || []).filter(b => !b.exam);
  for (const b of blocks) { m += b.m; per[b.s] = (per[b.s] || 0) + b.m; if (b.s !== "ALL") perUnit[b.s] = (perUnit[b.s] || 0) + b.m; }
  if (d.warm !== false) {
    const auto = (CFG.warmup ? 20 : 0) + (CFG.closeout ? 10 : 0) + (CFG.flexKinds.includes(d.kind) ? 45 : 0);
    m += auto; per.ALL = (per.ALL || 0) + auto;
  }
  const cap = capFor(d);
  if (cap != null && m > cap) E(`${d.date} (${dow(d.date)}): ${fmt(m)} is over the ${fmt(cap)} cap`);
  if (!quiet) console.log(`${(d.date + " " + dow(d.date)).padEnd(15)} ${fmt(m).padStart(6)}  ${Object.entries(per).map(([s, v]) => `${s === "ALL" ? "all" : (SUBJ[s] ? SUBJ[s].code : s)} ${fmt(v)}`).join(" · ")}${d.blocks.some(b => b.exam && !b.interview) ? "  ← exam" : d.blocks.some(b => b.interview) ? "  ← interview" : ""}`);
});
console.log("\nTotal planned per unit: " + ORDER.map(s => `${SUBJ[s] ? SUBJ[s].code : s} ${fmt(perUnit[s] || 0)}`).join(" · "));

for (const w of warns) console.log("WARN  " + w);
for (const e of errors) console.log("ERROR " + e);
console.log(errors.length ? `\n${errors.length} error(s): fix these before publishing.` : "\nNo errors.");
process.exit(errors.length ? 1 : 0);
