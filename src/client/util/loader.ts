import { MarkTiddler } from '../../common/types';
import { MarkTiddlyData } from '../types';
import { store } from './store';
import {
  b64bin,
  decryptMessage,
  getTiddlerNameByUrl,
  pakoInflate,
  requestJson,
} from './util';

export const PWD_KEY = 'mtpwd';

async function loadDataFromLocal() {
  const { title, passwordHint, meta, data } = window.marktiddly || {};
  if (title) store.title = title;
  if (!data) return;
  let marktiddlyData: MarkTiddlyData;
  if (meta) {
    const pipes = meta.split(':').filter(Boolean);
    const decoder = new TextDecoder();
    let binary = await b64bin(data);
    for (const pipe of pipes) {
      if (pipe === 'pako') {
        binary = await pakoInflate(binary);
      } else if (pipe === 'pgp') {
        const password = sessionStorage.getItem(PWD_KEY);
        let error: string;
        if (!password) {
          error = 'A password is required.';
        } else {
          try {
            binary = await decryptMessage(binary, [password]);
          } catch (err) {
            console.error(err);
            error = err.message || 'Unknown error';
          }
        }
        if (error) {
          store.password = { hint: passwordHint, error };
          throw new Error('Password is required');
        } else {
          store.password = null;
        }
      }
    }
    const raw = decoder.decode(binary);
    marktiddlyData = JSON.parse(raw);
  } else {
    marktiddlyData = data;
  }
  const { tiddlers, activeName } = marktiddlyData;
  return { tiddlers, activeName };
}

async function loadDataFromRemote() {
  const { title, tiddlers, activeName } = await requestJson<{
    title?: string;
    tiddlers: MarkTiddler[];
    activeName?: string;
  }>('/api/data');
  if (title) store.title = title;
  return { tiddlers, activeName };
}

export async function loadTiddlers() {
  const { tiddlers, activeName } =
    (await loadDataFromLocal()) || (await loadDataFromRemote());
  const tiddlerMap = new Map<string, MarkTiddler>();
  tiddlers.forEach((item) => {
    tiddlerMap.set(item.name, item);
    if (item.frontmatter.id) tiddlerMap.set(item.frontmatter.id, item);
  });
  store.tiddlers = tiddlerMap;
  store.defaultName = activeName;
  store.activeName ||= activeName;
}

export function getTiddlerByUrl(search?: string) {
  const p = getTiddlerNameByUrl(search);
  return p && store.tiddlers.get(p);
}

export function checkUrl() {
  const name = getTiddlerNameByUrl();
  store.activeName = name || store.defaultName;
}

window.addEventListener('popstate', checkUrl);

export function openTiddler(item: MarkTiddler) {
  const name = item.name.toLowerCase();
  history.pushState({}, '', `?p=${encodeURIComponent(name)}`);
  checkUrl();
}
