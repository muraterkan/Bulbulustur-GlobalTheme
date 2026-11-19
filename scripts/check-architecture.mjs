import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const root = process.cwd();
const scssRoot = resolve(root, "assets/scss");
const jsRoot = resolve(root, "assets/js");
const cssRoot = resolve(root, "assets/css");
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
const read = (path) => readFileSync(resolve(root, path), "utf8");
const uses = (source) => [...source.matchAll(/^\s*@use\s+["']([^"']+)["'](?:\s+as\s+[\w-]+)?;/gm)].map((m) => m[1]);
const normalizeModule = (name) => name.replace(/\.scss$/, "").replace(/(^|\/)_(?=[^/]+$)/, "$1");

const panelScssRoot = resolve(scssRoot, "layout/panel");
const statusScssRoot = resolve(scssRoot, "layout/status");
const webScssRoot = resolve(scssRoot, "layout/web.bulbulustur.com");
const bundlesRoot = resolve(scssRoot, "bundles");
const allScss = walk(scssRoot).filter((x) => x.endsWith(".scss"));
const entrypointPaths = new Set(["main.scss", "core.scss", "panel.scss", "status.scss", "web.scss"].map((name) => resolve(scssRoot, name)));

const inRoot = (path, dir) => path.startsWith(dir + sep);
const coreScss = allScss.filter((path) =>
  !inRoot(path, panelScssRoot) &&
  !inRoot(path, statusScssRoot) &&
  !inRoot(path, webScssRoot) &&
  !inRoot(path, bundlesRoot) &&
  !entrypointPaths.has(path)
);

