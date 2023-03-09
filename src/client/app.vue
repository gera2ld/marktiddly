<template>
  <div class="flex mx-auto max-w-screen-xl h-screen">
    <main class="flex-1 min-w-0 overflow-y-auto p-4">
      <TransitionGroup name="tiddler">
        <Tiddler
          v-for="tiddler in openTiddlers"
          :key="tiddler.name"
          ref="refTiddlers"
          :tiddler="tiddler"
          @link="handleLink"
          @close="handleClose(tiddler)"
        />
      </TransitionGroup>
    </main>
    <aside class="w-64 flex flex-col p-4">
      <div class="flex mb-2 text-xl text-orange-400" v-text="store.title"></div>
      <input
        class="block w-full bg-transparent border-b border-gray(300 dark:700) px-2"
        type="search"
        v-model="store.keyword"
        placeholder="Search your tiddlers here"
      />
      <div
        class="flex-1 min-h-0 overflow-x-hidden overflow-y-auto text-sm mb-4"
      >
        <template
          v-for="[group, groupTitle] in [
            ['title', 'Title Matches'],
            ['content', 'Content Matches'],
          ]"
        >
          <template v-if="matches[group].length">
            <div
              class="sticky top-0 bottom-0 bg(gray-100 dark:gray-900) px-2 py-1 text(gray-600 dark:gray-400)"
              v-text="`${groupTitle} (${matches[group].length})`"
            ></div>
            <ul>
              <li v-for="item in matches[group]" @click="handleOpen(item)">
                <a
                  class="block px-2 py-1 hover:bg(blue-100 dark:blue-700) hover:text(gray-600 dark:black)"
                  :href="`#${item.name}`"
                  @click.prevent
                  v-text="item.frontmatter?.title || item.name"
                ></a>
              </li>
            </ul>
          </template>
        </template>
      </div>
      <div>
        Powered by
        <a
          href="https://github.com/gera2ld/marktiddly"
          rel="noopener noreferrer"
        >
          MarkTiddly
        </a>
        ❤️
      </div>
    </aside>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, nextTick } from 'vue';
import debounce from 'lodash.debounce';
import { store } from './store';
import { openTiddler, closeTiddler, fuzzySearch, loadTiddlers } from './util';
import Tiddler from './tiddler.vue';
import { MarkTiddler } from '../common/types';

const matches = ref<{ title: MarkTiddler[]; content: MarkTiddler[] }>({
  title: [],
  content: [],
});
const refTiddlers = ref([]);

watch(
  () => store.keyword,
  debounce((keyword: string) => {
    keyword = keyword.toLowerCase();
    const titleMatches: MarkTiddler[] = [];
    const titleFuzzyMatches: MarkTiddler[] = [];
    const contentMatches: MarkTiddler[] = [];
    if (keyword) {
      Array.from(store.tiddlers.values()).forEach((item) => {
        const title = (item.frontmatter?.title || item.name).toLowerCase();
        if (title.includes(keyword)) {
          titleMatches.push(item);
          return;
        }
        const result = fuzzySearch(keyword, title);
        if (result) {
          titleFuzzyMatches.push(item);
          return;
        }
        if (item.content.toLowerCase().includes(keyword)) {
          contentMatches.push(item);
        }
      });
    }
    matches.value = {
      title: titleMatches.concat(titleFuzzyMatches),
      content: contentMatches,
    };
  }, 200)
);

const openTiddlers = computed(() => {
  return store.openNames
    .map((name) => store.tiddlers.get(name))
    .filter(Boolean);
});

const handleClose = (tiddler: MarkTiddler) => {
  closeTiddler(tiddler);
};

loadTiddlers().then(handleHash);

let lock = false;

function handleOpen(tiddler: MarkTiddler) {
  openTiddler(tiddler);
  if (lock) return;
  lock = true;
  nextTick(() => {
    const item = refTiddlers.value.find((item) => item.tiddler === tiddler);
    item?.$el?.scrollIntoView({ behavior: 'smooth' });
    lock = false;
  });
}

function handleHash() {
  const name = window.location.hash.slice(1);
  const tiddler = store.tiddlers.get(name);
  if (tiddler) handleOpen(tiddler);
}

function handleLink(link: string) {
  const tiddler = store.tiddlers.get(link);
  if (tiddler) handleOpen(tiddler);
}
</script>

<style>
.tiddler-enter-from {
  transform: translateY(-20vh);
  opacity: 0;
}

.tiddler-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.tiddler-enter-active,
.tiddler-leave-active {
  transition: all 0.5s ease;
}
</style>
