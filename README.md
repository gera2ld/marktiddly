# MarkTiddly

Render Markdown files as tiddlers in [TiddlyWiki](https://tiddlywiki.com/) and visit them in a Zettelkasten way.

## Why?

Because writing in Markdown is comfortable. TiddlyWiki is good at managing my notes but it doesn't have a good enough editor for writing Markdown.

So I created this tool to enjoy them both. I write Markdown with [Zettlr](https://github.com/Zettlr/Zettlr) and publish them as a single HTML TiddlyWiki flavor website.

## Usage

```base
$ npx marktiddly generate --cwd my-docs -o output.html
$ open output.html
```

You can also try the demo in this repository with the command below:

```bash
$ npx marktiddly serve --cwd demo --default-open marktiddly
# Then visit http://localhost:4000
```
