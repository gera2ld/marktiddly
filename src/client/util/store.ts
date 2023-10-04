import { computed, reactive } from 'vue';
import { MarkTiddler } from '../../common/types';
import { getTiddlerFamily, getTiddlerNameByUrl } from './util';
import { getMdBrowser } from '../../common/remarkable/browser';
import { fuzzySearch } from './search';

export const store = reactive<{
  keyword: string;
  title: string;
  tiddlerMap: Map<string, MarkTiddler>;
  tiddlerIdMap: Map<string, string>;
  activeName?: string;
  defaultName?: string;
  password?: {
    hint?: string;
    error?: string;
  };
}>({
  keyword: '',
  title: 'MarkTiddly',
  tiddlerMap: new Map(),
  tiddlerIdMap: new Map(),
  activeName: getTiddlerNameByUrl(),
});

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
  const titleMatches = fuzzySearch(searchTitleData.value, store.keyword, {
    highlight: true,
  });
  const matched = new Set(titleMatches.map(({ index }) => index));
  const titleResults = titleMatches.map(({ index, content }) => ({
    title: replaceSep(content),
    name: tiddlerData.value[index].tiddler.name,
  }));
  const contentResults = fuzzySearch(searchContentData.value, store.keyword)
    .filter(({ index }) => !matched.has(index))
    .map(({ index }) => ({
      title: replaceSep(searchTitleData.value[index]),
      name: tiddlerData.value[index].tiddler.name,
    }));
  return {
    title: titleResults,
    content: contentResults,
  };
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
