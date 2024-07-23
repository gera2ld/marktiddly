import { once } from 'es-toolkit';
import { store } from './store';

/**
 * Once inlined, favicon can only be fetched from the base64 encoded `manifest`.
 */
export const loadFavicon = once(async () => {
  const manifest =
    document.querySelector<HTMLLinkElement>('link[rel=manifest]');
  if (!manifest) return;
  const { href } = manifest;
  const res = await fetch(href);
  const data = await res.json();
  const icon = data.icons[0].src;
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = icon;
  document.head.append(link);
  store.favicon = icon;
});
