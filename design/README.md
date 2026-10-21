# DEAD SIGNAL HQ — дизайн сайта

Экспорт канваса **DEAD SIGNAL HQ** из Claude Design.

## Структура

- `canvas.json` — индекс канваса: список артбордов, их позиции и порядок.
- `*.dc.html` — артборды (Design Component pages), по одному на секцию:
  - `Play.dc.html` — полная страница (интерактив)
  - `Page.dc.html`, `Page-2.dc.html` — полная страница из всех секций
  - `Main.dc.html` — 01 · Header + Hero
  - `Game.dc.html` — 02 · The Game: raid phases + insignia
  - `World.dc.html` — 03 · World: factions + traders
  - `Media.dc.html` — 04 · Media + News
  - `Final.dc.html` — 05 · Roadmap, FAQ, CTA, Footer
  - `*-xxxx.dc.html` — копии секций (варианты)
- `assets/` — изображения, на которые ссылаются артборды.

## Примечание

Файлы `.dc.html` рассчитаны на рантайм Claude Design (`support.js`), поэтому
при открытии напрямую в браузере разметка `{{...}}`, `<sc-for>` и `<sc-if>`
не обрабатывается. Статическая вёрстка, стили и пути к картинкам — рабочие.
