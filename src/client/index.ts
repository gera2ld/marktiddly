import { createApp } from 'vue';
import 'github-markdown-css';
import './prism.css';
import { install, injectGlobal } from '@twind/core';
import presetAutoprefix from '@twind/preset-autoprefix';
import presetTailwind from '@twind/preset-tailwind';
import App from './app.vue';

install({
  presets: [presetAutoprefix(), presetTailwind()],
});

injectGlobal`
body {
  @apply bg(white dark:gray-800) text-gray(800 dark:300);
}
a {
  @apply text-blue(400 hover:600);
}
ul {
  @apply list-disc;
}
.markdown-body a.non-existent {
  @apply text-red-400 cursor-not-allowed;
}
.markdown-body a[target=_blank] {
  @apply underline;
}
`;

const app = createApp(App);
app.mount(document.body);
