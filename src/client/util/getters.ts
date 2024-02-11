import { computed } from 'vue';
import { MarkTiddler, MarkTiddlyPathType } from '../../common/types';
import { renderMarkdown } from './markdown';
import { fuzzySearch } from './search';
import { store } from './store';
import { getTiddlerFamily, safeHtml } from './util';

const tiddlerData = computed(() => {
  const tiddlers = [...store.tiddlerMap.values()];
  return tiddlers.map((tiddler) => ({
    tiddler,
    titles: getTiddlerFamily(tiddler.name).map((t) => t.frontmatter.title),
  }));
});
const magicChar = '\x02';
const searchTitleData = computed(() =>
  tiddlerData.value.map(({ titles }) => titles.join(magicChar)),
);
const searchContentData = computed(() =>
  tiddlerData.value.map(
    ({ tiddler }) =>
      tiddler.html?.replace(/<[^>]+?>/g, '') || tiddler.content || '',
  ),
);
const searchNameData = computed(() =>
  tiddlerData.value.map(({ tiddler }) => tiddler.name),
);

interface IMatchData {
  matchedTitle?: string;
  matchedContent?: string;
  matchedName?: string;
}

const rules: Array<{
  data: { value: string[] };
  options?: {
    maxSize?: number;
    contextSize?: number;
  };
  field: keyof IMatchData;
}> = [
  {
    data: searchTitleData,
    options: { maxSize: Infinity, contextSize: Infinity },
    field: 'matchedTitle',
  },
  { data: searchContentData, field: 'matchedContent' },
  { data: searchNameData, field: 'matchedName' },
];

export const matches = computed(() => {
  const keyword = store.search?.keyword;
  if (!keyword) return [];
  const matches = new Map<number, IMatchData>();
  for (const { data, options, field } of rules) {
    const ruleMatches = fuzzySearch(data.value, keyword, options);
    ruleMatches.forEach(({ index, content }) => {
      const match = {
        index,
        ...matches.get(index),
        [field]: content,
      };
      matches.set(index, match);
    });
  }
  return Array.from(matches, ([index, match]) => ({
    index,
    name: tiddlerData.value[index].tiddler.name,
    title: replaceSep(match.matchedTitle || searchTitleData.value[index]),
    content: match.matchedContent,
    matchedName: match.matchedName,
  }));
});

function replaceSep(html: string) {
  return html.replaceAll(magicChar, '<span class="sep">/</span>');
}

export const activeTiddler = computed(() => {
  let tiddler: MarkTiddler | undefined;
  if (store.activePath) {
    const { type, path } = store.activePath;
    if (type === MarkTiddlyPathType.Path) {
      tiddler = store.tiddlerMap.get(path);
    } else if (type === MarkTiddlyPathType.Ref) {
      const backlinks = [...store.tiddlerMap.values()].filter((tiddler) =>
        tiddler.links?.includes(path),
      );
      tiddler = {
        name: `r/${path}`,
        path,
        frontmatter: { title: `Backlinks to ${path}` },
        html: [
          '<ul>',
          ...(backlinks.length
            ? backlinks.map(
                (item) =>
                  `<li><a href="?p=${encodeURIComponent(item.name)}">${safeHtml(item.frontmatter.title)}</a></li>`,
              )
            : `<li>None</li>`),
          '</ul>',
        ].join(''),
      };
    }
  }
  if (tiddler && tiddler.html == null) renderMarkdown(tiddler);
  return tiddler;
});
