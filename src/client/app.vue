<template>
  <div class="mx-auto max-w-screen-xl h-screen relative">
    <div
      class="md:hidden fixed inset-0 bg-gray-500 opacity-50 z-10"
      v-if="refSide"
      @click="refSide = false"
    ></div>
    <SideBar
      class="translate-x-[-100%] md:translate-x-0 z-10 transition-transform ease-in duration-300"
      :class="{ 'translate-x-0': refSide }"
      @open="refSide = false"
    />
    <main class="md:ml-64 p-4">
      <div class="relative min-h-[90vh] z-0">
        <TransitionGroup name="tiddler">
          <Tiddler
            v-if="activeTiddler"
            :key="activeTiddler.name"
            :tiddler="activeTiddler"
            @link="handleLink"
          >
            <template #before>
              <div
                class="md:hidden mr-2 w-4 h-4 cursor-pointer fill-current"
                @click="refSide = true"
              >
                <svg viewBox="0 0 16 16" class="w-full h-full">
                  <path d="M2 2v2h12v-2zM2 7v2h12v-2zM2 12v2h12v-2z" />
                </svg>
              </div>
            </template>
          </Tiddler>
        </TransitionGroup>
      </div>
      <Footer />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { activeTiddler, loadTiddlers, checkUrl } from './util';
import Tiddler from './tiddler.vue';
import SideBar from './side-bar.vue';
import Footer from './footer.vue';

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
