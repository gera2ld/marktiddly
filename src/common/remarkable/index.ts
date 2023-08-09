import { Remarkable } from 'remarkable';
import hljs from 'highlight.js';
import { linkPlugin } from './base';

export function getMd(resolve?: (path: string) => string) {
  const md = new Remarkable();
  md.use(linkPlugin, { resolve });
  md.set({
    highlight: (str: string, language: string) => {
      return hljs.highlightAuto(str, language ? [language] : undefined).value;
    },
  });
  return md;
}
