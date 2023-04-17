<template>
  <div class="mx-auto max-w-screen-xl h-screen relative">
    <div
      class="md:hidden fixed inset-0 bg-gray-500 opacity-50 z-10"
      v-if="refSide"
      @click="refSide = false"
    ></div>
    <SideBar :show="refSide" @open="refSide = false" />
    <main class="md:ml-64 md:p-4">
      <div
        class="md:hidden flex items-center h-12 px-4 sticky top-0 z-10 bg-white dark:bg-gray-800"
        @click="refSide = !refSide"
      >
        <svg
          viewBox="0 0 16 16"
          class="mr-2 w-4 h-4 cursor-pointer fill-current"
        >
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
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { activeTiddler, loadTiddlers, checkUrl, store } from './util';
import Tiddler from './tiddler.vue';
import SideBar from './side-bar.vue';

const refSide = ref(false);
loadTiddlers();

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