const coreDependencyLeaks = coreScss.filter((path) => /@use\s+["'][^"']*layout\/(?:panel|status|web\.bulbulustur\.com)\//.test(readFileSync(path, "utf8")));
if (coreDependencyLeaks.length) fail("core SCSS has no application dependency", coreDependencyLeaks.map(rel));
else pass("core SCSS has no application dependency");

const panelLeaks = coreScss.filter((path) => /\.bb-panel\b|--bb-panel-[\w-]+/.test(readFileSync(path, "utf8")));
if (panelLeaks.length) fail("core SCSS has no panel namespace leak", panelLeaks.map(rel));
else pass("core SCSS has no panel namespace leak");

const misplacedPanelScss = allScss.filter((path) => /[\\/]_panel-[^\\/]+\.scss$/.test(path));
if (misplacedPanelScss.length) fail("panel SCSS lives only in layout/panel", misplacedPanelScss.map(rel));
else pass("panel SCSS lives only in layout/panel");

const webOnlyName = /^_?(?:hero|home(?:page)?|category|product|cart|basket|checkout)(?:[-_.]|$)/i;
const componentScssRoot = resolve(scssRoot, "components");
const webOnlyCoreScss = existsSync(componentScssRoot)
  ? walk(componentScssRoot).filter((path) => path.endsWith(".scss") && webOnlyName.test(path.split(sep).pop()))
  : [];
if (webOnlyCoreScss.length) fail("core components contain no customer-site compositions", webOnlyCoreScss.map(rel));
else pass("core components contain no customer-site compositions");

const componentDemoRoot = resolve(root, "modules/components");
const webOnlyComponentDemos = existsSync(componentDemoRoot)
  ? readdirSync(componentDemoRoot).filter((name) => name.endsWith(".html") && webOnlyName.test(name))
  : [];
if (webOnlyComponentDemos.length) fail("component catalog contains no customer-site demos", webOnlyComponentDemos);
else pass("component catalog contains no customer-site demos");

const expectedEntrypoints = {
  "assets/scss/core.scss": [
    "bundles/core-foundation",
    "bundles/core-components-head",
    "bundles/core-components-tail",
    "bundles/core-final"
  ],
  "assets/scss/panel.scss": [
    "bundles/core-foundation",
    "bundles/panel-shell",
    "bundles/core-components-head",
    "bundles/panel-compositions",
    "bundles/core-components-tail",
    "bundles/core-final"
  ],
  "assets/scss/status.scss": [
    "bundles/core-foundation",
    "bundles/core-components-head",
    "bundles/core-components-tail",
    "bundles/status",
    "bundles/core-final"
  ],
  "assets/scss/web.scss": [
    "bundles/core-foundation",
    "bundles/core-components-head",
    "bundles/core-components-tail",
    "bundles/web",
    "bundles/core-final"
  ],
  "assets/scss/main.scss": [
    "bundles/core-foundation",
    "bundles/panel-shell",
    "bundles/core-components-head",
    "bundles/panel-compositions",
    "bundles/core-components-tail",
    "bundles/status",
    "bundles/web",
    "bundles/core-final"
  ]
};
for (const [path, expected] of Object.entries(expectedEntrypoints)) {
  const actual = uses(read(path));
  if (JSON.stringify(actual) !== JSON.stringify(expected)) fail(path + " keeps canonical bundle order", ["expected: " + expected.join(", "), "actual: " + actual.join(", ")]);
  else pass(path + " keeps canonical bundle order");
}

const bundleInventory = (rootDir) => walk(rootDir).filter((path) => path.endsWith(".scss"))
  .map((path) => normalizeModule(relative(rootDir, path).split(sep).join("/")))
  .sort();
const importsFromBundle = (path, prefix) => uses(read(path))
  .filter((name) => name.startsWith(prefix))
  .map((name) => normalizeModule(name.slice(prefix.length)))
  .sort();

const panelInventory = bundleInventory(panelScssRoot);
const panelImports = [
  ...importsFromBundle("assets/scss/bundles/_panel-shell.scss", "../layout/panel/"),
  ...importsFromBundle("assets/scss/bundles/_panel-compositions.scss", "../layout/panel/")
].sort();
if (JSON.stringify(panelInventory) !== JSON.stringify(panelImports)) fail("panel bundle inventory matches layout/panel", [
  "inventory: " + panelInventory.join(", "),
  "imports: " + panelImports.join(", ")
]);
else pass("panel bundle inventory matches layout/panel (" + panelInventory.length + " modules)");

const statusInventory = bundleInventory(statusScssRoot);
const statusImports = importsFromBundle("assets/scss/bundles/_status.scss", "../layout/status/");
if (JSON.stringify(statusInventory) !== JSON.stringify(statusImports)) fail("status bundle inventory matches layout/status", [
  "inventory: " + statusInventory.join(", "),
  "imports: " + statusImports.join(", ")
]);
else pass("status bundle inventory matches layout/status (" + statusInventory.length + " modules)");

const webInventory = bundleInventory(webScssRoot);
const webImports = importsFromBundle("assets/scss/bundles/_web.scss", "../layout/web.bulbulustur.com/");
if (JSON.stringify(webInventory) !== JSON.stringify(webImports)) fail("web bundle inventory matches layout/web.bulbulustur.com", [
  "missing/extra modules detected"
]);
else pass("web bundle inventory matches layout/web.bulbulustur.com (" + webInventory.length + " modules)");

const appSources = [
  ...walk(panelScssRoot).filter((x) => x.endsWith(".scss")),
  ...walk(statusScssRoot).filter((x) => x.endsWith(".scss")),
  ...walk(webScssRoot).filter((x) => x.endsWith(".scss"))
];
const crossAppLeaks = appSources.filter((path) => {
  const source = readFileSync(path, "utf8");
  if (inRoot(path, panelScssRoot)) return /@use\s+["'][^"']*layout\/(?:status|web\.bulbulustur\.com)\//.test(source);
  if (inRoot(path, statusScssRoot)) return /@use\s+["'][^"']*layout\/(?:panel|web\.bulbulustur\.com)\//.test(source);
  return /@use\s+["'][^"']*layout\/(?:panel|status)\//.test(source);
});
if (crossAppLeaks.length) fail("application SCSS layers have no cross-application dependency", crossAppLeaks.map(rel));
else pass("application SCSS layers have no cross-application dependency");

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

for (const name of ["core.css", "panel.css", "status.css", "web.css"]) {
  const target = resolve(cssRoot, name);
  if (!existsSync(target)) fail("generated bundle exists: " + name);
  else pass("generated bundle exists: " + name);
}

const moduleRootFiles = existsSync(resolve(root, "modules"))
  ? readdirSync(resolve(root, "modules")).filter((name) => name.endsWith(".html"))
  : [];
if (moduleRootFiles.length) fail("modules root has no loose HTML demos", moduleRootFiles);
else pass("modules root has no loose HTML demos");

if (failures.length) process.exitCode = 1;
else console.log("Architecture contracts: PASS");
