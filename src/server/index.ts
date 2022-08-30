import { readFile } from 'fs/promises';
import { join, resolve } from 'path';
import express from 'express';
import { globby } from 'globby';
import yaml from 'js-yaml';
import { render } from './util';

const app = new express();
const port = +process.env.MARKTIDDLY_PORT || 4000;
const cwd = resolve(process.argv[2] ?? '.');
const ssr = process.env.MARKTIDDLY_SSR !== 'false';

const loading = loadFiles(cwd);

app.get('/api/tiddlers', async (req, res) => {
  const tiddlers = await loading;
  res.send(tiddlers);
});

app.listen(port, () => {
  console.info(`Listening at http://localhost:${port}`);
});

async function loadFiles(cwd: string) {
  const files = await globby('**/*.md', { cwd });
  const data = await Promise.all(files.map((file) => loadFile(file, cwd)));
  console.info(`Loaded ${data.length} files`);
  return data;
}

async function loadFile(path: string, cwd: string) {
  const { id, frontmatter, content } = parseMetadata(
    await readFile(join(cwd, path), 'utf8')
  );
  return {
    id,
    name: path.replace(/\.md$/, ''),
    frontmatter,
    content,
    html: ssr ? render(content) : undefined,
    ssr,
  };
}

function parseMetadata<T extends { title?: string }>(content: string) {
  const id = content.match(/\b(\d{14})\b/)?.[1];
  let frontmatter: T;
  const endOffset = content.startsWith('---\n')
    ? content.indexOf('\n---\n')
    : -1;
  if (endOffset > 0) {
    const raw = content.slice(4, endOffset);
    try {
      frontmatter = yaml.load(raw);
    } catch {
      // noop
    }
    const offset = endOffset + 5;
    content = content.slice(offset).trim();
  }
  return { id, frontmatter, content };
}
