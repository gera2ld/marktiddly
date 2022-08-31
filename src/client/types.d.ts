import { MarkTiddler } from '../common/types';

declare global {
  interface Window {
    Prism: any;
    __tiddlers: MarkTiddler[];
  }
}
