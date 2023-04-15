<template>
  <div ref="el" class="rounded border border-gray(300 dark:700) mb-4">
    <div class="flex px-4 py-2 border-b border-gray(300 dark:700)">
      <div class="flex-1 font-bold" v-text="title"></div>
      <div class="cursor-pointer" v-if="closable" @click="emit('close')">
        &cross;
      </div>
    </div>
    <div
      class="p-4 markdown-body"
      v-html="tiddler.html"
      @click="handleClick"
      ref="body"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, nextTick } from 'vue';
import { MarkTiddler } from '../common/types';
import { getMd } from '../common/remarkable';
import { highlight, getTiddlerByUrl, store } from './util';

const { tiddler, closable = false } = defineProps<{
  tiddler: MarkTiddler;
  closable?: boolean;
}>();
const emit = defineEmits<{
  (type: 'close'): void;
  (type: 'link', href: string): void;
}>();

const title = computed(() => {
  return tiddler.frontmatter?.title || tiddler.name;
});

const el = ref<HTMLDivElement>();
const body = ref<HTMLDivElement>();

const handleClick = (e: MouseEvent) => {
  const a = (e.target as HTMLElement).closest('a');
  if (a) {
    const href = a.getAttribute('href');
    if (href && getTiddlerByUrl(href)) {
      e.preventDefault();
      emit('link', href);
    }
  }
};

function checkLinks() {
  body.value?.querySelectorAll('a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href?.startsWith('?')) {
      const p = new URLSearchParams(href).get('p');
      const linked = p && store.tiddlers.get(p);
      if (!linked) a.classList.add('non-existent');
    } else {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
  });
}

onMounted(() => {
  if (tiddler.html == null) {
    const md = getMd(() => '');
    tiddler.html = md.render(tiddler.content);
  }
  if (el.value && !tiddler.ssr) highlight(el.value);
  nextTick(checkLinks);
});
</script>
