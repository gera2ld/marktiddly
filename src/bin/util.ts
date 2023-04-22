import { createMessage, encrypt } from 'openpgp';
import pako from 'pako';

export async function encryptMessage(binary: Uint8Array, passwords: string[]) {
  const message = await createMessage({ binary });
  const result = await encrypt({
    message,
    passwords,
    format: 'binary',
  });
  return result as Uint8Array;
}

export async function packData(
  input: string,
  options?: {
    pako?: boolean;
    pgp?: string;
  }
) {
  options = {
    pako: true,
    ...options,
  };
  const meta: string[] = [];
  let data = new TextEncoder().encode(input);
  if (options.pako) {
    meta.push('pako');
    data = pako.deflate(data);
  }
  if (options.pgp) {
    meta.push('pgp');
    data = await encryptMessage(data, [options.pgp]);
  }
  const output = Buffer.from(data).toString('base64');
  return { meta: meta.reverse().join(':'), data: output };
}
