import { createApp } from 'vue';
import 'github-markdown-css';
import './prism.css';
import { setup, apply } from 'twind/shim';
import * as colors from 'twind/colors';
import App from './app.vue';
import { loadTiddlers, openTiddler } from './util';
import { store } from './store';

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

loadTiddlers().then((tiddlers) => {
  store.tiddlers = new Map(tiddlers.map((file) => [file.path, file]));
  handleHash();
});
window.addEventListener('hashchange', handleHash);

function handleHash() {
  const name = window.location.hash.slice(1);
  const tiddler = store.tiddlers.get(name);
  if (tiddler) openTiddler(tiddler);
}
