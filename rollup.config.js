import plaid from '@gera2ld/plaid';
import vue from 'rollup-plugin-vue';
import hljsPkg from '@highlightjs/cdn-assets/package.json' assert { type: 'json' };
import { browserSyncPlugin } from './scripts/browser-sync.js';
import pkg from './package.json' assert { type: 'json' };

const { defaultOptions, getRollupExternal, getRollupPlugins, isProd } = plaid;
const DIST = defaultOptions.distDir;
const BANNER = `/*! ${pkg.name} v${pkg.version} | ${pkg.license} License */`;
defaultOptions.extensions.unshift('.vue');

const rollupConfig = [
  {
    input: 'src/bin/index.ts',
    plugins: getRollupPlugins({
      esm: true,
      minimize: false,
    }),
    external: getRollupExternal(Object.keys(pkg.dependencies)),
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
      ...getRollupPlugins({
        esm: true,
        extensions: ['.browser.ts', ...defaultOptions.extensions],
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
];

rollupConfig.forEach((item) => {
  item.output = {
    indent: false,
    // If set to false, circular dependencies and live bindings for external imports won't work
    externalLiveBindings: false,
    ...item.output,
  };
});

export default rollupConfig;
