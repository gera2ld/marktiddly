import md from '../common/remarkable';
import { MarkTiddler } from '../common/types';
import { store } from './store';

export * from './prism';

async function requestJson<T>(url: string) {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw { status: res.status, data };
  return data as T;
}

export async function loadTiddlers() {
  if (window.__tiddlers) return window.__tiddlers;
  const data = await requestJson<MarkTiddler[]>('/api/tiddlers');
  return data;
}

export function openTiddler(item: MarkTiddler) {
  item.html ??= md.render(item.content);
  const index = store.openNames.indexOf(item.name);
  if (index < 0) {
    store.openNames = [item.name, ...store.openNames];
  }
}

export function closeTiddler(item: MarkTiddler) {
  store.openNames = store.openNames.filter((name) => name !== item.name);
}

export function fuzzySearch(keyword: string, data: string) {
  const result: number[] = [];
  let j = 0;
  for (
    let i = 0;
    i < keyword.length && keyword.length - i <= data.length - j;
    i += 1
  ) {
    j = data.indexOf(keyword[i], j);
    if (j < 0) break;
    result.push(j);
    j += 1;
  }
  return result.length === keyword.length ? result : undefined;
}
