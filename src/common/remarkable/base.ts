import type { Remarkable } from 'remarkable';

export function linkPlugin(md: Remarkable) {
  md.core.ruler.before(
    'inline',
    'rel-link',
    (state) => {
      for (const token of state.tokens) {
        let content = token.content as string;
        if (token.type === 'inline' && content) {
          // [[label]] -> [label](?p=label)
          content = content.replace(/\[\[(.+?)\]\]/g, (_, g1) => {
            const path = `?p=${encodeURIComponent(g1.toLowerCase())}`;
            return `[${g1}](${path})`;
          });
          // auto URL
          content = content.replace(/(^|\s)(https?:\/\/\S+)/g, '$1<$2>');
          // #xxx -> [xxx](?p=tags.xxx)
          content = content.replace(/(^|\s)#([^\s#]+)/g, (_, g1, g2) => {
            const path = encodeURIComponent(`tags.${g2.toLowerCase()}`);
            return `${g1}[#${g2}](?p=${path})`;
          });
          token.content = content;
        }
      }
      return false;
    },
    {},
  );
}
