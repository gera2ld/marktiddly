export interface MarkTiddler {
  id?: string;
  name: string;
  frontmatter?: { title?: string } & Record<string, unknown>;
  content: string;
  html?: string;
  ssr: boolean;
}
