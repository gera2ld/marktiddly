<template>
  <div
    class="md:hidden fixed inset-0 bg-gray-500 opacity-50 z-10"
    v-if="show"
    @click="emit('close')"
  ></div>
  <aside
    class="fixed w-64 top-12 md:top-0 bottom-0 flex flex-col p-4 z-10 bg-white dark:bg-gray-800 transition-transform ease-in duration-300 md:translate-x-0"
    :class="show ? '' : 'translate-x-[-100%]'"
  >
    <div
      class="flex mb-2 text-xl text-orange-400 hidden md:block"
      v-text="store.title"
    ></div>
    <input
      class="block w-full"
      type="search"
      v-model="keyword"
      placeholder="Search your tiddlers here"
    />
    <div class="flex-1 min-h-0 overflow-x-hidden overflow-y-auto text-sm mb-4">
      <template
        v-for="[group, groupTitle] in [
          ['title', 'Title Matches'],
          ['content', 'Content Matches'],
        ]"
      >
        <template v-if="matches[group].length">
          <div
            class="sticky top-0 bottom-0 bg-gray-100 dark:bg-gray-900 px-2 py-1 text-gray-600 dark:text-gray-400"
            v-text="`${groupTitle} (${matches[group].length})`"
          ></div>
          <ul>
            <li v-for="item in matches[group]" @click="handleOpen(item)">
              <a
                class="block px-2 py-1 hover:bg-blue-100 hover:dark:bg-blue-700 hover:text-gray-600 hover:dark:text-black"
                :href="`#${item.name}`"
                @click.prevent
                v-text="item.frontmatter?.title || item.name"
              ></a>
            </li>
          </ul>
        </template>
      </template>
    </div>
    <Footer />
  </aside>
</template>

<script lang="ts" setup>
import { debounce } from 'lodash-es';
import { ref, watch } from 'vue';
import { store, matches, openTiddler } from './util';
import { MarkTiddler } from '../common/types';
import Footer from './footer.vue';

defineProps<{
  show?: boolean;
}>();
const emit = defineEmits<{
  (event: 'close'): void;
}>();

const keyword = ref(store.keyword);

watch(
  keyword,
  debounce((keyword: string) => {
    store.keyword = keyword;
  }, 200)
);

function handleOpen(tiddler: MarkTiddler) {
  openTiddler(tiddler);
  emit('close');
}
</script>
