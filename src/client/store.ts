import { reactive } from 'vue';
import { MarkTiddly } from './types';

export const store = reactive<{
  keyword: string;
  tiddlers: Map<string, MarkTiddly>;
  openPaths: string[];
}>({
  keyword: '',
  tiddlers: new Map(),
  openPaths: [],
});
