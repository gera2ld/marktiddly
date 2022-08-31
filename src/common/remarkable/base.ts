import { Remarkable } from 'remarkable';

const md = new Remarkable();
md.core.ruler.before('inline', 'rel-link', (state) => {
  for (const token of state.tokens) {
    if (token.type === 'inline' && token.content) {
      token.content = token.content.replace(
        /\[(.+?)\]\(\[\[(.+?)\]\]\)|\[\[(.+?)\]\]/g,
        (m, g1, g2, g3) => `[${g1 || g3}](#${g2 || g3})`
      );
    }
  }
});

export default md;
