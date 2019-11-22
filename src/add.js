const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');

const LOG = true;
const FILENAME = '__taskier.md';

const inquirer = require('inquirer');

function readTemplate({ params }) {
  const data = readFileSync('template.md').toString();
  return { data, params };
}

function readParams() {
  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Task ID:',
      },
      {
        type: 'input',
        name: 'title',
        message: 'Title:',
      },
      {
        type: 'editor',
        name: 'description',
        message: 'Some brief description:',
      },
    ])
    .then(params => ({ data: null, params }));
}

function log(data) {
  if (LOG) console.log(data);
  return data;
}

function saveNewFileToDisk({ data, params }) {
  writeFileSync(`./${FILENAME}`, data);
  return { data, params };
}

function commitFile(props) {
  execSync('git add __taskier.md');
  execSync('git commit -m "docs: add __taskier.md"');
  return props;
}

function replacePlaceholders({ data: rawData, params }) {
  function replaceTitle(data) {
    return data;
  }

  function replaceDescription(data) {
    return data;
  }

  const data = [replaceTitle, replaceDescription].reduce((acc, fn) => fn(acc), rawData);
  return { data, params };
}

function add() {
  return new Promise(() => {
    readParams()
      .then(readTemplate)
      .then(replacePlaceholders)
      .then(saveNewFileToDisk)
      .then(commitFile)
      .then(log);
  });
}

module.exports = add;
