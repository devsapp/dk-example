const { dk } = require('@serverless-devs/dk');
const fs = require('fs-extra');
const path = require('path');

const handler = dk(() => {
  const filePath = path.resolve(__dirname, './index.html');
  return { html: fs.readFileSync(filePath, 'utf8') };
});

exports.handler = handler;
