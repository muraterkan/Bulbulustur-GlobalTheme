import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';

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

const main = file('assets/scss/main.scss');
const mainImports = [...main.matchAll(/^\s*@use\s+"([^"]+)";/gm)].map((match) => match[1]);
const partials = walk(scssRoot)
  .filter((path) => /[\\/]_[^\\/]+\.scss$/.test(path))
  .map((path) => relative(scssRoot, path).replace(/\\/g, '/').replace(/\/_/, '/').replace(/\.scss$/, ''));

// Derlenmeyen (ölü) partial kalmasın. Bilinçli ayrılmışlar burada açıkça listelenir (docs/CSS_ANALIZ_15112026.md D1).
const detached = new Set(['base/zindex']);
const orphans = partials.filter((name) => !mainImports.includes(name) && !detached.has(name));
check('every partial is imported by main.scss (or explicitly detached)', orphans.length === 0);
if (orphans.length) console.log('  orphan partials:', orphans.join(', '));
check('every main.scss @use target exists', mainImports.every((name) => partials.includes(name)));
check('main.scss has no duplicate @use', new Set(mainImports).size === mainImports.length);
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
const toolbar = file('assets/scss/layout/_toolbar1.scss');
const utilities = file('assets/scss/utilities/_utilities.scss');
const border = file('assets/scss/utilities/_border.scss');
const text = file('assets/scss/utilities/_text.scss');
const dropdown = file('assets/scss/components/_dropdowns.scss');

check('reset declared once', count(reset, /Bulbulustur Theme - Reset/g) === 1);
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
