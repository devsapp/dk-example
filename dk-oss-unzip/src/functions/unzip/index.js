const { oss } = require('@serverless-devs/dk');
const alioss = require('ali-oss');
const path = require('path');

const baseHandler = async (ctx) => {
  const event = JSON.parse(ctx.event);
  const ossEvent = event.events[0];
  const { credentials } = ctx.context;
  // Create oss client.
  const client = new alioss({
    region: 'oss-' + ossEvent.region,
    bucket: ossEvent.oss.bucket.name,
    accessKeyId: credentials.accessKeyId,
    accessKeySecret: credentials.accessKeySecret,
    stsToken: credentials.securityToken,
  });
  await client.get(ossEvent.oss.object.key, path.resolve(__dirname, '../code.zip'));
};

const handler = oss.onObjectCreated({
  handler: baseHandler,
  oss: {
    bucketName: 'shl-bucket',
    filter: {
      prefix: 'source/',
      suffix: '.zip',
    },
  },
});

exports.handler = handler;
