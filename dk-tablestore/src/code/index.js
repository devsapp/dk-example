const { http } = require('@serverless-devs/dk');
const TableStore = require('tablestore');
const fs = require('fs-extra');
const path = require('path');

let internal;

http
  // 首页index
  .get("/", async (ctx, next) => {
    const filePath = path.resolve(__dirname, './static/index.html');
    const html = fs.readFileSync(filePath, 'utf8');
    ctx.body = html;
  })
  // 加载表详情页面
  .get("/info", async (ctx, next) => {
    const filePath = path.resolve(__dirname, './static/info.html');
    const html = fs.readFileSync(filePath, 'utf8');
    ctx.body = html;
  })
  // 获取表列表
  .get("/table", async (ctx) => {
    const { tableClient } = ctx.req.requestContext.internal;
    const data = await tableClient.listTable();
    ctx.body = data;
  })
  // 创建表
  .post("/table", async (ctx, next) => {
    const { tableName } = ctx.request.body;
    const { tableClient } = ctx.req.requestContext.internal;
    const params = {
      tableMeta: {
        tableName,
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
    await tableClient.createTable(params);
    ctx.body = {
      success: true,
      message: `${tableName}表已创建成功`,
    }
  })
  // 删除表
  .delete("/table/:tableName", async (ctx) => {
    const { tableName } = ctx.params;
    const { tableClient } = ctx.req.requestContext.internal;
    const params = {
      tableName,
    };
    await tableClient.deleteTable(params);
    ctx.body = {
      success: true,
      message: `${tableName}表已删除成功`,
    }
  })
  // 表管理：获取
  .get("/table/:tableName", async (ctx, next) => {
    const { tableName } = ctx.params;
    const { tableClient, TableStore } = ctx.req.requestContext.internal;
    const params = {
      tableName,
      direction: TableStore.Direction.FORWARD,
      maxVersions: 10,
      inclusiveStartPrimaryKey: [{ id: TableStore.INF_MIN }],
      exclusiveEndPrimaryKey: [{ id: TableStore.INF_MAX }],
      limit: 2,
    };
    let resultRows = [];
    const getRange = async function() {
      const data = await tableClient.getRange(params);
      resultRows = resultRows.concat(data.rows);
      //如果data.next_start_primary_key不为空，说明需要继续读取
      if (data.nextStartPrimaryKey) {
        params.inclusiveStartPrimaryKey = [{ id: data.nextStartPrimaryKey[0].value }];
        await getRange();
      }
    };
    await getRange();
    ctx.body = resultRows;
  })
  // 表管理：添加
  .post("/table/:tableName", async (ctx, next) => {
    const { tableName } = ctx.params;
    const { name, age } = ctx.request.body;
    const { tableClient, TableStore } = ctx.req.requestContext.internal;
    const Long = TableStore.Long;
    var currentTimeStamp = Date.now();
    const params = {
      tableName,
      //不管此行是否已经存在，都会插入新数据，如果之前有会被覆盖。condition的详细使用说明，请参考conditionUpdateRow.js
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
      primaryKey: [{ id: Long.fromNumber(currentTimeStamp) }],
      attributeColumns: [{ name }, { age: Long.fromNumber(age) }],
      returnContent: { returnType: TableStore.ReturnType.Primarykey },
    };
    await tableClient.putRow(params);
    ctx.body = { name, age }
  })
  // 表管理：修改
  .put("/table/:tableName", async (ctx, next) => {
    const { id, name, age, tableName } = ctx.request.body;
    const { tableClient, TableStore } = ctx.req.requestContext.internal;
    const Long = TableStore.Long;
    var params = {
      tableName,
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
      primaryKey: [{ id: Long.fromNumber(id) }],
      updateOfAttributeColumns: [
        {
          PUT: [{ name }, { age }],
        },
      ],
      returnContent: { returnType: TableStore.ReturnType.Primarykey },
    };
    await tableClient.updateRow(params);
    ctx.body = {
      data: { id, name, age },
      message: '数据更成功',
    }
  })
  // 表管理：删除
  .delete("/table/:tableName/:id", async (ctx) => {
    const { tableName, id } = ctx.params;
    const { tableClient, TableStore } = ctx.req.requestContext.internal;
    const Long = TableStore.Long;
    var params = {
      tableName,
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
      primaryKey: [{ id: Long.fromNumber(id) }],
    };
    await tableClient.deleteRow(params);
    ctx.body = {
      id,
      message: '数据删除成功',
    }
  })

http.app.use(http.routes());

exports.initializer = (context, callback) => {
  try {
    const endpoint = process.env.tablestore_endpoint;
    const instanceName = process.env.tablestore_instanceName;
    const tableClient = new TableStore.Client({
      accessKeyId: context.credentials.accessKeyId,
      accessKeySecret: context.credentials.accessKeySecret,
      stsToken: context.credentials.securityToken,
      endpoint,
      instancename: instanceName,
    });
    internal = { tableClient, TableStore };
    callback();
  } catch (err) {
    callback(err.message);
  }
}

exports.handler = (req, res, context) => {
  context.internal = internal;
  http()(req, res, context);
};