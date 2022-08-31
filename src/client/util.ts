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
  let { tiddlers, openNames } = window.marktiddly || {};
  if (!tiddlers)
    ({ tiddlers, openNames } = await requestJson<{
      tiddlers: MarkTiddler[];
      openNames?: string[];
    }>('/api/data'));
  const tiddlerMap = new Map<string, MarkTiddler>();
  tiddlers.forEach((item) => {
    tiddlerMap.set(item.name.toLowerCase(), item);
    if (item.id) tiddlerMap.set(item.id, item);
  });
  store.tiddlers = tiddlerMap;
  store.openNames = openNames || [];
}

export function openTiddler(item: MarkTiddler) {
  const name = item.name.toLowerCase();
  const index = store.openNames.indexOf(name);
  if (index < 0) {
    store.openNames = [name, ...store.openNames];
  }
}

export function closeTiddler(item: MarkTiddler) {
  const itemName = item.name.toLowerCase();
  store.openNames = store.openNames.filter((name) => name !== itemName);
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
