import browserSync from 'rollup-plugin-browsersync';
import { createProxyMiddleware } from 'http-proxy-middleware';

export function browserSyncPlugin({ dist }) {
  return browserSync({
    server: dist,
    notify: false,
    open: false,
    middleware: [
      {
        route: '/api',
        handle: createProxyMiddleware({ target: 'http://localhost:4000' }),
      },
    ],
  });
}
