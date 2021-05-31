## 使用说明

- 下载命令行工具：`npm install -g @serverless-devs/s`
- 初始化一个模版项目：`s init devsapp/dk-tablestore`
- 下载完成后需要输入 tablestore 的实例名称和公网地址，请前往 [tablestore 控制台](https://otsnext.console.aliyun.com/)创建实例，在实例详情页面可以看到 `实例名称` 和 `公网地址`
  ![image](https://img.alicdn.com/imgextra/i2/O1CN01VF6kv724mMdiMPC9q_!!6000000007433-2-tps-2184-1190.png)

- 进入项目后执行 `s initfc` 来初始化路由，当然你也可以在 s.yml 文件里新增路由
- 部署函数：`s deploy`

## 测试

- 对于初次体验 dk-tablestore，你应该先去执行 `http-dk-user` 函数来创建一个 `dk_user` 的表, 进入 `http-dk-user` 函数详情 在 触发器 tab 下 可看到如下截图
  ![image](https://img.alicdn.com/imgextra/i2/O1CN013tapzS1bUOEc7P6v1_!!6000000003468-2-tps-1144-412.png)

  以 curl 访问

  ```shell
  curl --location --request POST 'https://1694024725952210.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo-2/http-dk-user/'
  ```

  首次调用会返回 `dk_user表已创建成功`, 后续调用会返回 `dk_user表已存在`

- 创建 （http-create 函数，以 post 方式请求）

  ```shell
  curl --location --request POST 'https://1694024725952210.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo-2/http-create/' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "id": 1,
      "name": "shl",
      "age": 20
  }'
  ```

  数据返回

  ```js
  {
      "data": {
          "id": 1,
          "name": "shl",
          "age": 20
      },
      "message": "数据创建成功"
  }
  ```

- 更新 （http-update, 以 put 方式请求）

  以 curl 访问

  ```shell
  curl --location --request POST 'https://1694024725952210.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo-2/http-update/' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "id": 1,
      "name": "xax",
      "age": 21
  }'
  ```

  数据返回

  ```js
  {
      "data": {
          "id": 1,
          "name": "xax",
          "age": 21
      },
      "message": "数据更成功"
  }
  ```

- 查寻 （http-index, 以 get 方式请求）

  以 curl 访问

  ```shell
  curl --location --request POST 'https://1694024725952210.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo-2/http-index/?id=1' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "id": 1,
      "name": "xax",
      "age": 21
  }'
  ```

  数据返回

  ```js
  {
      "primaryKey": [
          {
              "name": "id",
              "value": 1
          }
      ],
      "attributes": [
          {
              "columnName": "age",
              "columnValue": 21,
              "timestamp": 1622428063276
          },
          {
              "columnName": "name",
              "columnValue": "xax",
              "timestamp": 1622428063276
          }
      ]
  }
  ```

- 删除 （http-remove, 以 delete 方式请求）

  以 curl 访问

  ```shell
  curl --location --request POST 'https://1694024725952210.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo-2/http-remove/?id=1' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "id": 1,
      "name": "xax",
      "age": 21
  }'
  ```

  数据返回

  ```js
  {
      "id": "1",
      "message": "数据删除成功"
  }
  ```

---

> - Serverless Devs 项目：https://www.github.com/serverless-devs/serverless-devs
> - Serverless Devs 文档：https://www.github.com/serverless-devs/docs
> - Serverless Devs 钉钉交流群：33947367
