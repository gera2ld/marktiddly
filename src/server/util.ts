import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/index.js';
import md from '../common/remarkable';

md.set({
  highlight: (str: string, lang: string) => {
    let grammar = Prism.languages[lang];
    if (!grammar && lang) {
      loadLanguages([lang]);
      grammar = Prism.languages[lang];
    }
    if (grammar) {
      return Prism.highlight(str, grammar, lang);
    }
    return '';
  },
});

export function render(content: string) {
  return md.render(content);
}
