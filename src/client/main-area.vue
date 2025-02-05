<template>
  <main>
    <Header />
    <div>
      <div class="markdown-body bg-transparent">
        <TransitionGroup name="tiddler">
          <Tiddler
            v-if="activeTiddler"
            :key="activeTiddler.name"
            :tiddler="activeTiddler"
            @link="handleLink"
          />
        </TransitionGroup>
      </div>
      <div
        v-if="!activeTiddler"
        class="opacity-20 w-24 h-24 mx-auto mt-[30vh] bg-contain bg-no-repeat"
        :style="`background-image: url(${store.favicon})`"
      ></div>
    </div>
    <Footer />
  </main>
</template>

<script lang="ts" setup>
import { activeTiddler, checkUrl, store } from './util';
import Tiddler from './tiddler.vue';
import Header from './header.vue';
import Footer from './footer.vue';

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
