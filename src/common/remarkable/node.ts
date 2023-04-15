import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/index.js';
import { getMd as getBaseMd } from './base';

export function getMd(resolve: (path: string) => string) {
  const md = getBaseMd(resolve);
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
  return md;
}
