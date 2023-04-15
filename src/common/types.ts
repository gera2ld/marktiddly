export type MarkTiddlerFrontmatter = {
  id?: string;
  title?: string;
  tags?: string[];
} & Record<string, string>;

export interface MarkTiddler {
  name: string;
  path: string;
  frontmatter?: MarkTiddlerFrontmatter;
  content: string;
  html?: string;
  ssr: boolean;
}
