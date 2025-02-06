<template>
  <div class="tiddler" @click="handleClick">
    <div class="flex grid-col-start-2">
      <div class="flex-1 mt-6">
        <div>
          <template v-for="ancestor in family" :key="ancestor.name">
            <a
              :href="getTiddlerUrl(ancestor)"
              v-text="ancestor.frontmatter.title"
            ></a>
            /
          </template>
        </div>
        <h1 class="!mt-0" v-text="tiddler.frontmatter.title"></h1>
      </div>
      <div class="cursor-pointer" v-if="closable" @click="emit('close')">
        &cross;
      </div>
    </div>
    <div
      class="toc grid-col-start-3 grid-row-start-2"
      v-if="tocItems"
      ref="toc"
    >
      <ul>
        <li
          v-for="(item, i) in tocItems"
          :key="i"
          :style="`--toc-depth:${item.depth}`"
        >
          <a :href="`#${item.slug}`" v-text="item.text"></a>
        </li>
      </ul>
    </div>
    <div class="grid-col-start-2 py-4" v-html="tiddler.html" ref="body"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';
import { MarkTiddler, MarkTiddlyPathType } from '../common/types';
import {
  getRenderer,
  getTiddlerFamily,
  getTiddlerNameByUrl,
  getTiddlerUrl,
  store,
} from './util';
import { onScroll } from './util/scroller';

const { tiddler, closable = false } = defineProps<{
  tiddler: MarkTiddler;
  closable?: boolean;
}>();
const emit = defineEmits<{
  (type: 'close'): void;
  (type: 'link', href: string): void;
}>();

const body = ref<HTMLDivElement>();
const toc = ref<HTMLDivElement>();

const family = computed(() => getTiddlerFamily(tiddler.name).slice(0, -1));
const tocItems = computed(() => {
  if (!tiddler.html) return [];
  const div = document.createElement('div');
  div.innerHTML = tiddler.html;
  const headings = [...div.querySelectorAll('h1,h2,h3,h4,h5,h6')];
  const baseDepth = Math.min(
    6,
    ...headings.map((item) => +item.tagName.slice(1)),
  );
  return headings
    .map((heading) => ({
      slug: heading.id,
      text: heading.textContent,
      depth: +heading.tagName.slice(1) - baseDepth,
    }))
    .filter((item) => item.slug && item.text);
});

function handleClick(e: MouseEvent) {
  const a = (e.target as HTMLElement).closest('a');
  if (a) {
    const href = a.getAttribute('href');
    if (href?.startsWith('#')) {
      const el = document.querySelector(href);
      if (!el) return;
    } else if (href?.startsWith('?')) {
      e.preventDefault();
      const pathInfo = getTiddlerNameByUrl(href);
      if (
        pathInfo &&
        (pathInfo.type === MarkTiddlyPathType.Ref ||
          store.tiddlerMap.has(pathInfo.path))
      ) {
        emit('link', href);
      }
    }
  }
}

watch(
  () => [body.value, tiddler.html] as const,
  async ([bodyEl, html]) => {
    if (!bodyEl || !html) return;
    const renderer = await getRenderer();
    renderer.process(bodyEl);
  },
);

onMounted(() => {
  let activeItem: HTMLElement | undefined;
  const dispose = onScroll(() => {
    if (!toc.value) return;
    const items = toc.value.querySelectorAll<HTMLElement>('li');
    const newActiveItem = [...items].reverse().find((item) => {
      const id = item.querySelector('a')?.getAttribute('href');
      const target = id ? document.querySelector<HTMLElement>(id) : undefined;
      const rect = target?.getBoundingClientRect();
      return rect && rect.top <= 64;
    });
    if (activeItem !== newActiveItem) {
      if (activeItem) activeItem.className = '';
      activeItem = newActiveItem;
      if (activeItem) activeItem.className = 'active';
    }
  });
  return dispose;
});
</script>
