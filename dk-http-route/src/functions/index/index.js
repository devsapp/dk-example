const { dk } = require('@serverless-devs/dk');

const baseHandler = {
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
};

const handler = dk(baseHandler);

exports.handler = handler;
