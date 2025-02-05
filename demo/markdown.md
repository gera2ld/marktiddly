---
title: Markdown
---

Markdown is a lightweight markup language for creating formatted text using a plain-text editor.

Markdown is widely used in blogging, instant messaging, online forums, collaborative software, documentation pages, and readme files.

If you don't know about it, go through [this website](https://www.markdownguide.org/) to learn about Markdown.

History of Markdown can be found at <https://en.wikipedia.org/wiki/Markdown>.

Let's have a look at the syntax of Markdown.

## Headings

```md
# Heading 1

## Heading 2

### Heading 3.1

### Heading 3.2
```

See also [[markdown.headings]].

## Lists

```md
Bullet lists nested within numbered list:

1. fruits
   - apple
   - banana
2. vegetables
   - carrot
   - broccoli
```

And this is the corresponding HTML for rendering:

```html
<p>Bullet lists nested within numbered list:</p>

<ol>
  <li>
    fruits
    <ul>
      <li>apple</li>
      <li>banana</li>
    </ul>
  </li>
  <li>
    vegetables
    <ul>
      <li>carrot</li>
      <li>broccoli</li>
    </ul>
  </li>
</ol>
```

## Code Blocks

````md
```py
print('hello, world')
```
````
