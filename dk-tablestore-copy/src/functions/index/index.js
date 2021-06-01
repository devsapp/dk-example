const { dk } = require('@serverless-devs/dk');
const fs = require('fs-extra');

// TODO: /index/*

const handler = dk({
  'get /index': (request) => {
    return { html: fs.readFileSync('./index.html', 'utf8') };
  },
  'get /index/:tableName': (request) => {
    return { html: fs.readFileSync('./info.html', 'utf8') };
  },
});

exports.handler = handler;
