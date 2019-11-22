const { execSync } = require('child_process');
const { existsSync } = require('fs');

const { FILENAME } = require('./constants');

function hasFileToRemove() {
  return existsSync(`./${FILENAME}`);
}

function remove() {
  return new Promise(resolve => {
    if (!hasFileToRemove()) {
      console.log(`No ${FILENAME} file found`);
      return resolve();
    }

    execSync(`rm -f ./${FILENAME}`);
    execSync(`git add ${FILENAME}`);
    execSync(`git commit -m "docs: remove ${FILENAME}"`);
    console.log(`${FILENAME} was removed successfully!`);
    resolve();
  });
}

module.exports = remove;
