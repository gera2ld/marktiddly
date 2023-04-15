import { Remarkable } from 'remarkable';

export function getMd(resolve: (path: string) => string) {
  const md = new Remarkable();
  md.core.ruler.before(
    'inline',
    'rel-link',
    (state) => {
      for (const token of state.tokens) {
        if (token.type === 'inline' && token.content) {
          // [label](relpath)
          // [label]([[tiddler-name]])
          // [[label]]
          // [[label|tiddler-name]]
          token.content = token.content.replace(
            /\[(.+?)\]\((.+?)\)|\[\[(.+?)\]\]/g,
            (m, g1, g2, g3) => {
              let label: string;
              let name: string;
              let path: string;
              if (g2) {
                if (g2.includes('://')) return m;
                label = g1;
                if (/^\[\[.*?\]\]$/.test(g2)) {
                  name = g2.slice(2, -2);
                } else {
                  name = resolve(g2);
                  if (!name) path = g2;
                }
              } else {
                [label, name] = g3.split('|');
                name ||= label.toLowerCase();
              }
              path ||= `?p=${encodeURIComponent(name)}`;
              return `[${label}](${path})`;
            }
          );
        }
      }
      return false;
    },
    {}
  );
  return md;
}
