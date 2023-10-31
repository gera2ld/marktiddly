import { reactive } from 'vue';
import { MarkTiddler } from '../../common/types';

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
  activeName: '',
});
