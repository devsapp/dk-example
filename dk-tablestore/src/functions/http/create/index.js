const { http } = require('@serverless-devs/dk');
const tableStorePlugin = require('@serverless-devs/tablestore-initialzer-plugin');

const handler = http.onRequest({
  handler: async (request) => {
    const { tableClient, TableStore } = request.internal;
    const currentTimeStamp = Date.now();
    const Long = TableStore.Long;
    const params = {
      tableName: 'user',
      //不管此行是否已经存在，都会插入新数据，如果之前有会被覆盖。condition的详细使用说明，请参考conditionUpdateRow.js
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
      primaryKey: [{ gid: Long.fromNumber(20013) }, { uid: Long.fromNumber(20013) }],
      attributeColumns: [
        { col1: '表格存储' },
        //客户端可以自己指定版本号（时间戳）
        { col2: '2', timestamp: currentTimeStamp },
        { col3: 'name' },
        { col4: -0.32 },
        { col5: Long.fromNumber(123456789) },
      ],
      returnContent: { returnType: TableStore.ReturnType.Primarykey },
    };
    const data = await tableClient.putRow(params);
    return {
      json: data,
    };
  },
});

handler.use(tableStorePlugin());

exports.initializer = handler.initializerHandler;

exports.handler = handler;
