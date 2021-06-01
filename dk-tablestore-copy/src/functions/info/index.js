const { http, tablestoreInitialzerPlugin } = require('@serverless-devs/dk');

const handler = http.onRequest({
  handler: {
    '/info': {
      get: (request) => {
        return { body: 'hello world, get' };
      },
      post: (request) => {
        return { body: 'hello world, post' };
      },
      put: (request) => {
        return { body: 'hello world, put' };
      },
      delete: (request) => {
        return { body: 'hello world, delete' };
      },
    },
  },
});

handler.use(tablestoreInitialzerPlugin());

exports.initializer = handler.initializerHandler;

exports.handler = handler;
