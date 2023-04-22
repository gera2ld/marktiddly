---
title: MarkTiddly
---

Welcome to MarkTiddly! It is heavily inspired by [[TiddlyWiki]].

It renders your [[Markdown]] files into a single page application which has just a single HTML file. It can be easily deployed to your server or through <https://www.drv.tw>.

Markdown files (or tiddlers) can be easily linked to each other with relative paths or wiki links. Meanwhile non-existent links can be easily distinguished like [[this]].

Check https://gera2ld.github.io/marktiddly/ for MarkTiddly without encryption.

Check https://gera2ld.github.io/marktiddly/encrypted for MarkTiddly with data protected by a password.

## Usage

```bash
$ npx marktiddly --cwd my-docs -o output.html
$ open output.html
```
