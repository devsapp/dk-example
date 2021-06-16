const { dk, tablestoreInitialzerPlugin } = require('@serverless-devs/dk');

const baseHandler = {
  '/info': {
    get: async (ctx) => {
      const { tableName } = ctx.req.queries;
      const { tableClient, TableStore } = ctx.internal;
      const params = {
        tableName,
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
    post: async (ctx) => {
      const { name, age, tableName } = ctx.req.body;
      const { tableClient, TableStore } = ctx.internal;
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
      return {
        json: {
          data: { name, age },
          message: '数据创建成功',
        },
      };
    },
    put: async (ctx) => {
      const { id, name, age, tableName } = ctx.req.body;
      const { tableClient, TableStore } = ctx.internal;
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
      return {
        json: {
          data: { id, name, age },
          message: '数据更成功',
        },
      };
    },
    delete: async (ctx) => {
      const { id, tableName } = ctx.req.queries;
      const { tableClient, TableStore } = ctx.internal;
      const Long = TableStore.Long;
      var params = {
        tableName,
        condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
        primaryKey: [{ id: Long.fromNumber(id) }],
      };
      await tableClient.deleteRow(params);
      return {
        json: {
          id,
          message: '数据删除成功',
        },
      };
    },
  },
};

const handler = dk(baseHandler);

handler.use(tablestoreInitialzerPlugin());

exports.handler = handler;
