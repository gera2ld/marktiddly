import { store } from './store';
import { openTiddler } from './loader';
import { matches } from './getters';

export function handleEnter(name: string) {
  const tiddler = store.tiddlerMap.get(name);
  if (tiddler) openTiddler(tiddler);
}

export function handleSearchOpen() {
  store.search = {
    keyword: '',
    active: 0,
  };
}

export function handleSearchClose() {
  store.search = undefined;
}

export function handleSearchActive(arg: number | ((active: number) => number)) {
  if (!store.search) return;
  let active = typeof arg === 'function' ? arg(store.search.active) : arg;
  const { length } = matches.value;
  if (active < 0) {
    active = length - 1;
  } else if (active >= length) {
    active = 0;
  }
  store.search.active = active;
}

export function handleSearchEnter(active?: number) {
  const name = matches.value[active ?? store.search?.active ?? 0]?.name;
  if (name) handleEnter(name);
  handleSearchClose();
}
