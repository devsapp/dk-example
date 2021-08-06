const { dk, githubHandler } = require('@serverless-devs/dk');
const github_path = process.env.github_path;
const github_secret = process.env.github_secret;

const github = githubHandler({ path: github_path, secret: github_secret });

github.onEvent(data => console.log(data));

const baseHandler = (ctx) => {
  const data = github(ctx.req);
  return {
    json: data
  };
};

const handler = dk(baseHandler);

exports.handler = handler;
