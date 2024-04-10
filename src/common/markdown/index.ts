import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import { MarkTiddlyPath } from '../types';
import { linkPlugin } from './base';

export function getMd(opts?: { onLink?: (data: MarkTiddlyPath) => void }) {
  const md = new MarkdownIt({
    html: true,
    breaks: true,
    highlight: (str: string, language: string) => {
      return hljs.highlightAuto(str, language ? [language] : undefined).value;
    },
  });
  md.use(linkPlugin, opts);
  return md;
}
