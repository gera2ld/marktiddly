import ky from 'ky';
import { MarkTiddler } from '../../common/types';
import { MarkTiddlyData } from '../types';
import { store } from './store';
import { decryptMessage, getTiddlerNameByUrl, pakoInflate } from './util';
import { b64decode } from './base64';

export const PWD_KEY = 'mtpwd';

async function loadDataFromLocal() {
  const { title, passwordHint, meta, data } = window.marktiddly || {};
  if (title) store.title = title;
  if (!data) return;
  let marktiddlyData: MarkTiddlyData;
  if (meta) {
    const pipes = meta.split(':').filter(Boolean);
    const decoder = new TextDecoder();
    let binary = b64decode(data as string);
    for (const pipe of pipes) {
      if (pipe === 'pako') {
        binary = await pakoInflate(binary);
      } else if (pipe === 'pgp') {
        const password = sessionStorage.getItem(PWD_KEY);
        let error = '';
        if (!password) {
          error = 'A password is required.';
        } else {
          try {
            binary = await decryptMessage(binary, [password]);
          } catch (err) {
            console.error(err);
            error = (err as Error).message || 'Unknown error';
          }
        }
        if (error) {
          store.password = { hint: passwordHint, error };
          throw new Error('Password is required');
        } else {
          store.password = undefined;
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
  const {
    title,
    tiddlers,
    activeName,
  }: {
    title?: string;
    tiddlers: MarkTiddler[];
    activeName?: string;
  } = await ky('/api/data').json();
  if (title) store.title = title;
  return { tiddlers, activeName };
}

export async function loadTiddlers() {
  const { tiddlers, activeName } =
    (await loadDataFromLocal()) || (await loadDataFromRemote());
  const tiddlerMap = new Map<string, MarkTiddler>();
  const idMap = new Map<string, string>();
  tiddlers?.forEach((item) => {
    tiddlerMap.set(item.name, item);
    if (item.frontmatter.id) idMap.set(item.frontmatter.id, item.name);
  });
  store.tiddlerMap = tiddlerMap;
  store.tiddlerIdMap = idMap;
  store.defaultName = activeName;
  store.activeName ||= activeName;
}

export function getTiddlerByUrl(search?: string) {
  const p = getTiddlerNameByUrl(search);
  return p && store.tiddlerMap.get(p);
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
