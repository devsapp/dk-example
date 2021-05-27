const { http, tablestoreInitialzerPlugin } = require('@serverless-devs/dk');

const handler = http.onRequest({
  handler: async (request) => {
    const { tableClient, TableStore } = request.internal;
    const Long = TableStore.Long;
    //公用参数
    var params = {
      tableName: 'dk_user',
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

handler.use(tablestoreInitialzerPlugin());

exports.initializer = handler.initializerHandler;

exports.handler = handler;
