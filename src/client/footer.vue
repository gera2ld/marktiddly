<template>
  <footer class="py-4 text-center">
    Powered by
    <a href="https://github.com/gera2ld/marktiddly" rel="noopener noreferrer">
      MarkTiddly v{{ marktiddlyVersion }}
    </a>
    ❤️
  </footer>
</template>

<script lang="ts" setup>
const marktiddlyVersion = __VERSIONS__.marktiddly;
</script>
