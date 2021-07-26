const { dk } = require('@serverless-devs/dk');
const fs = require('fs-extra');
const path = require('path');

const baseHandler = (ctx) => {
  const filePath = path.resolve(__dirname, './index.html');
  const html = fs.readFileSync(filePath, 'utf8');

  const { accountId, region, service } = ctx.context;
  const baseURL = `https://${accountId}.${region}.fc.aliyuncs.com/2016-08-15/proxy/${service.name}/list`;
  const newHtml = html.replace('base_url', baseURL);
  return { html: newHtml };
};

const handler = dk(baseHandler);

exports.handler = handler;
