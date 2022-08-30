export interface MarkTiddler {
  id?: string;
  name: string;
  frontmatter?: { title?: string } & Record<string, unknown>;
  content: string;
  html?: string;
  ssr: boolean;
}

declare global {
  interface Window {
    Prism: any;
    __tiddlers: MarkTiddler[];
  }
}
