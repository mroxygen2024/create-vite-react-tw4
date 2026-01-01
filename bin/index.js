#!/usr/bin/env node

// const { main } = require('../src/main');
import main from '../src/main.js';

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
