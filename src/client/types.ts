export interface MarkTiddler {
  path: string;
  content: string;
  html?: string;
  ssr: boolean;
}

declare global {
  const Prism: any;
}
