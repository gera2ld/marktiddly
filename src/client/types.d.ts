import { MarkTiddler } from '../common/types';

declare global {
  interface Window {
    Prism: any;
    marktiddly?: {
      title?: string;
      tiddlers?: MarkTiddler[];
      openNames?: string[];
    };
  }
}
