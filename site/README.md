# DEAD SIGNAL — landing page

Plain HTML, CSS and JavaScript, built with [Vite](https://vitejs.dev). No framework, no runtime dependencies.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
npm run preview  # serve the built dist/
```

`dist/` is a static site: upload it to any host (GitHub Pages, Netlify, Vercel, S3…).

## Structure

```
site/
  index.html              page shell; sections are inlined at build time via <!-- include: … -->
  public/assets/          images
  src/main.js             page-wide effects: smooth scrolling, glitch filter, custom cursor
  src/styles/base.css     page layout, film grain, cursor
  src/sections/<name>/    one folder per section: <name>.html, <name>.css, <name>.js
    hero    header, hero, mobile menu
    game    raid phases (scroll-driven) and badge viewer
    world   factions and traders dossiers
    media   gallery with lightbox, latest news
    final   roadmap, FAQ, wishlist CTA and email form, footer
```

Each section's `init(root)` (called from `main.js`) wires its interactivity.

## Notes

- The email form in `final` does not submit anywhere yet (`TODO` in `final.js`).
- Links such as Wishlist, Press kit, Privacy policy point to placeholder anchors.
- The original Claude Design source this page was ported from is in `../design/`.
