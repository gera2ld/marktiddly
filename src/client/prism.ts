const prefix = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0';

async function initialize() {
  await import(`${prefix}/components/prism-core.min.js`);
  await import(`${prefix}/plugins/autoloader/prism-autoloader.min.js`);
  Prism.plugins.autoloader.languages_path = `${prefix}/components/`;
  return Prism;
}

let loading: Promise<any>;

export function loadPrism() {
  loading ||= initialize();
  return loading;
}

export async function highlight(el: HTMLElement) {
  const Prism = await loadPrism();
  Prism.highlightAllUnder(el);
}
