const { oss } = require('@serverless-devs/dk');
const aliOss = require('ali-oss');
const path = require('path');
const fs = require('fs-extra');
const decompress = require('decompress');
const walkSync = require('walk-sync');
const dotenv = require('dotenv');
const _ = require('lodash');

const result = dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const envConfig = result.parsed;

const baseHandler = async (ctx) => {
  const event = JSON.parse(ctx.event);
  const ossEvent = event.events[0];
  const ossRegion = 'oss-' + ossEvent.region;
  const client = new aliOss({
    region: ossRegion,
    accessKeyId: ctx.context.credentials.accessKeyId,
    accessKeySecret: ctx.context.credentials.accessKeySecret,
    stsToken: ctx.context.credentials.securityToken,
  });
  client.useBucket(ossEvent.oss.bucket.name);
  const tmpFile = `/tmp/${Date.now()}`;
  const res = await client.get(ossEvent.oss.object.key);
  fs.ensureDirSync(tmpFile);
  await decompress(res.content, tmpFile, { strip: 1 });
  const paths = walkSync(tmpFile);
  for (const p of paths) {
    const fillPath = path.resolve(tmpFile, p);
    const stat = fs.statSync(fillPath);
    if (stat.isFile()) {
      const target = _.get(envConfig, 'filter_target', 'target/');
      await client.put(path.join(target, p), fillPath);
    }
  }
};

const handler = oss.onObjectCreated({
  handler: baseHandler,
  oss: {
    bucketName: _.get(envConfig, 'bucket_name'),
    filter: {
      prefix: _.get(envConfig, 'filter_prefix', 'source/'),
      suffix: _.get(envConfig, 'filter_suffix', '.zip'),
    },
  },
});

exports.handler = handler;
