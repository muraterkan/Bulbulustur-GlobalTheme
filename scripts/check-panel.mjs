/* Panel kabul denetimi: statik linkler, ID çakışmaları ve JS sözdizimi.
 * Tarayıcı davranışı / responsive / erişilebilirlik testlerinin yerine geçmez. */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const demoDir = resolve(root, "modules/panel");
const jsDir = resolve(root, "assets/js/panel");
const failures = [];
const report = (label, problems) => {
  if (problems.length) {
    failures.push(...problems);
    console.error("FAIL " + label + ": " + problems.length);
    problems.forEach((p) => console.error("  " + p));
  } else console.log("PASS " + label);
};
if (!existsSync(demoDir)) {
  console.error("FAIL modules/panel directory missing");
  process.exit(1);
}
const pages = readdirSync(demoDir).filter((name) => name.endsWith(".html")).sort();
const fileText = (path) => readFileSync(path, "utf8");
const attrMatches = (source, attribute) => [...source.matchAll(new RegExp("(?:\\s|<)" + attribute + '="([^"]*)"', "g"))].map((m) => m[1]);
const referenceIssues = [];
const idIssues = [];
const scriptPaths = new Set();
let references = 0;
for (const name of pages) {
  const file = join(demoDir, name);
  const source = fileText(file);
  const ids = attrMatches(source, "id");
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) idIssues.push(name + ": duplicate id=" + id);
    seen.add(id);
  }
  for (const target of attrMatches(source, "aria-controls")) {
    if (!seen.has(target)) idIssues.push(name + ": aria-controls target missing: " + target);
  }
  for (const value of [...attrMatches(source, "href"), ...attrMatches(source, "src")]) {
    if (!value || /^(?:#|[a-z][a-z0-9+.-]*:|\/\/)/i.test(value)) continue;
    const pathOnly = value.split(/[?#]/, 1)[0];
    if (!pathOnly) continue;
    const dest = resolve(dirname(file), decodeURIComponent(pathOnly));
    references++;
    const rel = relative(root, dest);
    if (rel === ".." || rel.startsWith(".." + sep) || isAbsolute(rel)) {
      referenceIssues.push(name + ": path outside project: " + value);
    } else if (!existsSync(dest)) {
      referenceIssues.push(name + ": missing " + value);
    } else if (extname(dest) === ".js") {
      scriptPaths.add(dest);
    }
  }
}
report("Panel HTML local references (" + pages.length + " pages, " + references + " refs)", referenceIssues);
report("Panel HTML IDs and aria-controls", idIssues);
const pageRegistry = fileText(resolve(jsDir, "bb-panel-pages.js"));
const registryKeys = new Set(pageRegistry.split("\n").filter((line) => line.includes(": {title:")).map((line) => line.trim().split('"')[1]));
const menuIssues = [];
let menuEntries = 0;
for (const name of pages) {
  const source = fileText(join(demoDir, name));
  for (const id of attrMatches(source, "data-bb-panel-page")) {
    menuEntries++;
    if (!registryKeys.has(id)) menuIssues.push(name + ": undefined menu page " + id);
  }
  for (const href of attrMatches(source, "href")) {
    const match = href.includes("sayfalar.html?page=") ? href.split("sayfalar.html?page=")[1].split("&")[0].split("#")[0] : null;
    if (match && !registryKeys.has(decodeURIComponent(match))) {
      menuIssues.push(name + ": invalid page link " + href);
    }
  }
}
report("Menu/page registry (" + menuEntries + " menu references, " + registryKeys.size + " IDs)", menuIssues);
const syntaxIssues = [];
for (const name of readdirSync(jsDir).filter((x) => x.startsWith("bb-panel") && x.endsWith(".js"))) scriptPaths.add(join(jsDir, name));
for (const path of scriptPaths) {
  const result = spawnSync(process.execPath, ["--check", path], { encoding: "utf8" });
  if (result.status !== 0) syntaxIssues.push(relative(root, path) + ": " + (result.stderr || "syntax error").trim());
}
report("Panel JavaScript syntax (" + scriptPaths.size + " files)", syntaxIssues);
if (failures.length) process.exitCode = 1;
else console.log("Panel static acceptance: PASS; browser/manual tests remain.");
