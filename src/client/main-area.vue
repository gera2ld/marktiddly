<template>
  <main class="px-4">
    <div
      class="sticky top-0 flex justify-center max-w-full mx-auto py-4 z-1 bg-primary"
    >
      <span
        class="text-orange-600 dark:text-orange-400 font-bold"
        v-text="store.title"
      ></span>
      <button class="flex-1 md:flex-none w-120 ml-4" @click="handleSearchOpen">
        <span class="mr-4">Search...</span>
        <kbd v-text="isMacintosh ? 'Cmd' : 'Ctrl'"></kbd>+<kbd>K</kbd>
      </button>
    </div>
    <div class="relative z-0">
      <TransitionGroup name="tiddler">
        <Tiddler
          v-if="activeTiddler"
          :key="activeTiddler.name"
          :tiddler="activeTiddler"
          @link="handleLink"
        />
      </TransitionGroup>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { activeTiddler, checkUrl, store } from './util';
import Tiddler from './tiddler.vue';
import { handleSearchOpen } from './util/actions';

const isMacintosh = navigator.userAgent.includes('Macintosh');

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
  transform: translateX(100%);
  opacity: 0;
}

.tiddler-enter-active,
.tiddler-leave-active {
  transition: all 0.5s ease;
}
</style>
