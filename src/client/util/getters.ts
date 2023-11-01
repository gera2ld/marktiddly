import { computed } from 'vue';
import { MarkTiddler } from '../../common/types';
import { getTiddlerFamily } from './util';
import { getMdBrowser } from '../../common/remarkable/browser';
import { fuzzySearch } from './search';
import { store } from './store';

const tiddlerData = computed(() => {
  const tiddlers = [...store.tiddlerMap.values()];
  return tiddlers.map((tiddler) => ({
    tiddler,
    titles: getTiddlerFamily(tiddler.name).map((t) => t.frontmatter.title),
  }));
});
const magicChar = '\x02';
const searchTitleData = computed(() =>
  tiddlerData.value.map(({ titles }) => titles.join(magicChar)),
);
const searchContentData = computed(() =>
  tiddlerData.value.map(({ tiddler }) => tiddler.content),
);

export const matches = computed(() => {
  const keyword = store.search?.keyword;
  if (!keyword) return [];
  const matches = new Map<number, { title?: string; content?: string }>();
  const titleMatches = fuzzySearch(searchTitleData.value, keyword, {
    maxSize: Infinity,
    contextSize: Infinity,
  });
  titleMatches.forEach(({ index, content }) => {
    matches.set(index, { title: replaceSep(content) });
  });
  const contentMatches = fuzzySearch(searchContentData.value, keyword);
  contentMatches.forEach(({ index, content }) => {
    const match = {
      index,
      ...matches.get(index),
    };
    match.content = content;
    matches.set(index, match);
  });
  return Array.from(matches, ([index, match]) => ({
    index,
    name: tiddlerData.value[index].tiddler.name,
    title: replaceSep(searchTitleData.value[index]),
    ...match,
  }));
});

function replaceSep(html: string) {
  return html.replaceAll(magicChar, '<span class="sep">/</span>');
}

export const activeTiddler = computed(() => {
  const tiddler = store.tiddlerMap.get(store.activeName || '');
  if (tiddler && tiddler.html == null) renderMd(tiddler);
  return tiddler;
});

async function renderMd(tiddler: MarkTiddler) {
  const md = await getMdBrowser();
  tiddler.html = md.render(tiddler.content);
}
