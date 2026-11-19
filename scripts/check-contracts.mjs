import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, join, relative, dirname, basename } from 'node:path';

const root = process.cwd();
const scssRoot = resolve(root, 'assets/scss');
const file = (path) => readFileSync(resolve(root, path), 'utf8');
const count = (source, pattern) => (source.match(pattern) ?? []).length;
const checks = [];
const check = (name, valid) => checks.push({ name, valid });

const walk = (dir) => readdirSync(dir).flatMap((name) => {
  const full = join(dir, name);
  return statSync(full).isDirectory() ? walk(full) : [full];
});

const entrypointRel = [
  'assets/scss/core.scss',
  'assets/scss/panel.scss',
  'assets/scss/status.scss',
  'assets/scss/web.scss'
];
const compatibilityEntrypointRel = 'assets/scss/main.scss';
const allScssFiles = walk(scssRoot).filter((path) => path.endsWith('.scss'));
const entrypointPaths = new Set([...entrypointRel, compatibilityEntrypointRel].map((path) => resolve(root, path)));
const parseUses = (source) => [...source.matchAll(/^\s*@use\s+"([^"]+)"(?:\s+as\s+[\w-]+)?;/gm)].map((match) => match[1]);
const resolveUse = (fromPath, name) => {
  if (name.startsWith('sass:')) return null;
  const base = resolve(dirname(fromPath), name);
  const candidates = name.endsWith('.scss')
    ? [base]
    : [base + '.scss', join(dirname(base), '_' + basename(base) + '.scss')];
  return candidates.find((candidate) => existsSync(candidate)) ?? false;
};
const reachable = new Set();
const missingImports = [];
const visit = (path) => {
  if (reachable.has(path)) return;
  reachable.add(path);
  const source = readFileSync(path, 'utf8');
  for (const name of parseUses(source)) {
    const target = resolveUse(path, name);
    if (target === false) missingImports.push(relative(root, path).replace(/\\/g, '/') + ' -> ' + name);
    else if (target) visit(target);
  }
};
entrypointRel.map((path) => resolve(root, path)).forEach(visit);

const detached = new Set();
const runtimeModules = allScssFiles.filter((path) => !entrypointPaths.has(path));
const orphans = runtimeModules.filter((path) => !reachable.has(path) && !detached.has(relative(scssRoot, path).replace(/\\/g, '/')));
check('every SCSS module is reachable by a runtime bundle entrypoint (or explicitly detached)', orphans.length === 0);
if (orphans.length) console.log('  orphan SCSS modules:', orphans.map((path) => relative(scssRoot, path).replace(/\\/g, '/')).join(', '));

const everyUseResolves = allScssFiles.every((path) => parseUses(readFileSync(path, 'utf8')).every((name) => resolveUse(path, name) !== false));
check('every SCSS @use target exists', everyUseResolves && missingImports.length === 0);
if (missingImports.length) console.log('  missing @use targets:', missingImports.join(', '));

const duplicateUseFiles = allScssFiles.filter((path) => {
  const uses = parseUses(readFileSync(path, 'utf8'));
  return new Set(uses).size !== uses.length;
});
check('SCSS files have no duplicate direct @use', duplicateUseFiles.length === 0);
if (duplicateUseFiles.length) console.log('  duplicate @use in:', duplicateUseFiles.map((path) => relative(root, path).replace(/\\/g, '/')).join(', '));

const pagesScss = resolve(scssRoot, 'pages');
check('no pages/ SCSS sources in GlobalTheme', !existsSync(pagesScss) || !walk(pagesScss).some((path) => path.endsWith('.scss')));

