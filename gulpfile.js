import childProcess from 'child_process';
import gulp from 'gulp';
import log from 'fancy-log';
import { rollup, watch } from 'rollup';
import { deleteAsync } from 'del';
import plaid from '@gera2ld/plaid';

const { defaultOptions } = plaid;
const DIST = defaultOptions.distDir;

async function loadConfig() {
  const { default: rollupConfig } = await import('./rollup.conf.js');
  return rollupConfig;
}

export function clean() {
  return deleteAsync([DIST]);
}

function copy() {
  return gulp.src('src/public/**').pipe(gulp.dest(DIST));
}

async function buildJs() {
  const rollupConfig = await loadConfig();
  return Promise.all(
    rollupConfig.map(async (config) => {
      const bundle = await rollup(config);
      await bundle.write(config.output);
    })
  );
}

async function watchJs() {
  const rollupConfig = await loadConfig();
  const watcher = watch(rollupConfig);
  let serve = () => {
    serve = null;
    childProcess.spawn('node', ['.', 'serve', '--cwd', 'demo'], {
      stdio: 'inherit',
    });
  };
  watcher.on('event', (e) => {
    if (e.code === 'ERROR') {
      console.error();
      console.error(`${e.error}`);
      console.error();
    } else if (e.code === 'BUNDLE_END') {
      log(`Compilation success after ${e.duration}ms`);
      serve?.();
    }
  });
}

function wrapError(handle) {
  const wrapped = () =>
    handle().catch((err) => {
      log(err.toString());
    });
  wrapped.displayName = handle.name;
  return wrapped;
}

export const build = gulp.series([copy, buildJs]);
export const dev = gulp.series([copy, watchJs]);
