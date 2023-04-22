<template>
  <form
    @submit.prevent="handleSubmit"
    class="max-w-sm mt-12 mx-auto p-4 text-center border border-gray-300 dark:border-gray-700"
  >
    <div class="mb-4 text-lg font-bold" v-text="hint"></div>
    <input type="password" class="mb-4" v-model="password" />
    <div class="flex text-left">
      <div
        class="flex-1 mr-4 text-red-500"
        v-text="store.password?.error"
      ></div>
      <button type="submit">OK</button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { store } from './util';

const emit = defineEmits<{
  (event: 'submit', payload: string): void;
}>();

const password = ref('');
const hint = computed(() => store.password?.hint || 'Input password:');

function handleSubmit() {
  if (!password.value) return;
  emit('submit', password.value);
}
</script>
