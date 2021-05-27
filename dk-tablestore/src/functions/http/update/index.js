const { http, tablestoreInitialzerPlugin } = require('@serverless-devs/dk');

const handler = http.onRequest({
  handler: async (request) => {
    const { id, name, age } = request.req.body;
    if (!id || !name || !age) {
      return {
        body: '请检查id, name或者age字段是否填写完整',
      };
    }
    const { tableClient, TableStore } = request.internal;
    const Long = TableStore.Long;
    var params = {
      tableName: 'dk_user',
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
      primaryKey: [{ id: Long.fromNumber(id) }],
      updateOfAttributeColumns: [
        {
          PUT: [{ name }, { age }],
        },
      ],
      returnContent: { returnType: TableStore.ReturnType.Primarykey },
    };
    const data = await tableClient.updateRow(params);
    return {
      json: data,
    };
  },
});

handler.use(tablestoreInitialzerPlugin());

exports.initializer = handler.initializerHandler;

exports.handler = handler;