const scssFiles = walk(scssRoot).filter((path) => path.endsWith('.scss'));
const broken = scssFiles.filter((path) => /:\s*\(--[a-z]/.test(readFileSync(path, 'utf8')));
check('no malformed custom property values like "(--x)"', broken.length === 0);
const bareBs = scssFiles.filter((path) => /var\(--bs-focus-ring-box-shadow\)/.test(readFileSync(path, 'utf8')));
check('--bs-focus-ring-box-shadow always has a fallback', bareBs.length === 0);

// Türetilmiş durum tokenları (hover/active/light/clarity) YALNIZ token-engine'de tanımlanır; base/pack girdi verir.
const derivedPattern = /^\s*--bb-(?:primary|secondary|success|info|warning|danger|dark|light)-(?:hover|active|light|clarity):/m;
const themeBase = file('assets/scss/base/_theme.scss');
const engine = file('assets/scss/themes/_token-engine.scss');
const packs = scssFiles.filter((path) => /[\\/]themes[\\/]_pack-/.test(path)).map((path) => readFileSync(path, 'utf8'));
check('derived state tokens are owned only by token-engine (base)', !derivedPattern.test(themeBase));
check('derived state tokens are owned only by token-engine (packs)', packs.every((source) => !derivedPattern.test(source)));
check('token-engine does not duplicate base aliases/links', !/--bb-link-color:/.test(engine) && !/:\s*var\(--bb-theme-/.test(engine));
check('token-engine derives dark states from --bb-dark (not a fixed coal token)', !/--bb-coal-/.test(engine));

// Metin rolündeki semantik renk kullanımı ham dolgu rengiyle değil -text türeviyle yapılır (AA kontrast).
const rawTextRole = /--bb-(?:alert-title|chip|badge|toast|fr-remove|fr-add|form-required|nav-hover|nav-active|accordion-active|menu-link-active|breadcrumb-link-hover)-color:\s*var\(--bb-(?:primary|success|warning|danger|info)\)/;
const rawTextUsers = scssFiles.filter((path) => rawTextRole.test(readFileSync(path, 'utf8')));
check('text-role semantic colors use -text tokens', rawTextUsers.length === 0);
if (rawTextUsers.length) console.log('  raw text-role colors in:', rawTextUsers.map((path) => relative(scssRoot, path)).join(', '));
const dataviz = file('assets/scss/themes/_dataviz.scss');
check('dataviz defines 8 categorical series for light and dark', [1,2,3,4,5,6,7,8].every((n) => count(dataviz, new RegExp(`--bb-chart-${n}:`, 'g')) === 2));

const reset = file('assets/scss/base/_reset.scss');
const layout = file('assets/scss/layout/_layout.scss');
const sidebar = file('assets/scss/layout/_sidebar.scss');
const toolbar = file('assets/scss/layout/_toolbar.scss');
const utilities = file('assets/scss/utilities/_utilities.scss');
const border = file('assets/scss/utilities/_border.scss');
const text = file('assets/scss/utilities/_text.scss');
const dropdown = file('assets/scss/components/_dropdowns.scss');

check('reset declared once', count(reset, /Bulbulustur Theme — Reset/g) === 1);
check('reduced-motion support preserved', reset.includes('prefers-reduced-motion: reduce'));
check('sidebar belongs to sidebar partial', count(layout, /^\.bb-sidebar\s*\{/gm) === 0 && count(sidebar, /^\.bb-sidebar\s*\{/gm) === 1);
check('toolbar belongs to toolbar partial', count(layout, /^\.bb-toolbar\s*\{/gm) === 0 && count(toolbar, /^\.bb-toolbar\s*\{/gm) === 1);
check('line-height-base belongs to text utilities', !utilities.includes('.bb-lh-base') && count(text, /^\.bb-lh-base\s*\{/gm) === 1);
check('rounded-sm belongs to border utilities', !utilities.includes('.bb-rounded-sm') && count(border, /^\.bb-rounded-sm\s*\{/gm) === 1);
check('dropdown has canonical shadow', dropdown.includes('box-shadow: var(--bb-dd-shadow);'));
check('dropdown has one unscoped component owner', count(layout, /^\.bb-dropdown-menu\s*\{/gm) === 0 && count(dropdown, /^\.bb-dropdown-menu\s*\{/gm) === 1);
check('dropdown JS state remains scoped',
  dropdown.includes('.bb-dropdown .bb-dropdown-menu {') &&
  dropdown.includes('.bb-dropdown.is-open .bb-dropdown-menu {') &&
  !layout.includes('.bb-dropdown.is-open .bb-dropdown-menu'));
check('layout does not reference retired tokens', !/--bb-(?:surface-2|coal-900)\b/.test(layout + sidebar));

const failed = checks.filter((item) => !item.valid);
for (const item of checks) console.log(`${item.valid ? 'PASS' : 'FAIL'} ${item.name}`);
console.log(`SCSS contracts: ${checks.length - failed.length}/${checks.length} passed`);
if (failed.length) process.exitCode = 1;
