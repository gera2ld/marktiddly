<template>
  <div ref="el" @click="handleClick">
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
import { onMounted, ref, nextTick, computed } from 'vue';
import { MarkTiddler } from '../common/types';
import {
  highlight,
  getTiddlerByUrl,
  store,
  getTiddlerFamily,
  getTiddlerUrl,
} from './util';

const { tiddler, closable = false } = defineProps<{
  tiddler: MarkTiddler;
  closable?: boolean;
}>();
const emit = defineEmits<{
  (type: 'close'): void;
  (type: 'link', href: string): void;
}>();

const el = ref<HTMLDivElement>();
const body = ref<HTMLDivElement>();

const family = computed(() => getTiddlerFamily(tiddler.name).slice(0, -1));

const handleClick = (e: MouseEvent) => {
  const a = (e.target as HTMLElement).closest('a');
  if (a) {
    const href = a.getAttribute('href');
    if (href?.startsWith('?')) {
      e.preventDefault();
      if (getTiddlerByUrl(href)) {
        emit('link', href);
      }
    }
  }
};

function checkLinks() {
  body.value?.querySelectorAll('a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href?.startsWith('?')) {
      let p = new URLSearchParams(href).get('p') || '';
      p = (p && store.tiddlerIdMap.get(p)) || p;
      const linked = getTiddlerFamily(p);
      if (linked.length) {
        if (!p.startsWith('tags.')) {
          a.textContent = linked
            .map((t) => t.frontmatter.title || t.path)
            .join('/');
        }
      } else {
        a.classList.add('non-existent');
      }
    } else {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
  });
}

onMounted(async () => {
  if (el.value && !tiddler.ssr) highlight(el.value);
  nextTick(checkLinks);
});
</script>
