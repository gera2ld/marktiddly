import ky from 'ky';
import {
  MarkTiddler,
  MarkTiddlyData,
  MarkTiddlyPathType,
} from '../../common/types';
import { b64decode } from './base64';
import { store } from './store';
import { decryptMessage, getTiddlerNameByUrl, pakoInflate } from './util';

export const PWD_KEY = 'mtpwd';

async function loadDataFromLocal() {
  const { title, passwordHint, contentType, data } = window.marktiddly || {};
  if (title) store.title = title;
  if (!data) return;
  let marktiddlyData: MarkTiddlyData;
  if (contentType) {
    const pipes = contentType.split(':').filter(Boolean);
    const decoder = new TextDecoder();
    let binary: Uint8Array = b64decode(data as string);
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
  const { tiddlers, activePath, ssr } = marktiddlyData;
  return { tiddlers, activePath, ssr };
}

async function loadDataFromRemote() {
  const { title, tiddlers, activePath, ssr } =
    await ky('/api/data').json<MarkTiddlyData>();
  if (title) store.title = title;
  return { tiddlers, activePath, ssr };
}

export async function loadTiddlers() {
  const { tiddlers, activePath, ssr } =
    (await loadDataFromLocal()) || (await loadDataFromRemote());
  const tiddlerMap = new Map<string, MarkTiddler>();
  const idMap = new Map<string, string>();
  tiddlers?.forEach((item) => {
    tiddlerMap.set(item.name, item);
    if (item.frontmatter.id) idMap.set(item.frontmatter.id, item.name);
  });
  store.tiddlerMap = tiddlerMap;
  store.tiddlerIdMap = idMap;
  store.defaultPath = activePath;
  store.activePath ||= activePath;
  store.ssr = ssr ?? false;
}

export function getTiddlerByUrl(search?: string) {
  const pathInfo = getTiddlerNameByUrl(search);
  return pathInfo?.type === MarkTiddlyPathType.Path
    ? store.tiddlerMap.get(pathInfo.path)
    : undefined;
}

export function checkUrl() {
  store.activePath = getTiddlerNameByUrl() || store.defaultPath;
}

window.addEventListener('popstate', checkUrl);

export function openTiddler(item: MarkTiddler) {
  const name = item.name.toLowerCase();
  history.pushState({}, '', `?p=${encodeURIComponent(name)}`);
  checkUrl();
}
