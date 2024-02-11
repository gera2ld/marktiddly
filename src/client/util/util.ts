import {
  MarkTiddler,
  MarkTiddlyPath,
  MarkTiddlyPathType,
} from '../../common/types';
import { store } from './store';

store.activePath = getTiddlerNameByUrl();

export function getTiddlerNameByUrl(
  search = window.location.search,
): MarkTiddlyPath | undefined {
  const query = new URLSearchParams(search);
  const p = query.get(MarkTiddlyPathType.Path);
  const r = query.get(MarkTiddlyPathType.Ref);
  if (p) {
    return { type: MarkTiddlyPathType.Path, path: p };
  }
  if (r) {
    return { type: MarkTiddlyPathType.Ref, path: r };
  }
}

export async function decryptMessage(
  binaryMessage: Uint8Array,
  passwords: string[],
): Promise<Uint8Array> {
  const { decrypt, readMessage } = await import(
    'https://cdn.jsdelivr.net/npm/openpgp@5.8.0/+esm'
  );
  const message = await readMessage({ binaryMessage });
  const { data } = await decrypt({ message, passwords, format: 'binary' });
  return data;
}

export async function pakoInflate(input: Uint8Array) {
  const pako = await import('https://cdn.jsdelivr.net/npm/pako@2.1.0/+esm');
  const output = await pako.inflate(input);
  return output;
}

export function getTiddlerFamily(name: string) {
  const tiddlers: MarkTiddler[] = [];
  for (let path = name; path; path = path.replace(/(?:^|\.)[^.]+$/, '')) {
    const tiddler = store.tiddlerMap.get(path);
    if (tiddler) tiddlers.unshift(tiddler);
  }
  return tiddlers;
}

export function getTiddlerUrl(tiddler: MarkTiddler) {
  return `?${new URLSearchParams({ [MarkTiddlyPathType.Path]: tiddler.name })}`;
}

export function safeHtml(html: string) {
  return html.replace(
    /[&<]/g,
    (m) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
      })[m] || '',
  );
}
