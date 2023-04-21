export async function loadFavicon() {
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
}
