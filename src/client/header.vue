<template>
  <header
    class="sticky top-0 h-16 flex items-center justify-center max-w-full mx-auto px-4 z-1 bg-primary border-b border-gray-300 dark:border-gray-600"
  >
    <div
      class="w-8 h-8 mr-4 bg-contain bg-no-repeat"
      :style="`background-image: url(${store.favicon})`"
    ></div>
    <span
      class="text-orange-600 dark:text-orange-400 font-bold"
      v-text="store.title"
    ></span>
    <button class="flex-1 md:flex-none w-120 ml-4" @click="handleSearchOpen">
      <span class="mr-4">Search...</span>
      <kbd v-text="isMacintosh ? 'Cmd' : 'Ctrl'"></kbd>+<kbd>K</kbd>
    </button>
  </header>
</template>

<script lang="ts" setup>
import { store } from './util';
import { handleSearchOpen } from './util/actions';

const isMacintosh = navigator.userAgent.includes('Macintosh');
</script>
