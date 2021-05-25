
const { http } = require('@serverless-devs/dk');

const handler = http.onRequest({
  handler: (request) => {
    console.log(request);
    return {
      json: { result: 'ok' },
    };
  },
});

exports.handler = handler;
