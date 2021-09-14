## 使用说明

- 下载命令行工具：`npm install -g @serverless-devs/s`
- 初始化一个模版项目：`s init devsapp/dk-tablestore`
- 下载完成后请输入 tablestore 的实例名称和公网地址，可前往 [tablestore 控制台](https://otsnext.console.aliyun.com/)创建实例， 在实例详情页面可以看到 `实例名称` 和 `公网地址`
  ![image](https://img.alicdn.com/imgextra/i2/O1CN01VF6kv724mMdiMPC9q_!!6000000007433-2-tps-2184-1190.png)

- 部署函数：`s deploy`

- 部署成功后访问 `域名` 就可以了
  ![image](https://img.alicdn.com/imgextra/i2/O1CN01Ra3NeY1TGB1b8IBFh_!!6000000002354-2-tps-1001-335.png)

## 本地调试

在 `sourceCode指定路径` 下执行 `npm run serve` 即可访问 `http://localhost:7001` 了

## 接口测试

- 创建数据表

  ```shell
  curl --location --request POST 'https://1694024725952210.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo/list/' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "tableName": "dk_user"
  }'
  ```

  返回数据

  ```js
  {
    "success": true,
    "message": "dk_user表已创建成功"
  }
  ```

- 获取所有表

  ```shell
  curl --location --request GET 'https://1694024725952210.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo/list/'
  ```

  返回数据

  ```js
  {
    "tableNames": [
        "dk_user"
    ]
  }
  ```

- 删除数据表

  ```shell
  curl --location --request DELETE 'https://1694024725952210.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo/list/?tableName=dk_user'
  ```

  数据返回

  ```js
  {
    "success": true,
    "message": "dk_user表已删除成功"
  }
  ```

### 以 dk_user 表为例进行增删改查

- 创建

  ```shell
  curl --location --request POST 'https://1694024725952210.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo/info/' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "tableName": "dk_user",
    "name": "shl",
    "age": 20
  }'
  ```

  数据返回

  ```js
  {
    "data": {
        "name": "shl",
        "age": 20
    },
    "message": "数据创建成功"
  }
  ```

- 更新

  ```shell
  curl --location --request PUT 'https://1694024725952210.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo/info/' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "tableName": "dk_user",
    "id": 1622604175120,
    "age": 21,
    "name": "dk"
  }'
  ```

  数据返回

  ```js
  {
    "data": {
        "id": 1622604175120,
        "name": "dk",
        "age": 21
    },
    "message": "数据更成功"
  }
  ```

- 查寻

  ```shell
  curl --location --request GET 'https://1694024725952210.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo/info/?tableName=dk_user'
  ```

  数据返回

  ```js
  [
    {
      primaryKey: [
        {
          name: 'id',
          value: 1622604175120,
        },
      ],
      attributes: [
        {
          columnName: 'age',
          columnValue: 21,
          timestamp: 1622604557591,
        },
        {
          columnName: 'name',
          columnValue: 'dk',
          timestamp: 1622604557591,
        },
      ],
    },
  ];
  ```

- 删除

  ```shell
  curl --location --request DELETE 'https://1694024725952210.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo/info/?id=1622604175120&tableName=dk_user'
  ```

  数据返回

  ```js
  {
    "id": "1622604175120",
    "message": "数据删除成功"
  }
  ```

---

> - Serverless Devs 项目：https://www.github.com/serverless-devs/serverless-devs
> - Serverless Devs 文档：https://www.github.com/serverless-devs/docs
> - Serverless Devs 钉钉交流群：33947367
