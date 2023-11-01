<template>
  <div class="mx-auto max-w-screen-xl h-screen relative">
    <PasswordForm v-if="store.password" @submit="handlePassword" />
    <template v-else>
      <SearchBox />
      <MainArea />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { loadTiddlers, PWD_KEY, store } from './util';
import SearchBox from './search-box.vue';
import MainArea from './main-area.vue';
import PasswordForm from './password-form.vue';

loadTiddlers();

function handlePassword(password: string) {
  if (!store.password) return;
  sessionStorage.setItem(PWD_KEY, password);
  store.password.error = '';
  loadTiddlers();
}
</script>
