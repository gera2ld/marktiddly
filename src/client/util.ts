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
  let { title, tiddlers, activeName } = window.marktiddly || {};
  if (!tiddlers)
    ({ title, tiddlers, activeName } = await requestJson<{
      title?: string;
      tiddlers: MarkTiddler[];
      activeName?: string;
    }>('/api/data'));
  const tiddlerMap = new Map<string, MarkTiddler>();
  tiddlers.forEach((item) => {
    tiddlerMap.set(item.name.toLowerCase(), item);
    if (item.frontmatter.id) tiddlerMap.set(item.frontmatter.id, item);
  });
  if (title) store.title = title;
  store.tiddlers = tiddlerMap;
  store.activeName = activeName;
}

export function getTiddlerByUrl(search: string) {
  const query = new URLSearchParams(search);
  const p = query.get('p');
  return p && store.tiddlers.get(p);
}

export function checkUrl() {
  const tiddler = getTiddlerByUrl(window.location.search);
  store.activeName = tiddler?.name.toLowerCase();
}

window.addEventListener('popstate', checkUrl);

export function openTiddler(item: MarkTiddler) {
  const name = item.name.toLowerCase();
  history.pushState({}, '', `?p=${encodeURIComponent(name)}`);
  checkUrl();
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
