import { reactive } from 'vue';
import { MarkTiddler, MarkTiddlyPath } from '../../common/types';

export const store = reactive<{
  title: string;
  favicon: string;
  ssr: boolean;
  tiddlerMap: Map<string, MarkTiddler>;
  tiddlerIdMap: Map<string, string>;
  activePath?: MarkTiddlyPath;
  defaultPath?: MarkTiddlyPath;
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
  favicon: '',
  ssr: true,
  tiddlerMap: new Map(),
  tiddlerIdMap: new Map(),
});
