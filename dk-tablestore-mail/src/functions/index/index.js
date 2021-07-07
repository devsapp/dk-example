const { dk } = require('@serverless-devs/dk');
const fs = require('fs-extra');

const baseHander = {
  'GET /index': (request) => {
    const html = fs.readFileSync('./index.html', 'utf8');

    //  baseURL，tablestore_tableName
    const tablestore_tableName = process.env.tablestore_tableName;
    const { accountId, region, service } = request.context;
    const baseURL = `https://${accountId}.${region}.fc.aliyuncs.com/2016-08-15/proxy/${service.name}`;
    let newHtml = html.replace('process.env.tablestore_tableName', tablestore_tableName);
    newHtml = html.replace('base_url', baseURL);

    return { html: newHtml };
  },
};

const handler = dk(baseHander);

exports.handler = handler;
