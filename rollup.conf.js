import { resolve } from 'path';
import plaid from '@gera2ld/plaid';
import vue from 'rollup-plugin-vue';
import { terser } from 'rollup-plugin-terser';
import { browserSyncPlugin } from './scripts/browser-sync.js';
import pkg from './package.json' assert { type: 'json' };

const { defaultOptions, getRollupExternal, getRollupPlugins, isProd } = plaid;
const DIST = defaultOptions.distDir;
const BANNER = `/*! ${pkg.name} v${pkg.version} | ${pkg.license} License */`;
defaultOptions.extensions.unshift('.vue');

const rollupConfig = [
  {
    input: {
      input: 'src/bin/index.ts',
      plugins: getRollupPlugins({
        esm: true,
        minimize: false,
        aliases: {
          entries: [
            {
              find: resolve('src/common/remarkable/index.ts'),
              replacement: resolve('src/common/remarkable/node.ts'),
            },
          ],
        },
      }),
      external: getRollupExternal(Object.keys(pkg.dependencies)),
    },
    output: {
      format: 'esm',
      file: `${DIST}/bin.mjs`,
    },
  },
  {
    input: {
      input: 'src/client/index.ts',
      plugins: [
        vue(),
        ...getRollupPlugins({
          esm: true,
        }),
        isProd && terser(),
        !isProd && browserSyncPlugin({ dist: DIST }),
      ].filter(Boolean),
    },
    output: {
      format: 'esm',
      file: `${DIST}/client.js`,
    },
  },
];

rollupConfig.forEach((item) => {
  item.output = {
    indent: false,
    // If set to false, circular dependencies and live bindings for external imports won't work
    externalLiveBindings: false,
    ...item.output,
    ...(BANNER && {
      banner: BANNER,
    }),
  };
});

export default rollupConfig.map(({ input, output }) => ({
  ...input,
  output,
}));
