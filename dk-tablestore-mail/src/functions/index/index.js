const { dk } = require('@serverless-devs/dk');
const fs = require('fs-extra');

const handler = dk({
  'get /index': (request) => {
    const tablestore_tableName = process.env.tablestore_tableName;
    const html = fs.readFileSync('./index.html', 'utf8');

    // todo 后期可优化
    let newHtml = html.replace('process.env.tablestore_tableName', tablestore_tableName);
    const { accountId, region, service } = request.context;
    const baseURL = `https://${accountId}.${region}.fc.aliyuncs.com/2016-08-15/proxy/${service.name}`;
    newHtml = html.replace('base_url', baseURL);

    return { html: newHtml };
  },
});

exports.handler = handler;
