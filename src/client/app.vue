<template>
  <div class="mx-auto max-w-screen-xl h-screen relative">
    <PasswordForm v-if="store.password" @submit="handlePassword" />
    <template v-else>
      <SideBar :show="refSide" @close="refSide = false" />
      <MainArea @toggle-side="refSide = !refSide" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { loadTiddlers, PasswordError, PWD_KEY, store } from './util';
import SideBar from './side-bar.vue';
import MainArea from './main-area.vue';
import PasswordForm from './password-form.vue';

const refSide = ref(false);
loadTiddlers();

function handlePassword(password: string) {
  sessionStorage.setItem(PWD_KEY, password);
  store.password.message = '';
  loadTiddlers();
}
</script>
