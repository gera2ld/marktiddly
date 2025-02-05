const noop = () => {};
let supportsPassive = false;
try {
  const opts = Object.defineProperty({}, 'passive', {
    get() {
      supportsPassive = true;
    },
  });
  window.addEventListener('scroll', noop, opts);
  window.removeEventListener('scroll', noop, opts);
} catch {
  // ignore
}
const options = supportsPassive ? { passive: true } : false;

export function onScroll(listener: (e: Event) => void) {
  window.addEventListener('scroll', listener, options);
  return () => window.removeEventListener('scroll', listener);
}
