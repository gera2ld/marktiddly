import { dirname, resolve } from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import { loadFiles } from './loader';

const __filename = fileURLToPath(import.meta.url);
const rootDir = dirname(dirname(__filename));

export function serve({
  port,
  cwd,
  ssr,
  title,
  defaultOpen,
}: {
  port: number | string;
  cwd: string;
  ssr: boolean;
  title?: string;
  defaultOpen?: string;
}) {
  const app = new express();
  const loading = loadFiles({ cwd, ssr });
  const activeName = defaultOpen?.toLowerCase();

  app.get('/api/data', async (req, res) => {
    const tiddlers = await loading;
    res.send({ title, tiddlers, activeName });
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
