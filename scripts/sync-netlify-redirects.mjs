#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const rules = createRequire(import.meta.url)('../lib/permanent-redirects-data.cjs');
const tomlPath = join(root, 'netlify.toml');
const toml = readFileSync(tomlPath, 'utf8');

const BEGIN = '# BEGIN PERMANENT_REDIRECTS';
const END = '# END PERMANENT_REDIRECTS';

function blockFor(rule) {
  return `[[redirects]]
  from = ${JSON.stringify(rule.source)}
  to = ${JSON.stringify(rule.destination)}
  status = 301
  force = true
`;
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
