import { linkPlugin } from './base';

const remarkableUrl =
  'https://cdn.jsdelivr.net/npm/remarkable@2.0.1/dist/esm/index.browser.js/+esm';

export async function getMdBrowser(resolve?: (path: string) => string) {
  const { Remarkable } = (await import(
    remarkableUrl
  )) as typeof import('remarkable');
  const md = new Remarkable();
  md.use(linkPlugin, { resolve });
  return md;
}
