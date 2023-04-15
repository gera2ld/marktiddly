import { MarkTiddler } from '../../common/types';
import { store } from './store';
import { getTiddlerNameByUrl, requestJson } from './util';

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
  store.activeName ||= activeName;
}

export function getTiddlerByUrl(search?: string) {
  const p = getTiddlerNameByUrl(search);
  return p && store.tiddlers.get(p);
}

export function checkUrl() {
  const tiddler = getTiddlerByUrl();
  store.activeName = tiddler?.name.toLowerCase();
}

window.addEventListener('popstate', checkUrl);

export function openTiddler(item: MarkTiddler) {
  const name = item.name.toLowerCase();
  history.pushState({}, '', `?p=${encodeURIComponent(name)}`);
  checkUrl();
}
