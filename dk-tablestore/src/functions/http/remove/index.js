const { http, tablestoreInitialzerPlugin } = require('@serverless-devs/dk');

const handler = http.onRequest({
  handler: async (request) => {
    const { tableClient, TableStore } = request.internal;
    const Long = TableStore.Long;
    var params = {
      tableName: 'dk_user',
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
      primaryKey: [{ gid: Long.fromNumber(20013) }, { uid: Long.fromNumber(20013) }],
    };
    const data = await tableClient.deleteRow(params);
    return {
      json: data,
    };
  },
});

handler.use(tablestoreInitialzerPlugin());

exports.initializer = handler.initializerHandler;

exports.handler = handler;
