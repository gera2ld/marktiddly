<template>
  <div
    ref="el"
    class="rounded border border-gray(300 dark:700) mb-4 markdown-body"
  >
    <div class="flex px-4 py-2 border-b border-gray(300 dark:700)">
      <div class="flex-1 font-bold" v-text="title"></div>
      <div class="cursor-pointer" @click="emit('close')">&cross;</div>
    </div>
    <div class="p-4" v-html="tiddler.html"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue';
import { MarkTiddler } from './types';
import { highlight } from './util';

const { tiddler } = defineProps<{
  tiddler: MarkTiddler;
}>();
const emit = defineEmits(['close']);

const title = computed(() => {
  return tiddler.title || tiddler.path;
});

const el = ref(null);

watchEffect(() => {
  if (el.value && !tiddler.ssr) highlight(el.value);
});
</script>
