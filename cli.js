#!/usr/bin/env node

const add = require('./src/add');

const [,, ...args] = process.argv;

const [command, ...params] = args;

function finish() {
  console.log('Your task was added!');
}


switch (command) {
  case 'add':
    add(params).then(finish)
}

