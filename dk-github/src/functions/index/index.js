const { github } = require('@serverless-devs/dk');
const github_secret = process.env.github_secret;

const handler = github({
  handler: (ctx) => {
    // 逻辑处理
  },
  config: { secret: github_secret }
});

exports.handler = handler;
