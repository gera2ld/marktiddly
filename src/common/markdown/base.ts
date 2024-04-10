import type MarkdownIt from 'markdown-it';
import { MarkTiddlyPath, MarkTiddlyPathType } from '../types';

export function linkPlugin(
  md: MarkdownIt,
  opts?: {
    onLink?: (data: MarkTiddlyPath) => void;
  },
) {
  md.core.ruler.before('inline', 'rel-link', (state) => {
    for (const token of state.tokens) {
      let content = token.content as string;
      if (token.type === 'inline' && content) {
        // [[label]] -> [label](?p=label)
        content = content.replace(/\[\[(.+?)\]\]/g, (_, g1) => {
          const path = g1.toLowerCase();
          opts?.onLink?.({
            type: MarkTiddlyPathType.Path,
            path,
          });
          const url = `?p=${encodeURIComponent(path)}`;
          return `[${g1}](${url})`;
        });
        // auto URL
        content = content.replace(/(^|\s)(https?:\/\/\S+)/g, '$1<$2>');
        // #xxx -> [xxx](?r=%23xxx)
        content = content.replace(/(^|\s)(#[^\s#]+)/g, (_, g1, g2) => {
          const path = g2.toLowerCase();
          opts?.onLink?.({
            type: MarkTiddlyPathType.Ref,
            path,
          });
          const url = `?r=${encodeURIComponent(path)}`;
          return `${g1}[${g2}](${url})`;
        });
        token.content = content;
      }
    }
    return false;
  });
}
