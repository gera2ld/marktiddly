import { requestText } from './util';

const prefix = 'https://cdn.jsdelivr.net/npm/';

let loading: ReturnType<typeof initialize>;

loadCSS();

async function initialize() {
  await import(
    `${prefix}@highlightjs/cdn-assets@${process.env.HLJS_VERSION}/highlight.min.js`
  );
  return window.hljs;
}

async function loadCSS() {
  const [dark, light] = await Promise.all(
    ['tokyo-night-dark', 'tokyo-night-light'].map((theme) =>
      requestText(
        `${prefix}@highlightjs/cdn-assets@${process.env.HLJS_VERSION}/styles/${theme}.min.css`,
      ),
    ),
  );
  const css = `\
@media (prefers-color-scheme: dark) {
  ${dark}
}
@media (prefers-color-scheme: light) {
  ${light}
}`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);
}

export async function highlight(el: HTMLElement) {
  loading ||= initialize();
  const hljs = await loading;
  hljs.highlightElement(el);
}
