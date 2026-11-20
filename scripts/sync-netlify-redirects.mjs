#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { PERMANENT_REDIRECTS: rules } = await import('../lib/permanent-redirects-data.js');
const tomlPath = join(root, 'netlify.toml');
const toml = readFileSync(tomlPath, 'utf8');

const BEGIN = '# BEGIN PERMANENT_REDIRECTS';
const END = '# END PERMANENT_REDIRECTS';

function blockFor(rule) {
  const sources = rule.source.endsWith('/') ? [rule.source] : [rule.source, `${rule.source}/`];
  return sources
    .map(
      (from) => `[[redirects]]
  from = ${JSON.stringify(from)}
  to = ${JSON.stringify(rule.destination)}
  status = 301
  force = true
`
    )
    .join('\n');
}

const generated = `${BEGIN}
# Generated from lib/permanent-redirects.json — do not edit by hand.
# force = true so Netlify does not shadow these with existing Next pages.

${rules.map(blockFor).join('\n')}${END}`;

let next;
if (toml.includes(BEGIN) && toml.includes(END)) {
  next = toml.replace(new RegExp(`${BEGIN}[\\s\\S]*?${END}`), generated);
} else {
  const insertAt = toml.indexOf('\n[dev]');
  if (insertAt === -1) {
    next = `${toml.trimEnd()}\n\n${generated}\n`;
  } else {
    next = `${toml.slice(0, insertAt)}\n${generated}\n${toml.slice(insertAt)}`;
  }
}

writeFileSync(tomlPath, next);
console.log(`Wrote ${rules.length} permanent redirect sources to netlify.toml`);
