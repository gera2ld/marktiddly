import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import { loadFiles } from '../common/loader';

const dist = dirname(fileURLToPath(import.meta.url));

function escapeScript(content: string): string {
  return content.replace(/<(\/script>)/g, '\\x3c$2');
}

export async function generate(options: {
  cwd: string;
  ssr: boolean;
  title?: string;
  defaultOpen?: string;
}) {
  let html = await readFile(resolve(dist, 'index.html'), 'utf8');
  const tiddlers = await loadFiles(options);
  const clientJs = await readFile(resolve(dist, 'client.js'), 'utf8');
  const activeName = options.defaultOpen?.toLowerCase();
  const { title } = options;
  if (title)
    html = html.replace(/<title>[^<]<*\/title>/, `<title>${title}</title>`);
  html = html.replace(/<script(\b[^>]*?) src="client.js"><\/script>/, (_, g) =>
    [
      '<script>',
      escapeScript(
        'window.marktiddly=' + JSON.stringify({ title, tiddlers, activeName })
      ),
      '</script>',
      `<script${g}>`,
      escapeScript(clientJs),
      '</script>',
    ].join('')
  );
  return html;
}
