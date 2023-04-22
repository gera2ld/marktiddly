export async function requestJson<T>(url: string) {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw { status: res.status, data };
  return data as T;
}

export function getTiddlerNameByUrl(search = window.location.search) {
  const query = new URLSearchParams(search);
  const p = query.get('p');
  return p;
}

export function fuzzySearch(keyword: string, data: string) {
  const result: number[] = [];
  let j = 0;
  for (
    let i = 0;
    i < keyword.length && keyword.length - i <= data.length - j;
    i += 1
  ) {
    j = data.indexOf(keyword[i], j);
    if (j < 0) break;
    result.push(j);
    j += 1;
  }
  return result.length === keyword.length ? result : undefined;
}

export async function binb64(binary: Uint8Array) {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(new Blob([binary]));
  });
  const i = dataUrl.indexOf(',');
  return dataUrl.slice(i + 1);
}

export async function b64bin(base64: string) {
  const res = await fetch('data:;base64,' + base64);
  const buffer = await res.arrayBuffer();
  return new Uint8Array(buffer);
}

export async function decryptMessage(
  binaryMessage: Uint8Array,
  passwords: string[]
): Promise<Uint8Array> {
  const { decrypt, readMessage } = await import(
    'https://cdn.jsdelivr.net/npm/openpgp@5.8.0/+esm'
  );
  const message = await readMessage({ binaryMessage });
  const { data } = await decrypt({ message, passwords, format: 'binary' });
  return data;
}

export async function pakoInflate(input: Uint8Array) {
  const pako = await import('https://cdn.jsdelivr.net/npm/pako@2.1.0/+esm');
  const output = await pako.inflate(input);
  return output;
}
