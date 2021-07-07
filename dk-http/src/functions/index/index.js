const { dk } = require('@serverless-devs/dk');

const baseHandler = (ctx) => {
  // ctx 包含 ctx.req 可获取入参信息
  return {
    json: { title: 'hello serverless dk' },
  };
};

const handler = dk(baseHandler);

exports.handler = handler;
