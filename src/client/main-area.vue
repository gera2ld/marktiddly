<template>
  <main class="md:ml-64 md:p-4">
    <div
      class="md:hidden flex items-center h-12 px-4 sticky top-0 z-10 bg-white dark:bg-gray-800"
      @click="emit('toggleSide')"
    >
      <svg viewBox="0 0 16 16" class="mr-2 w-4 h-4 cursor-pointer fill-current">
        <path d="M2 2v2h12v-2zM2 7v2h12v-2zM2 12v2h12v-2z" />
      </svg>
      <span class="ml-2 text-orange-400" v-text="store.title"></span>
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

const emit = defineEmits<{
  (event: 'toggleSide'): void;
}>();

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
