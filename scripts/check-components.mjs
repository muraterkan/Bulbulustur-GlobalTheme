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
const adapterPath = resolve(root, "assets/js/panel/bb-component-panel-shell.js");
const adapterSource = readFileSync(adapterPath, "utf8");

report("Component catalog inventory (" + pages.length + " pages)", []);

const menuInjectionIssues = [];
if (/componentCatalog|data-bb-component-catalog|bb_tree_components_catalog|ensureComponentCatalog/.test(panelMenuSource)) {
  menuInjectionIssues.push("bb-panel-menu.js must not inject the component catalog into the sidebar");
}
report("Component catalog is not injected into sidebar", menuInjectionIssues);

const refIssues = [];
const adapterIssues = [];
const idIssues = [];
const duplicateScriptIssues = [];
const inlineScriptIssues = [];
const emptyPageIssues = [];
const invalidPixelUtilityIssues = [];
const cardShadowIssues = [];
const jsPaths = new Set();

for (const name of pages) {
  const path = resolve(dir, name);
  const source = readFileSync(path, "utf8");

  if (!source.trim()) emptyPageIssues.push(name + ": empty demo file");
  if (/<script(?![^>]*\bsrc=)[^>]*>/i.test(source)) inlineScriptIssues.push(name + ": inline script is not allowed");
  if (/\b(?:w|h)-\d+px\b/.test(source)) invalidPixelUtilityIssues.push(name + ": fixed-pixel utility class is not allowed");
  for (const match of source.matchAll(/class="([^"]*)"/g)) {
    const classes = match[1];
    if (/\bbb-card\b/.test(classes) && /\bshadow(?:-sm|-lg)?\b/.test(classes)) cardShadowIssues.push(name + ": bb-card must use core card shadow only");
  }

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
report("Component demo content", emptyPageIssues);
report("Component HTML inline scripts", inlineScriptIssues);
report("Component HTML local references", refIssues);
report("Component HTML duplicate IDs", idIssues);
report("Component HTML duplicate script sources", duplicateScriptIssues);
report("Component HTML fixed-pixel utility classes", invalidPixelUtilityIssues);
report("Component cards use canonical core shadow", cardShadowIssues);

const adapterContractIssues = [];
["normalizeStylesheetOrder", "bb-component-demo-root", "normalizeDemoCards"].forEach((marker) => {
  if (!adapterSource.includes(marker)) adapterContractIssues.push("adapter contract missing: " + marker);
});
report("Component panel adapter normalization contract", adapterContractIssues);

const coreJsDir = resolve(root, "assets/js/core");
const referencedJs = new Set([...jsPaths].map((path) => resolve(path)));
const coreJsOrphans = existsSync(coreJsDir)
  ? readdirSync(coreJsDir)
      .filter((name) => name.endsWith(".js"))
      .map((name) => resolve(coreJsDir, name))
      .filter((path) => !referencedJs.has(path))
      .map((path) => relative(root, path).split(sep).join("/"))
  : [];
report("Core JavaScript is referenced by component catalog", coreJsOrphans);

const syntaxIssues = [];
for (const path of jsPaths) {
  const result = spawnSync(process.execPath, ["--check", path], { encoding: "utf8" });
  if (result.status !== 0) syntaxIssues.push(relative(root, path) + ": " + (result.stderr || "syntax error").trim());
}
report("Component JavaScript syntax (" + jsPaths.size + " files)", syntaxIssues);

if (failures.length) process.exitCode = 1;
else console.log("Component catalog static acceptance: PASS");
