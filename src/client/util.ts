import md from '../common/remarkable';
import { MarkTiddler } from './types';
import { store } from './store';

export * from './prism';

async function requestJson<T>(url: string) {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw { status: res.status, data };
  return data as T;
}

export async function loadTiddlers() {
  const data = await requestJson<Array<MarkTiddler>>('/api/tiddlers');
  return data;
}

export function openTiddler(item: MarkTiddler) {
  item.html ??= md.render(item.content);
  store.openPaths = [
    item.path,
    ...store.openPaths.filter((path) => path !== item.path),
  ];
}

export function closeTiddler(item: MarkTiddler) {
  store.openPaths = store.openPaths.filter((path) => path !== item.path);
}
