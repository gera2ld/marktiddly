import { MarkTiddler } from '../common/types';

export interface MarkTiddlyData {
  title?: string;
  tiddlers?: MarkTiddler[];
  activeName?: string;
}

declare global {
  interface Window {
    Prism: any;
    marktiddly?: {
      title?: string;
      passwordHint?: string;
      meta?: string;
      data: any;
    };
  }
}
