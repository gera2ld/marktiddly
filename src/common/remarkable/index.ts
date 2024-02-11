import hljs from 'highlight.js';
import { Remarkable } from 'remarkable';
import { MarkTiddlyPath } from '../types';
import { linkPlugin } from './base';

export function getMd(opts?: { onLink?: (data: MarkTiddlyPath) => void }) {
  const md = new Remarkable();
  md.use(linkPlugin, opts);
  md.set({
    highlight: (str: string, language: string) => {
      return hljs.highlightAuto(str, language ? [language] : undefined).value;
    },
  });
  return md;
}
