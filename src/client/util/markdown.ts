import { once } from 'es-toolkit';
import { createLinkPlugin } from '../../common/markdown';
import { MarkTiddler, MarkTiddlyPathType } from '../../common/types';
import { store } from './store';
import { getTiddlerFamily } from './util';

export const getRenderer = once(async () => {
  const { builtInPlugins, MarkdownRenderer, HtmlRenderer } = await import(
    'js-lib/src/render'
  );
  const plugins = [
    ...builtInPlugins,
    createLinkPlugin({
      onMounted: (el: HTMLElement) => {
        el.querySelectorAll('a').forEach((a) => {
          const href = a.getAttribute('href');
          if (href?.startsWith('?')) {
            let p =
              new URLSearchParams(href).get(MarkTiddlyPathType.Path) || '';
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
    }),
  ];
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
