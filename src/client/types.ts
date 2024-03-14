import hljs from 'highlight.js';

declare global {
  interface Window {
    hljs: typeof hljs;
    marktiddly?: {
      title?: string;
      passwordHint?: string;
      contentType?: string;
      data: unknown;
    };
  }
}
