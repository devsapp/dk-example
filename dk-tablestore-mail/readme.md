## 使用说明

- 请前往 [tablestore 控制台](https://otsnext.console.aliyun.com/)创建实例， 在实例详情页面可以看到 `实例名称` 和 `公网地址`
![image](https://img.alicdn.com/imgextra/i2/O1CN01VF6kv724mMdiMPC9q_!!6000000007433-2-tps-2184-1190.png)
- 创建数据库表
- 下载命令行工具：`npm install -g @serverless-devs/s`
- 初始化一个模版项目：`s init devsapp/dk-tablestore-mail`，填写示例名称，公网地址，表名，发送邮箱，发送邮箱SMTP授权码，接收邮箱
- 部署函数：`s deploy`

## TODO:优化一

- 在控制台 `自定义域名` 页面，更改路由设置，将路径 /index => /index/\*
  ![image](https://img.alicdn.com/imgextra/i4/O1CN01s0xSAU1LCUucIA9OB_!!6000000001263-2-tps-1370-712.png)

- 然后访问 `${域名}/index/`就可以访问了
  ![image](https://img.alicdn.com/imgextra/i1/O1CN01FHp14c1SeA9Mf60i7_!!6000000002271-2-tps-2832-586.png)

## TODO:优化二
目前用的是`devsapp/jamstack-api`组件，仅支持 `http` 函数，mail 方法实际上应该是  `event` 函数。

手动删除默认的`http`触发器,创建 tablestore 触发器，后续组件支持后会替换组件
![image](https://img.alicdn.com/imgextra/i3/O1CN017WP0Go1Twlr8R74VW_!!6000000002447-0-tps-2474-1480.jpg)

## 测试

### 以 table_list_sz 表为例

- 创建，创建成功后，将从“发送邮箱” 发送一条邮件到“接收邮箱”，点击 “CODE” 验证

  ```shell
  curl --location --request POST 'https://1694024725952210.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-mail-demo/info/' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "name": "黄小喵",
    "age": 12,
    "mail": "12345678@qq.com",
    "xex": "男"
  }'
  ```

  数据返回

  ```js
  {
    "data": {
      "name": "黄小喵",
      "age": 12,
      "mail": "12345678@qq.com",
      "xex": "男"
    },
    "message": "数据创建成功"
  }
  ```
  ![iamge](https://img.alicdn.com/imgextra/i3/O1CN01DBfPHM1t4QsR8NTBa_!!6000000005848-0-tps-2786-570.jpg)


- 点击 CODE 更新
![mail](https://img.alicdn.com/imgextra/i2/O1CN01GHFkiE1nJBwbuikdk_!!6000000005068-2-tps-1624-608.png)

 
- 验证完成，将修改tablestore数据，以及发送邮件通知

  ![iamge](https://img.alicdn.com/imgextra/i1/O1CN01cK8WMx22Y31qlbchv_!!6000000007131-0-tps-2806-584.jpg)

  ![image](https://img.alicdn.com/imgextra/i1/O1CN01KfKGnK1Yv0PVNIekZ_!!6000000003120-0-tps-1894-636.jpg)


> - Serverless Devs 项目：https://www.github.com/serverless-devs/serverless-devs
> - Serverless Devs 文档：https://www.github.com/serverless-devs/docs
> - Serverless Devs 钉钉交流群：33947367
