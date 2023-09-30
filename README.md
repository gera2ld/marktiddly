# MarkTiddly

Render Markdown files as a single static page.

You can take notes in Markdown files and publish them as a single HTML file so you can access them from anywhere.

## Features

- Single HTML page
  - Easy to deploy
  - Portable
- Password protection (OpenPGP)
- Data compression (Pako)

## Demos

- https://gera2ld.github.io/marktiddly/ - without encryption
- https://gera2ld.github.io/marktiddly/encrypted - with data protected by a password

## Usage

Basic usage:

```base
$ npx marktiddly generate --cwd my-docs -o output.html
$ open output.html
```

Protect data with a password:

```bash
$ npx marktiddly generate \
  --cwd my-docs \
  -o output.html \
  --pgp 'My Password' \
  --pgp-hint 'Ask Mom for the password' \
  --glob 'public/*.md'
$ open output.html
```

You can also try the demo in this repository with the command below:

```bash
$ npx marktiddly serve --cwd demo --default-open marktiddly
# Then visit http://localhost:4000
```
