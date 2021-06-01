const { dk } = require('@serverless-devs/dk');
const fs = require('fs-extra');

const handler = dk({
  '/index': {
    get: (request) => {
      return { html: fs.readFileSync('./index.html', 'utf8') };
    },
  },
});

exports.handler = handler;
