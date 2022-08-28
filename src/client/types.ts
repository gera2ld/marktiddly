export interface MarkTiddler {
  path: string;
  content: string;
  id?: string;
  html?: string;
  ssr: boolean;
}

declare global {
  const Prism: any;
}
