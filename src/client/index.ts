import { createApp } from 'vue';
import 'github-markdown-css';
import './prism.css';
import { setup, apply } from 'twind/shim';
import * as colors from 'twind/colors';
import App from './app.vue';

setup({
  theme: {
    extend: {
      colors,
    },
  },
  preflight: (preflight) => ({
    ...preflight,
    body: apply`bg(white dark:gray-800) text-gray(800 dark:300)`,
    a: apply`text-blue(400 hover:600)`,
    ul: apply`list-disc`,
    '.markdown-body a.non-existent': apply`text-red-400 cursor-not-allowed`,
    '.markdown-body a[target=_blank]': apply`underline`,
  }),
});

const app = createApp(App);
app.mount(document.body);
