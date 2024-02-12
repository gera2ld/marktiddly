import { serve as serveHono } from '@hono/node-server';
import { ReadStream, createReadStream } from 'fs';
import { Hono } from 'hono';
import { getMimeType } from 'hono/utils/mime';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import {
  MarkTiddlyData,
  MarkTiddlyPath,
  MarkTiddlyPathType,
} from '../common/types';
import { loadFiles } from './loader';

const __filename = fileURLToPath(import.meta.url);
const rootDir = dirname(dirname(__filename));

const createStreamBody = (stream: ReadStream) => {
  const body = new ReadableStream({
    start(controller) {
      stream.on('data', (chunk) => {
        controller.enqueue(chunk);
      });
      stream.on('end', () => {
        controller.close();
      });
    },

    cancel() {
      stream.destroy();
    },
  });
  return body;
};

export function serve(options: {
  port: number | string;
  cwd: string;
  glob: string[];
  ssr: boolean;
  title?: string;
  defaultOpen?: string;
}) {
  const { defaultOpen, title, port, ssr } = options;
  const app = new Hono();
  const loading = loadFiles(options);
  const activeName = defaultOpen?.toLowerCase();
  const activeItem: MarkTiddlyPath = {
    type: MarkTiddlyPathType.Path,
    path: activeName || '',
  };

  app.get('/api/data', async (c) => {
    const tiddlers = await loading;
    return c.json({ title, tiddlers, activeItem, ssr } as MarkTiddlyData);
  });

  app.get('/:path', (c) => {
    const filepath = resolve(rootDir, 'dist', c.req.param().path);
    c.header('content-type', getMimeType(filepath));
    return c.body(createStreamBody(createReadStream(filepath)));
  });

  app.get('*', (c) => {
    const filepath = resolve(rootDir, 'dist/index.html');
    c.header('content-type', getMimeType(filepath));
    return c.body(createStreamBody(createReadStream(filepath)));
  });

  serveHono(
    {
      fetch: app.fetch,
      port: +port,
    },
    (info) => {
      console.info(`Listening at http://localhost:${info.port}`);
    },
  );
}
