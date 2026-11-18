# Core CSS / Panel Template Mimari Sözleşmesi

## Bağımlılık yönü

```
Panel Template ─────► Core
Core           ──X──► Panel Template
```

Core katmanı başka bir proje tipini bilmez. Panel ve gelecekteki Web Template, Core'un tüketicisidir.

## Fiziksel yerleşim

```
assets/
  scss/
    base/              # Core
    components/        # Core reusable components
    themes/            # Core token/theme engine
    utilities/         # Core utilities
    layout/            # Core generic layout
      panel/            # PANEL TEMPLATE ONLY
  js/
    core/              # Reusable component behaviour
    panel/             # Panel shell/page/template behaviour

modules/
  components/          # Core component demo/catalog sources
  foundation/          # Token / pack diagnostic demos
  panel/               # Panel template pages
```

## Core'a ne girer?

Tek başına başka projelerde tekrar kullanılabilen yapılar:
buttons, cards, forms, tables, badges, progress, modal, dropdown, tabs, rating, pagination, carousel ve benzeri.

Core SCSS içinde `.bb-panel`, `--bb-panel-*` veya `layout/panel/*` bağımlılığı bulunmaz.

## Panel'e ne girer?

Core componentlerini bir ekran veya widget haline getiren composition katmanı:
shell, sidebar, dashboard, orders, statistics, charts, team, contacts, administration ve component catalog adapter.

Panel SCSS yalnız `assets/scss/layout/panel/` altında tutulur.

## main.scss

`main.scss` mevcut cascade sırasını korumak için iki PANEL TEMPLATE ONLY bloğu taşır.
Bu iki blok panel katmanının sökülebilir sınırıdır. New panel importu yalnız bu bloklardan birine eklenir.

## JavaScript

`assets/js/core/`: reusable component davranışları.
`assets/js/panel/`: panel shell/page/template davranışları.

`assets/js/` kökünde loose JS dosyası tutulmaz.

## Modüller

`modules/components/` component örneklerinin tek kaynak kataloğudur.
Component demo dosyaları boş olamaz, inline JavaScript taşıyamaz ve katalog menüsüyle birebir eşleşir.
Reusable component davranışı `assets/js/core/` altında yaşar; orphan core JS tutulmaz.
Yalnız demo sunumuna özgü davranış `assets/js/panel/bb-component-*-demo.js` altında tutulur.
`modules/panel/` fiziksel panel sayfalarıdır; generic query router yeni sayfalar için kullanılmaz.
`modules/foundation/` token/pack diagnostik sayfalarıdır.

## Kontrol

```bash
npm run check:architecture
npm run check:contracts
npm run check:components
npm run check:panel
```

New kod bu sözleşmeleri ihlal ediyorsa önce mimari yerleşim düzeltilir.
