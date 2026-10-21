import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const root = resolve(__dirname, 'site');

// Inlines <!-- include: path --> comments in index.html with the file's contents.
function htmlIncludes() {
  return {
    name: 'html-includes',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace(/<!--\s*include:\s*(\S+)\s*-->/g, (_, file) =>
          readFileSync(resolve(root, file), 'utf8'));
      },
    },
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.html')) server.ws.send({ type: 'full-reload' });
    },
  };
}

export default defineConfig({
  root,
  base: './',
  plugins: [htmlIncludes()],
  server: { port: 5173 },
  build: { outDir: resolve(__dirname, 'dist'), emptyOutDir: true },
});
