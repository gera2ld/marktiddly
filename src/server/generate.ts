import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import { loadFiles } from '../common/loader';
import { packData } from './util';

const dist = dirname(fileURLToPath(import.meta.url));
const version = 'process.env.VERSION';
const cdnPrefix = `https://cdn.jsdelivr.net/npm/marktiddly@${version}`;

function escapeScript(content: string): string {
  return content.replace(/<(\/script>)/g, '\\x3c$2');
}

export async function generate(options: {
  cwd: string;
  ssr: boolean;
  useCdn: boolean;
  pako: boolean;
  glob: string[];
  pgp?: string;
  pgpHint?: string;
  title?: string;
  defaultOpen?: string;
  favicon?: string;
}) {
  let html = await readFile(resolve(dist, 'index.html'), 'utf8');
  const manifest = JSON.parse(
    await readFile(resolve(dist, 'manifest.json'), 'utf8'),
  );
  const tiddlers = await loadFiles(options);
  const clientJs = await readFile(resolve(dist, 'client.js'), 'utf8');
  const activeName = options.defaultOpen?.toLowerCase();
  const { title, useCdn, favicon, pgpHint } = options;
  if (title) {
    html = html.replace(/<title>[^<]<*\/title>/, `<title>${title}</title>`);
    manifest.name = title;
  }
  if (favicon) {
    manifest.icons[0].src = favicon;
  } else if (useCdn) {
    manifest.icons[0].src = `${cdnPrefix}/dist/favicon.png`;
  } else {
    const iconData = await readFile(resolve(dist, 'favicon.png'), 'base64');
    manifest.icons[0].src = `data:image/png;base64,${iconData}`;
  }
  html = html.replace(
    'href="manifest.json"',
    `href="data:application/manifest+json,${encodeURIComponent(
      JSON.stringify(manifest),
    )}"`,
  );
  const rawData = { tiddlers, activeName };
  let data: { meta?: string; data: unknown } = await packData(
    JSON.stringify(rawData),
    options,
  );
  if (!data.meta) data = { data: rawData };
  html = html.replace(/<script(\b[^>]*?) src="client.js"><\/script>/, (_, g) =>
    [
      '<script>',
      escapeScript(
        'window.marktiddly=' +
          JSON.stringify({
            ...data,
            title,
            passwordHint: pgpHint,
          }),
      ),
      '</script>',
      ...(useCdn
        ? [`<script${g} src="${cdnPrefix}/dist/client.js"></script>`]
        : [`<script${g}>`, escapeScript(clientJs), '</script>']),
    ].join(''),
  );
  return html;
}
