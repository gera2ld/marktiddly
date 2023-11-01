import { createApp } from 'vue';
import 'github-markdown-css';
import '@unocss/reset/tailwind.css';
import './style.css';
import App from './app.vue';
import { loadFavicon } from './util/favicon';
import './keyboard';

const app = createApp(App);
app.mount(document.body);
loadFavicon();
