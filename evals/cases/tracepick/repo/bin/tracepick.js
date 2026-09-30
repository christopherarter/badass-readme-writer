#!/usr/bin/env node
const readline = require('node:readline');

const args = process.argv.slice(2);
if (args.length !== 2 || args[0] !== '--level' || !args[1]) {
  console.error('Usage: node bin/tracepick.js --level LEVEL < logs.ndjson');
  process.exit(2);
}

const level = args[1];
const input = readline.createInterface({ input: process.stdin });
input.on('line', (line) => {
  try {
    if (JSON.parse(line).level === level) process.stdout.write(`${line}\n`);
  } catch {
    // Ignore malformed lines; the CLI is a small filter, not a validator.
  }
});
