#!/usr/bin/env node

const add = require('./src/add');
const remove = require('./src/remove');

const [, , ...args] = process.argv;

const [command, ...params] = args;

function finish() {
  console.log('Your task was added!');
}

switch (command) {
  case 'add':
    return add(params);
  case 'remove':
    return remove();
  default:
    console.log(
      `
      Usage: taskier <command>
      
      -- commands --
      add
      remove
      `,
    );
}
