import express from 'express';
import { loadFiles } from '../common/loader';

export function serve({
  port,
  cwd,
  ssr,
}: {
  port: number | string;
  cwd: string;
  ssr: boolean;
}) {
  const app = new express();
  const loading = loadFiles({ cwd, ssr });

  app.get('/api/tiddlers', async (req, res) => {
    const tiddlers = await loading;
    res.send(tiddlers);
  });

  app.listen(+port, () => {
    console.info(`Listening at http://localhost:${port}`);
  });
}
