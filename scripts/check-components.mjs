import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, isAbsolute, relative, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const dir = resolve(root, "modules/components");
const failures = [];
const report = (label, items) => {
  if (items.length) {
    console.error("FAIL " + label + ": " + items.length);
    items.forEach((x) => console.error("  " + x));
    failures.push(...items);
  } else console.log("PASS " + label);
};

const pages = readdirSync(dir).filter((name) => name.endsWith(".html")).sort();
const panelMenuPath = resolve(root, "assets/js/panel/bb-panel-menu.js");
const panelMenuSource = readFileSync(panelMenuPath, "utf8");
const catalogMatch = panelMenuSource.match(/var componentCatalog = \[([\s\S]*?)\n\s*\];/);
const catalogPages = catalogMatch
  ? [...catalogMatch[1].matchAll(/\["([^"]+\.html)","[^"]*"\]/g)].map((m) => m[1]).sort()
  : [];
const catalogIssues = [];
if (!catalogMatch) {
  catalogIssues.push("assets/js/panel/bb-panel-menu.js: componentCatalog not found");
} else {
  const pageSet = new Set(pages);
  const catalogSet = new Set(catalogPages);
  pages.filter((name) => !catalogSet.has(name)).forEach((name) => catalogIssues.push("missing catalog entry: " + name));
  catalogPages.filter((name) => !pageSet.has(name)).forEach((name) => catalogIssues.push("stale catalog entry: " + name));
}
report("Component catalog inventory (" + pages.length + " pages, " + catalogPages.length + " menu entries)", catalogIssues);

const refIssues = [];
const adapterIssues = [];
const idIssues = [];
const duplicateScriptIssues = [];
const jsPaths = new Set();

for (const name of pages) {
  const path = resolve(dir, name);
  const source = readFileSync(path, "utf8");

  const adapterCount = (source.match(/assets\/js\/panel\/bb-component-panel-shell\.js/g) || []).length;
  if (adapterCount !== 1) adapterIssues.push(name + ": adapter count=" + adapterCount);
  if (/assets\/js\/(?!core\/|panel\/)[^"'\s]+\.js/.test(source)) {
    adapterIssues.push(name + ": loose assets/js reference");
  }

  const scriptSources = [...source.matchAll(/<script[^>]*\ssrc="([^"]+)"/gi)].map((m) => m[1]);
  const seenScriptSources = new Set();
  for (const src of scriptSources) {
    if (seenScriptSources.has(src)) duplicateScriptIssues.push(name + ": duplicate script src=" + src);
    seenScriptSources.add(src);
  }

  const ids = [...source.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) idIssues.push(name + ": duplicate id=" + id);
    seen.add(id);
  }

  for (const match of source.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1];
    if (!value || /^(?:#|[a-z][a-z0-9+.-]*:|\/\/)/i.test(value)) continue;
    const pathOnly = value.split(/[?#]/, 1)[0];
    if (!pathOnly) continue;
    const dest = resolve(dirname(path), decodeURIComponent(pathOnly));
    const rel = relative(root, dest);
    if (rel === ".." || rel.startsWith(".." + sep) || isAbsolute(rel)) {
      refIssues.push(name + ": path outside project: " + value);
    } else if (!existsSync(dest)) {
      refIssues.push(name + ": missing " + value);
    } else if (extname(dest) === ".js") {
      jsPaths.add(dest);
    }
  }
}

report("Component catalog adapter (" + pages.length + " pages)", adapterIssues);
report("Component HTML local references", refIssues);
report("Component HTML duplicate IDs", idIssues);
report("Component HTML duplicate script sources", duplicateScriptIssues);

const syntaxIssues = [];
for (const path of jsPaths) {
  const result = spawnSync(process.execPath, ["--check", path], { encoding: "utf8" });
  if (result.status !== 0) syntaxIssues.push(relative(root, path) + ": " + (result.stderr || "syntax error").trim());
}
report("Component JavaScript syntax (" + jsPaths.size + " files)", syntaxIssues);

if (failures.length) process.exitCode = 1;
else console.log("Component catalog static acceptance: PASS");
