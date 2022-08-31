<template>
  <div
    ref="el"
    class="rounded border border-gray(300 dark:700) mb-4 markdown-body"
  >
    <div class="flex px-4 py-2 border-b border-gray(300 dark:700)">
      <div class="flex-1 font-bold" v-text="title"></div>
      <div class="cursor-pointer" @click="emit('close')">&cross;</div>
    </div>
    <div
      class="p-4"
      v-html="tiddler.html"
      @click="handleClick"
      ref="body"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { MarkTiddler } from '../common/types';
import { highlight } from './util';
import { store } from './store';

const { tiddler } = defineProps<{
  tiddler: MarkTiddler;
}>();
const emit = defineEmits(['close', 'link']);

const title = computed(() => {
  return tiddler.frontmatter?.title || tiddler.name;
});

const el = ref<HTMLDivElement>(null);
const body = ref<HTMLDivElement>(null);

const handleClick = (e: MouseEvent) => {
  const a = (e.target as HTMLElement).closest('a');
  if (a) {
    const href = a.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      emit('link', href.slice(1));
    }
  }
};

onMounted(() => {
  if (el.value && !tiddler.ssr) highlight(el.value);
  body.value.querySelectorAll('a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href.startsWith('#')) {
      const linked = store.tiddlers.get(href.slice(1));
      if (!linked) a.classList.add('text-red-400', 'cursor-not-allowed');
    } else {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
  });
});
</script>
