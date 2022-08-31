import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { loadFiles } from '../common/loader';

function escapeScript(content: string): string {
  return content.replace(/<(\/script>)/g, '\\x3c$2');
}

export async function generate(options: {
  cwd: string;
  ssr: boolean;
  defaultOpen?: string[];
}) {
  let html = await readFile(resolve('dist/index.html'), 'utf8');
  const tiddlers = await loadFiles(options);
  const clientJs = await readFile(resolve('dist/client.js'), 'utf8');
  const openNames = options.defaultOpen?.map((name) => name.toLowerCase());
  html = html.replace(/<script(\b[^>]*?) src="client.js"><\/script>/, (_, g) =>
    [
      '<script>',
      escapeScript(
        'window.marktiddly=' + JSON.stringify({ tiddlers, openNames })
      ),
      '</script>',
      `<script${g}>`,
      escapeScript(clientJs),
      '</script>',
    ].join('')
  );
  return html;
}
