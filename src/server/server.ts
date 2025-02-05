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

const createStreamBody = async (stream: ReadStream) => {
  await new Promise((resolve, reject) => {
    stream.once('readable', resolve);
    stream.once('error', reject);
  });
  const body = new ReadableStream({
    start(controller) {
      stream.on('data', (chunk) => {
        controller.enqueue(chunk);
      });
      stream.once('end', () => {
        controller.close();
      });
      stream.once('error', (e) => {
        controller.error(e);
      });
    },

    cancel() {
      stream.destroy();
    },
  });
  return body;
};

export function serve(options: {
  host?: boolean;
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

  app.get('*', async (c) => {
    let filepath = resolve(rootDir, 'dist', c.req.path.slice(1));
    let stream: ReadableStream;
    try {
      stream = await createStreamBody(createReadStream(filepath));
    } catch {
      filepath = resolve(rootDir, 'dist/index.html');
      stream = await createStreamBody(createReadStream(filepath));
    }
    c.header('content-type', getMimeType(filepath));
    return c.body(stream);
  });

  serveHono(
    {
      fetch: app.fetch,
      hostname: options.host ? '' : undefined,
      port: +port,
    },
    (info) => {
      console.info(`Listening at http://localhost:${info.port}`);
    },
  );
}

process.on('uncaughtException', (err) => {
  console.error(err);
});
