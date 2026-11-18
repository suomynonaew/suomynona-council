import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function preserveCompiledIndexHtml(): Plugin {
  let compiledHtml = '';
  let outDirAbs = '';
  return {
    name: 'preserve-compiled-index-html',
    configResolved(cfg) {
      outDirAbs = path.resolve(cfg.root, cfg.build.outDir);
    },
    generateBundle(_options, bundle) {
      const htmlAsset = bundle['index.html'];
      if (htmlAsset && htmlAsset.type === 'asset' && typeof htmlAsset.source === 'string') {
        compiledHtml = htmlAsset.source;
      }
    },
    closeBundle() {
      if (compiledHtml && outDirAbs) {
        fs.writeFileSync(path.join(outDirAbs, 'index.html'), compiledHtml, 'utf-8');
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), preserveCompiledIndexHtml()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch:
        process.env.DISABLE_HMR === 'true'
          ? null
          : {
              ignored: [
                '**/.council_data/**',
                '**/council_outputs/**',
                '**/council_builds/**',
                '**/public/built_webapps/**',
              ],
            },
    },
  };
});
