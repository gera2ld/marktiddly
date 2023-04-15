import { computed, reactive } from 'vue';
import { MarkTiddler } from '../common/types';
import { fuzzySearch } from './util';

export const store = reactive<{
  keyword: string;
  title: string;
  tiddlers: Map<string, MarkTiddler>;
  activeName?: string;
}>({
  keyword: '',
  title: window.marktiddly?.title || 'MarkTiddly',
  tiddlers: new Map(),
  activeName: window.marktiddly?.activeName,
});

export const matches = computed(() => {
  const keyword = store.keyword.toLowerCase();
  const titleMatches: MarkTiddler[] = [];
  const titleFuzzyMatches: MarkTiddler[] = [];
  const contentMatches: MarkTiddler[] = [];
  if (keyword) {
    Array.from(store.tiddlers.values()).forEach((item) => {
      const title = (item.frontmatter?.title || item.name).toLowerCase();
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
  store.tiddlers.get(store.activeName)
);
