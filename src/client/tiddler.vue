<template>
  <div @click="handleClick">
    <div class="flex items-center px-4 py-2">
      <div class="flex-1 font-bold text-center md:text-left">
        <template v-for="ancestor in family" :key="ancestor.name">
          <a
            :href="getTiddlerUrl(ancestor)"
            v-text="ancestor.frontmatter.title"
          ></a>
          /
        </template>
        <span v-text="tiddler.frontmatter.title"></span>
      </div>
      <div class="cursor-pointer" v-if="closable" @click="emit('close')">
        &cross;
      </div>
    </div>
    <div class="p-4" v-html="tiddler.html" ref="body"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { MarkTiddler, MarkTiddlyPathType } from '../common/types';
import {
  getRenderer,
  getTiddlerFamily,
  getTiddlerNameByUrl,
  getTiddlerUrl,
  store,
} from './util';

const { tiddler, closable = false } = defineProps<{
  tiddler: MarkTiddler;
  closable?: boolean;
}>();
const emit = defineEmits<{
  (type: 'close'): void;
  (type: 'link', href: string): void;
}>();

const body = ref<HTMLDivElement>();

const family = computed(() => getTiddlerFamily(tiddler.name).slice(0, -1));

const handleClick = (e: MouseEvent) => {
  const a = (e.target as HTMLElement).closest('a');
  if (a) {
    const href = a.getAttribute('href');
    if (href?.startsWith('?')) {
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
};

watch(
  () => [body.value, tiddler.html],
  async ([bodyEl, html]) => {
    if (!bodyEl || !html) return;
    const renderer = await getRenderer();
    renderer.process(bodyEl);
  },
);
</script>
