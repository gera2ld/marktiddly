<template>
  <div
    class="backdrop fixed inset-0 z-10"
    v-if="store.search"
    @click="handleSearchClose"
  >
    <div class="panel bg-primary w-160 max-w-full mx-auto p-4" @click.stop>
      <input
        ref="input"
        class="block w-full"
        type="search"
        v-model="keyword"
        placeholder="Search your tiddlers here"
      />
      <ul
        class="overflow-x-hidden overflow-y-auto text-sm max-h-[50vh] mt-4"
        v-if="matches.length"
      >
        <li
          v-for="(item, index) in matches"
          :key="item.name"
          :href="`?p=${encodeURIComponent(item.name)}`"
          class="search-item"
          :class="{ 'search-item-active': index === store.search.active }"
          @mouseover="handleSearchActive(index)"
          @click="handleSearchEnter(index)"
        >
          <div>
            <span class="font-bold" v-html="item.title"></span>
            <span
              class="subtle ml-2"
              v-if="item.matchedName"
              v-html="`(${item.matchedName})`"
            ></span>
          </div>
          <div v-if="item.content" v-html="item.content"></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { debounce } from 'lodash-es';
import { nextTick, ref, watch } from 'vue';
import { store, matches } from './util';
import {
  handleSearchClose,
  handleSearchActive,
  handleSearchEnter,
} from './util/actions';

const keyword = ref('');
const input = ref<HTMLInputElement>();

watch(
  keyword,
  debounce((keyword: string) => {
    if (store.search) {
      store.search.keyword = keyword;
    }
  }, 200),
);

watch(
  () => store.search,
  (search, oldSearch) => {
    if (search && !oldSearch) {
      keyword.value = search.keyword;
      nextTick(() => {
        input.value?.focus();
      });
    }
  },
);
</script>
