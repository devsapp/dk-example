const { dk, tablestoreInitialzerPlugin } = require('@serverless-devs/dk');
const tableStoreEventParse = require('@serverless-devs/tablestore-event-parser');
const nodemailer = require('nodemailer');

const FROM = process.env.mail_from; // 发送邮箱
const TO = process.env.mail_to; // 接收邮箱
const PASS = process.env.mail_pass; // 发送邮箱的 smtp 授权码
const [, PRODUCT] = process.env.mail_from ? process.env.mail_from.split('@') : ''; // 发送平台
const [SERVIVE] = PRODUCT ? PRODUCT.split('.') : '';

const TRANSPORT = {
  // host: 'smtp.ethereal.email',
  service: SERVIVE, // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  port: 465, // SMTP 端口
  secureConnection: true, // 使用了 SSL
  auth: {
    user: FROM,
    pass: PASS, // 这里密码不是qq密码，是你设置的smtp授权码
  }
}

// 发送邮件
const sendMail = async (option) => {
  const transporter = nodemailer.createTransport(TRANSPORT);
  await transporter.sendMail(option);
};

const handler = dk(async (request) => {
  const { event = {} } = request;
  const Records = event.Records || [];
  if (!Records.length) return;
  const { Type, PrimaryKey = [], Columns = [] } = Records[0];
  if (!PrimaryKey.length || !PrimaryKey.length) return;
  const code = Date.now();
  const { Value: id } = PrimaryKey.find((item) => item.ColumnName === 'id') || {};
  const { Value: verified } = Columns.find((item) => item.ColumnName === 'verified') || {};

  switch (Type) {
    case 'PutRow':
      const { accountId, region, service } = request.context;
      const baseURL = `https://${accountId}.${region}.fc.aliyuncs.com/2016-08-15/proxy/${service.name}`;
      await sendMail({
        from: `"验证码" <${FROM}>`,
        to: TO,
        subject: 'code',
        html: `<div>您添加一条数据，请点击<a href="${baseURL}/info/UpdateRow?code=${code}&id=${id}"> CODE </a>验证，添加其他字段</div>`,
      });
      break;
    case 'UpdateRow':
      if (verified) {
        await sendMail({
          from: `"完成" <${FROM}>`,
          to: TO,
          subject: '验证完成',
          text: '通过邮件，修改tablestore，验证完成',
        });
      }
      break;

    default:
      break;
  }
});

handler.use(tablestoreInitialzerPlugin()).use(tableStoreEventParse());

exports.initializer = handler.initializerHandler;

exports.handler = handler;
