#!/usr/bin/env node

import assert from 'node:assert';
import linguist from 'linguist-js';

assert(process.versions.bun === undefined);

let start = Date.now();
const { files } = await linguist('./node_modules');

let duration = Date.now() - start;
let formatter = Intl.NumberFormat();
console.log(`${files.count} files found in ${formatter.format(duration)}ms`);