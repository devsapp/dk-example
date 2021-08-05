const { scheduler } = require('@serverless-devs/dk');

const baseHandler = async (ctx) => {
  console.log(ctx.events.toString());
  // do your some code
};

const handler = scheduler.onScheduler({
  handler: baseHandler,
  scheduler: {
    cronExpression: '0 0 8 * * *',
    enable: true,
    payload: 'serverless dk',
  },
});

exports.handler = handler;
