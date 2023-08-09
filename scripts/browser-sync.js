import browserSync from 'rollup-plugin-browsersync';
import { createProxyMiddleware } from 'http-proxy-middleware';

export function browserSyncPlugin({ dist, port = 4000 }) {
  return browserSync({
    server: dist,
    notify: false,
    open: false,
    middleware: [
      {
        route: '/api',
        handle: createProxyMiddleware({ target: `http://localhost:${port}` }),
      },
    ],
  });
}
