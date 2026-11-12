// Shared by build.mjs and check.mjs: runs a plan.js in a sandbox with the template's block builders.
import fs from "node:fs";
import vm from "node:vm";

export const BUILDERS = `
const Y = id => "https://www.youtube.com/watch?v=" + id;
const V = (label, id) => ["Video", label, Y(id)];
const R = (label, url) => ["Read", label, url];
const P = (label, url) => ["Practice", label, url];
const F = (label, path) => [label, path];
const B = (s, m, t, d, r, f, g) => ({s, m, t, d: d || [], r: r || [], f: f || [], g: g || ""});
const X = (s, label, at, m, room, bring, before) => ({s, exam: true, t: label, at, m, room, bring, before});
const IV = (...a) => Object.assign(X(...a), {interview: true});
const Bat = (at, before, ...a) => Object.assign(B(...a), {at, before: before || undefined});
`;

export function loadPlan(planPath) {
  const src = fs.readFileSync(planPath, "utf8");
  const code = BUILDERS + src + `
;globalThis.__plan = {
  CONFIG: typeof CONFIG === "object" ? CONFIG : {},
  SUBJ: typeof SUBJ === "object" ? SUBJ : null,
  ORDER: typeof ORDER !== "undefined" ? ORDER : null,
  DAYS: typeof DAYS !== "undefined" ? DAYS : null,
  INFO: typeof INFO === "object" ? INFO : {}
};`;
  const ctx = vm.createContext({});
  vm.runInContext(code, ctx, {filename: planPath, timeout: 5000});
  return {src, ...ctx.__plan};
}
