export type MarkTiddlerFrontmatter = {
  id?: string;
  title: string;
} & Record<string, string>;

export interface MarkTiddler {
  name: string;
  path: string;
  frontmatter: MarkTiddlerFrontmatter;
  content?: string;
  html?: string;
  links?: string[];
}

export enum MarkTiddlyPathType {
  Path = 'p',
  Ref = 'r',
}

export interface MarkTiddlyPath {
  type: MarkTiddlyPathType;
  path: string;
}

export interface MarkTiddlyData {
  title?: string;
  tiddlers?: MarkTiddler[];
  activePath?: MarkTiddlyPath;
  ssr?: boolean;
}
