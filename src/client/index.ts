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
  }),
});

const app = createApp(App);
app.mount(document.body);
