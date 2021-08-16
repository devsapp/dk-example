const { github } = require('@serverless-devs/dk');
const github_secret = process.env.github_secret;

const handler = github({
  handler: (ctx) => {
    return { json: ctx.req.github }
  },
  config: { path: '/', secret: github_secret }
});

exports.handler = handler;
