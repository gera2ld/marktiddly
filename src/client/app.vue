<template>
  <div class="flex mx-auto max-w-screen-xl h-screen">
    <main class="flex-1 min-w-0 overflow-y-auto p-4">
      <div class="relative min-h-[90vh]">
        <TransitionGroup name="tiddler">
          <Tiddler
            v-if="activeTiddler"
            :key="activeTiddler.name"
            :tiddler="activeTiddler"
            @link="handleLink"
          />
        </TransitionGroup>
      </div>
      <div class="text-center">
        Powered by
        <a
          href="https://github.com/gera2ld/marktiddly"
          rel="noopener noreferrer"
        >
          MarkTiddly
        </a>
        ❤️
      </div>
    </main>
    <aside class="w-64 flex flex-col p-4">
      <div class="flex mb-2 text-xl text-orange-400" v-text="store.title"></div>
      <input
        class="block w-full bg-transparent border-b border-gray(300 dark:700) px-2"
        type="search"
        v-model="keyword"
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
              <li v-for="item in matches[group]" @click="openTiddler(item)">
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
    </aside>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { debounce } from 'lodash-es';
import { store, matches, activeTiddler } from './store';
import { openTiddler, loadTiddlers, checkUrl } from './util';
import Tiddler from './tiddler.vue';

const keyword = ref(store.keyword);

watch(
  keyword,
  debounce((keyword: string) => {
    store.keyword = keyword;
  }, 200)
);

loadTiddlers().then(checkUrl);

function handleLink(link: string) {
  history.pushState({}, '', link);
  checkUrl();
}
</script>

<style>
.tiddler-enter-from {
  transform: translateY(-20vh);
  opacity: 0;
}

.tiddler-leave-to {
  position: absolute;
  transform: translateX(-100%);
  opacity: 0;
}

.tiddler-enter-active,
.tiddler-leave-active {
  transition: all 1s ease;
}
</style>
