const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const inquirer = require('inquirer');

const { FILENAME, LOG } = require('./constants');

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
  execSync(`git add ${FILENAME}`);
  execSync(`git commit -m "docs: add ${FILENAME}"`);
  return props;
}

function replacePlaceholders({ data: rawData, params }) {
  const { id, title } = params;

  function replaceTitle(data) {
    const combinedTitle = [id, title].filter(p => p.length).join(' - ');
    const _title = combinedTitle ? `## ${combinedTitle}\n` : '';
    return data.replace('[[## title]]', _title);
  }

  function replaceDescription(data) {
    const { description } = params;
    const _description = description ? `\n${description}` : '';
    return data.replace('[[description]]', _description);
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
      .then(log)
      .then(() => console.log('__taskier.md file was added successfully!'));
  });
}

module.exports = add;
