import { computed, reactive } from 'vue';
import { MarkTiddler } from '../../common/types';
import { fuzzySearch, getTiddlerNameByUrl } from './util';

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

export const matches = computed(() => {
  const keyword = store.keyword.toLowerCase();
  const titleMatches: MarkTiddler[] = [];
  const titleFuzzyMatches: MarkTiddler[] = [];
  const contentMatches: MarkTiddler[] = [];
  if (keyword) {
    Array.from(store.tiddlerMap.values()).forEach((item) => {
      const title = item.frontmatter?.title?.toLowerCase() || item.name;
      if (title.includes(keyword)) {
        titleMatches.push(item);
        return;
      }
      const result = fuzzySearch(keyword, title);
      if (result) {
        titleFuzzyMatches.push(item);
        return;
      }
      if (item.content.toLowerCase().includes(keyword)) {
        contentMatches.push(item);
      }
    });
  }
  return {
    title: titleMatches.concat(titleFuzzyMatches),
    content: contentMatches,
  };
});

export const activeTiddler = computed(() =>
  store.tiddlerMap.get(store.activeName)
);
