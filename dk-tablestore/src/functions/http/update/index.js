const { http } = require('@serverless-devs/dk');
const tableStorePlugin = require('@serverless-devs/tablestore-initialzer-plugin');

const handler = http.onRequest({
  handler: async (request) => {
    const { tableClient, TableStore } = request.internal;
    const Long = TableStore.Long;
    var params = {
      tableName: 'user',
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
      primaryKey: [{ gid: Long.fromNumber(9) }, { uid: Long.fromNumber(90) }],
      updateOfAttributeColumns: [
        {
          PUT: [{ col4: Long.fromNumber(4) }, { col5: '5' }, { col6: Long.fromNumber(7) }],
        },
        { DELETE: [{ col1: Long.fromNumber(1496826473186) }] },
        { DELETE_ALL: ['col2'] },
      ],
      returnContent: { returnType: TableStore.ReturnType.Primarykey },
    };
    const data = await tableClient.updateRow(params);
    return {
      json: data,
    };
  },
});

handler.use(tableStorePlugin());

exports.initializer = handler.initializerHandler;

exports.handler = handler;
