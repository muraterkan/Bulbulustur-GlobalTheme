import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const root = process.cwd();
const scssRoot = resolve(root, "assets/scss");
const jsRoot = resolve(root, "assets/js");
const failures = [];
const pass = (label) => console.log("PASS " + label);
const fail = (label, details = []) => {
  console.error("FAIL " + label);
  details.forEach((x) => console.error("  " + x));
  failures.push(label);
};
const walk = (dir) => readdirSync(dir).flatMap((name) => {
  const full = join(dir, name);
  return statSync(full).isDirectory() ? walk(full) : [full];
});
const rel = (path) => relative(root, path).split(sep).join("/");

const panelScssRoot = resolve(scssRoot, "layout/panel");
const allScss = walk(scssRoot).filter((x) => x.endsWith(".scss"));
const panelScss = existsSync(panelScssRoot) ? walk(panelScssRoot).filter((x) => x.endsWith(".scss")) : [];
const coreScss = allScss.filter((x) => !x.startsWith(panelScssRoot + sep) && !x.endsWith("main.scss"));
const panelPartialNames = panelScss.map((path) => path.split(sep).pop().replace(/^_/, "").replace(/\.scss$/, "")).sort();

const panelLeaks = coreScss.filter((path) => {
  const source = readFileSync(path, "utf8");
  return /\.bb-panel\b|--bb-panel-[\w-]+|@use\s+["']layout\/panel\//.test(source);
});
if (panelLeaks.length) fail("core SCSS has no panel dependency", panelLeaks.map(rel));
else pass("core SCSS has no panel dependency");

const misplacedPanelScss = allScss.filter((path) => /[\\/]_panel-[^\\/]+\.scss$/.test(path));
if (misplacedPanelScss.length) fail("panel SCSS lives only in layout/panel", misplacedPanelScss.map(rel));
else pass("panel SCSS lives only in layout/panel");

const main = readFileSync(resolve(scssRoot, "main.scss"), "utf8");
const panelImportMatches = [...main.matchAll(/@use\s+["']layout\/panel\/([^"']+)["'];/g)]
  .map((m) => ({ name: m[1], index: m.index }));
const panelImports = panelImportMatches.map((x) => x.name);
if (!panelImports.length) fail("main.scss declares panel layer imports");
else pass("main.scss declares panel layer imports");

const blockAStart = main.indexOf("PANEL TEMPLATE ONLY — BLOCK A");
const blockAEnd = main.indexOf("END PANEL TEMPLATE ONLY — BLOCK A");
const blockBStart = main.indexOf("PANEL TEMPLATE ONLY — BLOCK B");
const blockBEnd = main.indexOf("END PANEL TEMPLATE ONLY — BLOCK B");
const validPanelBlocks = blockAStart >= 0 && blockAEnd > blockAStart && blockBStart > blockAEnd && blockBEnd > blockBStart;

if (!validPanelBlocks) {
  fail("main.scss keeps removable panel boundary markers");
} else {
  pass("main.scss keeps removable panel boundary markers");

  const insidePanelBlock = (index) =>
    (index > blockAStart && index < blockAEnd) ||
    (index > blockBStart && index < blockBEnd);

  const importsOutsideBlocks = panelImportMatches.filter((x) => !insidePanelBlock(x.index)).map((x) => x.name);
  if (importsOutsideBlocks.length) fail("panel imports stay inside PANEL TEMPLATE ONLY blocks", importsOutsideBlocks);
  else pass("panel imports stay inside PANEL TEMPLATE ONLY blocks");

  const panelBlockSource = main.slice(blockAStart, blockAEnd) + "\n" + main.slice(blockBStart, blockBEnd);
  const nonPanelImportsInsideBlocks = [...panelBlockSource.matchAll(/@use\s+["']([^"']+)["'];/g)]
    .map((m) => m[1])
    .filter((name) => !name.startsWith("layout/panel/"));
  if (nonPanelImportsInsideBlocks.length) fail("PANEL TEMPLATE ONLY blocks contain only panel imports", nonPanelImportsInsideBlocks);
  else pass("PANEL TEMPLATE ONLY blocks contain only panel imports");
}

const duplicatePanelImports = [...new Set(panelImports.filter((name, index) => panelImports.indexOf(name) !== index))];
if (duplicatePanelImports.length) fail("panel partials are imported once", duplicatePanelImports);
else pass("panel partials are imported once");

const importedPanelSet = new Set(panelImports);
const missingPanelImports = panelPartialNames.filter((name) => !importedPanelSet.has(name));
const unknownPanelImports = panelImports.filter((name) => !panelPartialNames.includes(name));
if (missingPanelImports.length || unknownPanelImports.length) {
  fail("layout/panel partial inventory matches main.scss", [
    ...missingPanelImports.map((name) => "missing import: " + name),
    ...unknownPanelImports.map((name) => "missing partial: " + name)
  ]);
} else pass("layout/panel partial inventory matches main.scss (" + panelPartialNames.length + " partials)");

const rootJs = readdirSync(jsRoot).filter((name) => statSync(join(jsRoot, name)).isFile() && name.endsWith(".js"));
if (rootJs.length) fail("assets/js root contains no loose JavaScript", rootJs);
else pass("assets/js root contains no loose JavaScript");

for (const dir of ["core", "panel"]) {
  const target = resolve(jsRoot, dir);
  if (!existsSync(target)) fail("assets/js/" + dir + " exists");
  else pass("assets/js/" + dir + " exists");
}

const coreJsRoot = resolve(jsRoot, "core");
const coreJs = existsSync(coreJsRoot) ? walk(coreJsRoot).filter((x) => x.endsWith(".js")) : [];
const coreJsLeaks = coreJs.filter((path) => /\bbb-panel\b|data-bb-panel|assets\/js\/panel\//.test(readFileSync(path, "utf8")));
if (coreJsLeaks.length) fail("core JavaScript has no panel dependency", coreJsLeaks.map(rel));
else pass("core JavaScript has no panel dependency");

const cssRoot = resolve(root, "assets/css");
const strayPanelCss = existsSync(cssRoot)
  ? readdirSync(cssRoot).filter((name) => /^panel-.*\.css$/i.test(name))
  : [];
if (strayPanelCss.length) fail("no standalone panel CSS artifacts", strayPanelCss);
else pass("no standalone panel CSS artifacts");

const moduleRootFiles = existsSync(resolve(root, "modules"))
  ? readdirSync(resolve(root, "modules")).filter((name) => name.endsWith(".html"))
  : [];
if (moduleRootFiles.length) fail("modules root has no loose HTML demos", moduleRootFiles);
else pass("modules root has no loose HTML demos");

if (failures.length) process.exitCode = 1;
else console.log("Architecture contracts: PASS");
