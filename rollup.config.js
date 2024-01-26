import { defineConfig } from 'rollup';
import { definePlugins, defineExternal } from '@gera2ld/plaid-rollup';
import vue from 'rollup-plugin-vue';
import hljsPkg from '@highlightjs/cdn-assets/package.json' assert { type: 'json' };
import { browserSyncPlugin } from './scripts/browser-sync.js';
import pkg from './package.json' assert { type: 'json' };

const DIST = 'dist';
const BANNER = `/*! ${pkg.name} v${pkg.version} | ${pkg.license} License */`;
const isProd = process.env.NODE_ENV === 'production';

export default defineConfig([
  {
    input: 'src/bin/index.ts',
    plugins: definePlugins({
      minimize: false,
    }),
    external: defineExternal(Object.keys(pkg.dependencies)),
    output: {
      format: 'esm',
      file: `${DIST}/bin.mjs`,
      banner: `#!/usr/bin/env node\n${BANNER}`,
    },
  },
  {
    input: 'src/client/index.ts',
    plugins: [
      vue(),
      ...definePlugins({
        extensions: ['.vue', '.ts', '.tsx'],
        minimize: isProd,
        replaceValues: {
          'process.env.HLJS_VERSION': JSON.stringify(hljsPkg.version),
        },
      }),
      !isProd &&
        browserSyncPlugin({ dist: DIST, port: +process.env.PORT || 4000 }),
    ].filter(Boolean),
    external: id => id.startsWith('https://'),
    output: {
      format: 'esm',
      file: `${DIST}/client.js`,
      banner: BANNER,
    },
  },
]);
