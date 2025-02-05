import vue from '@vitejs/plugin-vue';
import { builtinModules } from 'module';
import { resolve } from 'path';
import { readPackageUp } from 'read-package-up';
import { defineConfig } from 'vite';

const pkg = (await readPackageUp())!.packageJson;

const defaultConfig = defineConfig({
  define: {
    '__VERSIONS__.marktiddly': JSON.stringify(pkg.version),
  },
  plugins: [vue()],
  build: {
    emptyOutDir: false,
    modulePreload: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});

const BANNER = `/*! ${pkg.name} v${pkg.version} | ${pkg.license} License */`;

const configBin = defineConfig({
  ...defaultConfig,
  // Set root to correct the output paths of HTMLs
  root: 'src',
  build: {
    ...defaultConfig.build,
    minify: false,
    outDir: '../dist',
    rollupOptions: {
      input: resolve(__dirname, 'src/bin/index.ts'),
      output: {
        entryFileNames: 'bin.mjs',
        banner: `#!/usr/bin/env node\n${BANNER}`,
      },
      external: [...builtinModules, ...Object.keys(pkg.dependencies || {})],
    },
  },
});

const configClient = defineConfig({
  ...defaultConfig,
  // Set root to correct the output paths of HTMLs
  root: 'src',
  build: {
    ...defaultConfig.build,
    target: 'chrome99',
    minify: process.env.NODE_ENV !== 'development',
    outDir: '../dist',
    rollupOptions: {
      input: resolve(__dirname, 'src/index.html'),
      output: {
        entryFileNames: 'client.js',
        format: 'iife',
      },
    },
  },
});

const configMap = {
  bin: configBin,
  client: configClient,
};

const config = configMap[process.env.ENTRY || ''] || configMap.client;
export default config;
