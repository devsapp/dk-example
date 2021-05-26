const { http } = require('@serverless-devs/dk');
const tableStorePlugin = require('@serverless-devs/tablestore-initialzer-plugin');

const handler = http.onRequest({
  handler: async (request) => {
    const { tableClient, TableStore } = request.internal;
    const Long = TableStore.Long;
    //公用参数
    var params = {
      tableName: 'user',
      primaryKey: [{ gid: Long.fromNumber(20013) }, { uid: Long.fromNumber(20013) }],
    };
    //设置读取最新版本，默认为1
    params.maxVersions = 1;
    //设置读取指定的列
    params.columnsToGet = ['col1', 'col2'];
    const data = await tableClient.getRow(params);
    return {
      json: data,
    };
  },
});

handler.use(tableStorePlugin());

exports.initializer = handler.initializerHandler;

exports.handler = handler;
