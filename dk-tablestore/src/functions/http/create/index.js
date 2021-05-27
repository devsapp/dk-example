const { http, tablestoreInitialzerPlugin } = require('@serverless-devs/dk');

const handler = http.onRequest({
  handler: async (request) => {
    console.log(request.req);
    const { tableClient, TableStore } = request.internal;
    const Long = TableStore.Long;
    const params = {
      tableName: 'dk_user',
      //不管此行是否已经存在，都会插入新数据，如果之前有会被覆盖。condition的详细使用说明，请参考conditionUpdateRow.js
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
      primaryKey: [{ id: Long.fromNumber(20013) }],
      attributeColumns: [
        { name: '小明' },
        //客户端可以自己指定版本号（时间戳）
        { age: Long.fromNumber(123456789) },
      ],
      returnContent: { returnType: TableStore.ReturnType.Primarykey },
    };
    const data = await tableClient.putRow(params);
    return {
      json: data,
    };
  },
});

handler.use(tablestoreInitialzerPlugin());

exports.initializer = handler.initializerHandler;

exports.handler = handler;
