import { readFile } from 'fs/promises';
import { globby } from 'globby';
import yaml from 'js-yaml';
import { join } from 'path';
import { getMd } from '../common/remarkable';
import { MarkTiddler, MarkTiddlerFrontmatter } from '../common/types';

export async function loadFiles({
  cwd,
  glob,
  ssr,
}: {
  cwd: string;
  glob: string[];
  ssr: boolean;
}) {
  const files = await globby(glob, { cwd });
  const data = await Promise.all(files.map((file) => loadFile({ file, cwd })));
  if (ssr) {
    let links: string[];
    const md = getMd({
      onLink: (link) => {
        links.push(link.path);
      },
    });
    data.forEach((tiddler) => {
      if (tiddler.content) {
        links = [];
        tiddler.links = links;
        tiddler.html = md.render(tiddler.content);
        delete tiddler.content;
      }
    });
  }
  console.info(`Loaded ${data.length} files`);
  return data;
}

async function loadFile({
  file,
  cwd,
}: {
  file: string;
  cwd: string;
}): Promise<MarkTiddler> {
  const { frontmatter, content } = parseMetadata(
    await readFile(join(cwd, file), 'utf8'),
  );
  const name = file.replace(/\.md$/, '');
  frontmatter.title ||= name;
  return {
    path: file,
    name: name.toLowerCase(),
    frontmatter,
    content,
  };
}

function parseMetadata(content: string) {
  let frontmatter: MarkTiddlerFrontmatter;
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
  frontmatter ||= {
    title: '',
  };
  return { frontmatter, content };
}
