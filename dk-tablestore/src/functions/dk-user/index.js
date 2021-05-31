const { http, tablestoreInitialzerPlugin } = require('@serverless-devs/dk');

const handler = http.onRequest({
  handler: async (request) => {
    const { tableClient } = request.internal;
    // 1.查询表
    const { tableNames } = await tableClient.listTable();
    if (tableNames.includes('dk_user')) {
      return {
        body: `dk_user表已创建存在`,
      };
    }
    // dk_user 不存在则创建
    const params = {
      tableMeta: {
        tableName: 'dk_user',
        primaryKey: [
          {
            name: 'id',
            type: 'INTEGER',
          },
        ],
      },
      reservedThroughput: {
        capacityUnit: {
          read: 0,
          write: 0,
        },
      },
      tableOptions: {
        timeToLive: -1, // 数据的过期时间, 单位秒, -1代表永不过期. 假如设置过期时间为一年, 即为 365 * 24 * 3600.
        maxVersions: 1, // 保存的最大版本数, 设置为1即代表每列上最多保存一个版本(保存最新的版本).
      },
      streamSpecification: {
        enableStream: true, //开启Stream
        expirationTime: 24, //Stream的过期时间，单位是小时，最长为168，设置完以后不能修改
      },
    };
    const data = await tableClient.createTable(params);
    return {
      body: 'dk_user表已创建成功',
    };
  },
});

handler.use(tablestoreInitialzerPlugin());

exports.initializer = handler.initializerHandler;

exports.handler = handler;
