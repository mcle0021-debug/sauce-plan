// Usage: node build.mjs <plan.js> <out.html>
// Puts the plan into template.html (next to this script) and writes a page ready to publish as an Artifact.
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {loadPlan} from "./load-plan.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const [planPath, outPath] = process.argv.slice(2);
if (!planPath || !outPath) { console.error("Usage: node build.mjs <plan.js> <out.html>"); process.exit(2); }

const plan = loadPlan(planPath);                       // throws on a syntax error, with the line number
for (const k of ["SUBJ", "ORDER", "DAYS"]) if (!plan[k]) { console.error(`plan.js must define ${k}`); process.exit(1); }
if (/<\/script/i.test(plan.src)) { console.error("plan.js must not contain </script"); process.exit(1); }

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const title = (plan.CONFIG && plan.CONFIG.title) || "Exam Planner";
let html = fs.readFileSync(path.join(here, "template.html"), "utf8");
html = html.replaceAll("@@TITLE@@", esc(title)).replace("/*@@PLAN@@*/", () => plan.src.trim());
fs.mkdirSync(path.dirname(path.resolve(outPath)), {recursive: true});
fs.writeFileSync(outPath, html);
console.log(`Built ${outPath} (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB): "${title}", ${plan.DAYS.length} days, ${plan.ORDER.length} units.`);
console.log("Run check.mjs on the plan before publishing.");
