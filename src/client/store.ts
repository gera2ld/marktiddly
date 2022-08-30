import { reactive } from 'vue';
import { MarkTiddler } from './types';

export const store = reactive<{
  keyword: string;
  tiddlers: Map<string, MarkTiddler>;
  openNames: string[];
}>({
  keyword: '',
  tiddlers: new Map(),
  openNames: [],
});
