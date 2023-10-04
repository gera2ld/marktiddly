export function b64decode(base64: string) {
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0));
}

export function b64decodeText(base64: string) {
  const bytes = b64decode(base64);
  return new TextDecoder().decode(bytes);
}

export function b64encode(bytes: Uint8Array) {
  const binString = Array.from(bytes, (x) => String.fromCodePoint(x)).join('');
  return btoa(binString);
}

export function b64encodeText(text: string) {
  const bytes = new TextEncoder().encode(text);
  return b64encode(bytes);
}
