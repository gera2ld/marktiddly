import { readFile } from 'fs/promises';
import { join, resolve } from 'path';
import express from 'express';
import { globby } from 'globby';
import yaml from 'js-yaml';
import { render } from './util';

const app = new express();
const port = 4000;
const cwd = resolve(process.argv[2] ?? '.');
const ssr = true;

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
  const { frontmatter, title, content } = parseMetadata(
    await readFile(join(cwd, path), 'utf8')
  );
  return {
    path: path.replace(/\.md$/, ''),
    frontmatter,
    title,
    content,
    html: ssr ? render(content) : undefined,
    ssr,
  };
}

function parseMetadata<T extends { title?: string }>(content: string) {
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
  const title = frontmatter?.title || getTitle(content);
  return { frontmatter, title, content };
}

function getTitle(content: string) {
  if (content.startsWith('# ')) return content.slice(2).split('\n')[0].trim();
}
