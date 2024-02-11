import express from 'express';
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

export function serve(options: {
  port: number | string;
  cwd: string;
  glob: string[];
  ssr: boolean;
  title?: string;
  defaultOpen?: string;
}) {
  const { defaultOpen, title, port, ssr } = options;
  const app = new express();
  const loading = loadFiles(options);
  const activeName = defaultOpen?.toLowerCase();
  const activeItem: MarkTiddlyPath = {
    type: MarkTiddlyPathType.Path,
    path: activeName || '',
  };

  app.get('/api/data', async (req, res) => {
    const tiddlers = await loading;
    res.send({ title, tiddlers, activeItem, ssr } as MarkTiddlyData);
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
