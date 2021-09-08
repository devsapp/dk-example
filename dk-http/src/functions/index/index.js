const { http } = require('@serverless-devs/dk');

http
  .get("/http", (ctx) => {
    ctx.body = 'Hello Http!';
  })
  .get("/", async (ctx, next) => {
    ctx.body = "Hello World!";
  })

http.app.use(http.routes());

exports.handler = http();