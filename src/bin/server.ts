import { dirname, resolve } from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import { loadFiles } from '../common/loader';

const __filename = fileURLToPath(import.meta.url);
const rootDir = dirname(dirname(__filename));

export function serve({
  port,
  cwd,
  ssr,
  defaultOpen,
}: {
  port: number | string;
  cwd: string;
  ssr: boolean;
  defaultOpen?: string[];
}) {
  const app = new express();
  const loading = loadFiles({ cwd, ssr });
  const openNames = defaultOpen?.map((name) => name.toLowerCase());

  app.get('/api/data', async (req, res) => {
    const tiddlers = await loading;
    res.send({ tiddlers, openNames });
  });

  app.get('/:path([^/]+)', (req, res) => {
    res.sendFile(resolve(rootDir, 'dist', req.params.path));
  });

  app.get('*', async (req, res) => {
    res.sendFile(resolve(rootDir, 'dist/index.html'));
  });

  app.listen(+port, () => {
    console.info(`Listening at http://localhost:${port}`);
  });
}
