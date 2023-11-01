import { reactive } from 'vue';
import { MarkTiddler } from '../../common/types';

export const store = reactive<{
  title: string;
  tiddlerMap: Map<string, MarkTiddler>;
  tiddlerIdMap: Map<string, string>;
  activeName?: string;
  defaultName?: string;
  password?: {
    hint?: string;
    error?: string;
  };
  search?: {
    keyword: string;
    active: number;
  };
}>({
  title: 'MarkTiddly',
  tiddlerMap: new Map(),
  tiddlerIdMap: new Map(),
  activeName: '',
});
