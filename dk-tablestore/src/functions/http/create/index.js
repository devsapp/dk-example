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
    const params = {
      tableName: 'dk_user',
      //不管此行是否已经存在，都会插入新数据，如果之前有会被覆盖。condition的详细使用说明，请参考conditionUpdateRow.js
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
      primaryKey: [{ id: Long.fromNumber(id) }],
      attributeColumns: [{ name }, { age: Long.fromNumber(age) }],
      returnContent: { returnType: TableStore.ReturnType.Primarykey },
    };
    await tableClient.putRow(params);
    return {
      json: {
        data: { id, name, age },
        message: '数据创建成功',
      },
    };
  },
});

handler.use(tablestoreInitialzerPlugin());

exports.initializer = handler.initializerHandler;

exports.handler = handler;
