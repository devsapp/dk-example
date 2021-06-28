const { dk } = require('@serverless-devs/dk');

const handler = dk((ctx) => {
  console.log(ctx);
  return {
    body: 'hello world',
  };
});

exports.handler = handler;
