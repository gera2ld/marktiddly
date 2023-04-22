import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import { program } from 'commander';
import { generate } from './generate';
import { serve } from './server';

program
  .name('marktiddly')
  .description('Render Markdown files as tiddlers')
  .version('process.env.VERSION');

program
  .command('generate')
  .description('Generate a static HTML with everything')
  .option('--cwd <path>', 'Specify a current working directory', '.')
  .option('--no-ssr', 'Disable server side Markdown rendering')
  .option('--use-cdn', 'Whether to load client.js from CDN')
  .option('--no-pako', 'Do not compress data with pako')
  .option('--pgp <password>', 'Encrypt data with a password')
  .option('--title <title>', 'Set title of this static site', 'MarkTiddly')
  .option(
    '--default-open <name>',
    'The basenames of Markdown files that should be open on page load, note that `.md` must be omitted'
  )
  .option(
    '-o, --output <path>',
    'Write the output into a file instead of stdout'
  )
  .action(async (options) => {
    options.cwd = resolve(options.cwd || '.');
    const html = await generate(options);
    if (options.output) {
      await writeFile(options.output, html, 'utf8');
    } else {
      process.stdout.write(html);
      process.stdout.write('\n');
    }
  });

program
  .command('serve')
  .description('Serve the tiddlers as a website')
  .option('--cwd <path>', 'Specify a current working directory', '.')
  .option('--no-ssr', 'Disable server side Markdown rendering')
  .option('--title <title>', 'Set title of this static site', 'MarkTiddly')
  .option(
    '--default-open <name>',
    'The basenames of Markdown files that should be open on page load, note that `.md` must be omitted'
  )
  .option('-p, --port <port>', 'The port to listen', '4000')
  .action((options) => {
    serve(options);
  });

program.parse();
