<template>
  <div class="flex mx-auto max-w-screen-xl h-screen">
    <main class="flex-1 min-w-0 overflow-y-auto p-4">
      <Tiddler
        v-for="tiddler in openTiddlers"
        :key="tiddler.path"
        :tiddler="tiddler"
        @close="closeTiddler(tiddler)"
      />
    </main>
    <aside class="w-64 flex flex-col p-4">
      <div class="mb-2 text-xl text-orange-400">MarkTiddly</div>
      <input
        class="block w-full bg-transparent border-b border-gray(300 dark:700) px-2"
        type="search"
        v-model="store.keyword"
        placeholder="Search your tiddlers here"
      />
      <ul class="flex-1 mt-4 min-h-0 overflow-x-hidden overflow-y-auto text-sm">
        <li v-for="item in results" @click="openTiddler(item)">
          <a
            class="block px-2 py-1 hover:bg-gray-100"
            :href="`#${item.path}`"
            v-text="item.title || item.path"
          ></a>
        </li>
      </ul>
      <div>&copy; 2022 <a href="https://gera2ld.space/">Gerald</a> ❤️</div>
    </aside>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { store } from './store';
import { openTiddler, closeTiddler } from './util';
import Tiddler from './tiddler.vue';

const results = computed(() => {
  if (!store.keyword) return [];
  const keyword = store.keyword.toLowerCase();
  return [...store.tiddlers.values()].filter((item) =>
    item.content.toLowerCase().includes(keyword)
  );
});

const openTiddlers = computed(() => {
  return store.openPaths
    .map((path) => store.tiddlers.get(path))
    .filter(Boolean);
});
</script>
