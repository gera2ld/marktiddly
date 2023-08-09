import { MarkTiddler } from '../common/types';

export interface MarkTiddlyData {
  title?: string;
  tiddlers?: MarkTiddler[];
  activeName?: string;
}
