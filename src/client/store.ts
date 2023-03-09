import { reactive } from 'vue';
import { MarkTiddler } from '../common/types';

export const store = reactive<{
  keyword: string;
  title: string;
  tiddlers: Map<string, MarkTiddler>;
  openNames: string[];
}>({
  keyword: '',
  title: window.marktiddly?.title || 'MarkTiddly',
  tiddlers: new Map(),
  openNames: window.marktiddly?.openNames || [],
});
