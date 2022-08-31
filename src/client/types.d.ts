import { MarkTiddler } from '../common/types';

declare global {
  interface Window {
    Prism: any;
    marktiddly?: {
      tiddlers?: MarkTiddler[];
      openNames?: string[];
    };
  }
}
