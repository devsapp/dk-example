const { dk } = require('@serverless-devs/dk');

const handler = dk({
  handler: {
    '/user': {
      GET: (request) => ({ body: JSON.stringify(request.req) }),
      POST: (request) => ({ body: JSON.stringify(request.req) }),
    },
    '/user/:id': {
      GET: (request) => ({ body: JSON.stringify(request.req) }),
      POST: (request) => ({ body: JSON.stringify(request.req) }),
    },
    'GET /getUser': (request) => ({ body: JSON.stringify(request.req) }),
    'POST /getUser': (request) => ({ body: JSON.stringify(request.req) }),
    'GET /getUser/:id': (request) => ({ body: JSON.stringify(request.req) }),
    'POST /getUser/:id': (request) => ({ body: JSON.stringify(request.req) }),
  },
});

exports.handler = handler;
