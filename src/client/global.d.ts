declare global {
  interface Window {
    Prism: any;
    marktiddly?: {
      title?: string;
      passwordHint?: string;
      meta?: string;
      data: any;
    };
  }
}
