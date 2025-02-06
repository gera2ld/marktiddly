import { readFile } from 'fs/promises';
import { globby } from 'globby';
import { builtInPlugins, MarkdownRenderer } from 'js-lib/node/render';
import { join } from 'path';
import yaml from 'yaml';
import { createLinkPlugin } from '../common/markdown';
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
    const renderer = await MarkdownRenderer.create([
      ...builtInPlugins,
      createLinkPlugin({
        onLink: (link) => {
          links.push(link.path);
        },
      }),
    ]);
    data.forEach((tiddler) => {
      if (tiddler.content) {
        links = [];
        tiddler.links = links;
        const { html } = renderer.render(tiddler.content);
        tiddler.html = html;
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
    file,
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

function parseMetadata(content: string, file: string) {
  let frontmatter: MarkTiddlerFrontmatter;
  const endOffset = content.startsWith('---\n')
    ? content.indexOf('\n---\n')
    : -1;
  if (endOffset > 0) {
    const raw = content.slice(4, endOffset);
    try {
      frontmatter = yaml.parse(raw);
    } catch (err) {
      console.error(`Invalid frontmatter for ${file}:`, err);
    }
    const offset = endOffset + 5;
    content = content.slice(offset).trim();
  }
  frontmatter ||= {
    title: '',
  };
  return { frontmatter, content };
}
