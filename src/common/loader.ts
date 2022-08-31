import { readFile } from 'fs/promises';
import { join } from 'path';
import { globby } from 'globby';
import yaml from 'js-yaml';
import md from './remarkable';
import { MarkTiddler } from './types';

export async function loadFiles({ cwd, ssr }: { cwd: string; ssr: boolean }) {
  const files = await globby('**/*.md', { cwd });
  const data = await Promise.all(
    files.map((file) => loadFile({ file, cwd, ssr }))
  );
  console.info(`Loaded ${data.length} files`);
  return data;
}

async function loadFile({
  file,
  cwd,
  ssr,
}: {
  file: string;
  cwd: string;
  ssr: boolean;
}): Promise<MarkTiddler> {
  const { id, frontmatter, content } = parseMetadata(
    await readFile(join(cwd, file), 'utf8')
  );
  return {
    id,
    name: file.replace(/\.md$/, ''),
    frontmatter,
    content,
    html: ssr ? md.render(content) : undefined,
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
