import { createApp } from 'vue';
import 'github-markdown-css';
import './prism.css';
import './style.css';
import App from './app.vue';
import { loadFavicon } from './util/favicon';

const app = createApp(App);
app.mount(document.body);
loadFavicon();
