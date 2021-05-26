const { http } = require('@serverless-devs/dk');
const tableStorePlugin = require('@serverless-devs/tablestore-initialzer-plugin');

const handler = http.onRequest({
  handler: async (request) => {
    const tableClient = request.internal.tableClient;
    const res = await tableClient.listTable();
    console.log('res', res);
    return {
      json: { result: 'ok' },
    };
  },
});

handler.use(tableStorePlugin());

exports.initializer = handler.initializerHandler;

exports.handler = handler;
