import hljs from 'highlight.js';
import { MarkTiddler } from '../common/types';

export interface MarkTiddlyData {
  title?: string;
  tiddlers?: MarkTiddler[];
  activeName?: string;
}

declare global {
  interface Window {
    hljs: typeof hljs;
    marktiddly?: {
      title?: string;
      passwordHint?: string;
      meta?: string;
      data: any;
    };
  }
}
