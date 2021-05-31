const { http, tablestoreInitialzerPlugin } = require('@serverless-devs/dk');

const handler = http.onRequest({
  handler: async (request) => {
    const { tableClient, TableStore } = request.internal;
    const params = {
      tableName: 'dk_user',
      direction: TableStore.Direction.FORWARD,
      maxVersions: 10,
      inclusiveStartPrimaryKey: [{ id: TableStore.INF_MIN }],
      exclusiveEndPrimaryKey: [{ id: TableStore.INF_MAX }],
      limit: 2,
    };
    let resultRows = [];
    const getRange = async function () {
      const data = await tableClient.getRange(params);
      resultRows = resultRows.concat(data.rows);
      //如果data.next_start_primary_key不为空，说明需要继续读取
      if (data.nextStartPrimaryKey) {
        params.inclusiveStartPrimaryKey = [{ id: data.nextStartPrimaryKey[0].value }];
        await getRange();
      }
    };
    await getRange();
    return {
      json: resultRows,
    };
  },
});

handler.use(tablestoreInitialzerPlugin());

exports.initializer = handler.initializerHandler;

exports.handler = handler;
