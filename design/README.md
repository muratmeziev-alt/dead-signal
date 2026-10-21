# DEAD SIGNAL HQ — website design

Export of the **DEAD SIGNAL HQ** canvas from Claude Design.

## Structure

- `canvas.json` — canvas index: the list of artboards, their positions and order.
- `*.dc.html` — artboards (Design Component pages), one per section:
  - `Play.dc.html` — full page (interactive); `Play-Tablet.dc.html` (834) and `Play-Mobile.dc.html` (390) show it at tablet and phone width
  - `Tablet.dc.html`, `Tablet-2.dc.html`, `Mobile.dc.html`, `Mobile-2.dc.html` — all sections at tablet and phone width
  - `Page.dc.html`, `Page-2.dc.html` — full page built from all sections
  - `Main.dc.html` — 01 · Header + Hero
  - `Game.dc.html` — 02 · The Game: raid phases + insignia
  - `World.dc.html` — 03 · World: factions + traders
  - `Media.dc.html` — 04 · Media + News
  - `Final.dc.html` — 05 · Roadmap, FAQ, CTA, Footer
  - `*-xxxx.dc.html` — copies of the sections (variants)
- `assets/` — images referenced by the artboards.

## Note

The `.dc.html` files target the Claude Design runtime (`support.js`), so when
opened directly in a browser the `{{...}}`, `<sc-for>` and `<sc-if>` markup is
not processed. The static layout, styles and image paths work.
