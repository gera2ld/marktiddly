import { memoize } from 'lodash-es';
import { linkPlugin } from '../../common/remarkable/base';
import { MarkTiddler, MarkTiddlyPathType } from '../../common/types';
import { store } from './store';
import { getTiddlerFamily } from './util';

const linkRenderPlugin = {
  name: 'links',
  remarkable: linkPlugin,
  onMounted(el: HTMLElement) {
    el.querySelectorAll('a').forEach((a) => {
      const href = a.getAttribute('href');
      if (href?.startsWith('?')) {
        let p = new URLSearchParams(href).get(MarkTiddlyPathType.Path) || '';
        if (p) {
          p = store.tiddlerIdMap.get(p) || p;
          const linked = getTiddlerFamily(p);
          if (linked.length) {
            a.textContent = linked
              .map((t) => t.frontmatter.title || t.path)
              .join('/');
          } else {
            a.classList.add('non-existent');
          }
        }
      } else {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
    });
  },
};

export const getRenderer = memoize(async () => {
  const { builtInPlugins, MarkdownRenderer, HtmlRenderer } = await import(
    'https://cdn.jsdelivr.net/gh/gera2ld/js-lib@dist/render.js'
  );
  const plugins = [...builtInPlugins, linkRenderPlugin];
  if (store.ssr) {
    const i = plugins.findIndex(({ name }) => name === 'hljs');
    if (i >= 0) {
      plugins[i] = {
        ...plugins[i],
        // disable onMounted since highlight is done on server side
        onMounted: undefined,
      };
    }
    return HtmlRenderer.create(plugins);
  }
  return MarkdownRenderer.create(plugins);
});

export async function renderMarkdown(tiddler: MarkTiddler) {
  const renderer = await getRenderer();
  ({ html: tiddler.html } = renderer.render(tiddler.content || ''));
}
