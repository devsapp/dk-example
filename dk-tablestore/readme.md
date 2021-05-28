## 使用说明

- 下载命令行工具：`npm install -g @serverless-devs/s`
- 初始化一个模版项目：`s init devsapp/dk-tablestore`
- 下载完成后需要输入 tablestore 的实例名称和公网地址，请前往 [tablestore 控制台](https://otsnext.console.aliyun.com/)创建实例，在实例详情页面可以看到 `实例名称` 和 `公网地址`
![image](https://img.alicdn.com/imgextra/i2/O1CN01VF6kv724mMdiMPC9q_!!6000000007433-2-tps-2184-1190.png)

- 进入项目后执行 `s initfc` 来初始化路由，当然你也可以在 s.yml 文件里新增路由
- 部署项目：`s deploy`

## 测试

- 对于初次体验 dk-tablestore，你应该先去执行 `http-dk-user` 函数来创建一个 `dk_user` 的表, 进入 `http-dk-user` 函数详情 在 触发器 tab 下 可看到如下截图

<img src="https://img.alicdn.com/imgextra/i2/O1CN013tapzS1bUOEc7P6v1_!!6000000003468-2-tps-1144-412.png" width="100%"  />

我们在 postman 里以 post 方式请求该接口，可以看到如下截图（熟悉 fc 的小伙伴也可以在 fc 控制台直接操作）

<img src="https://img.alicdn.com/imgextra/i2/O1CN01bMw1fD23ytrfBKpp1_!!6000000007325-2-tps-965-506.png" width="100%"  />

或者以 curl 的方法也是可以的

<img src="https://img.alicdn.com/imgextra/i3/O1CN01jxnNyH1ZFcEKIj27X_!!6000000003165-2-tps-693-71.png" width="100%"  />

- 创建 （http-create 函数，以 post 方式请求）

<img src="https://img.alicdn.com/imgextra/i1/O1CN01c9WQXV1aU6N8T83Il_!!6000000003332-2-tps-948-616.png" width="100%"  />

- 更新 （http-update, 以 put 方式请求）

<img src="https://img.alicdn.com/imgextra/i1/O1CN01z275RX1ilyl5doXUX_!!6000000004454-2-tps-973-630.png" width="100%"  />

- 查寻 （http-index, 以 get 方式请求）

<img src="https://img.alicdn.com/imgextra/i2/O1CN01eqmzr01w8xdZafr9T_!!6000000006264-2-tps-975-731.png" width="100%"  />

- 删除 （http-remove, 以 delete 方式请求）

<img src="https://img.alicdn.com/imgextra/i3/O1CN011Wx0IG1XkBQqJ4UAZ_!!6000000002961-2-tps-964-554.png" width="100%"  />

---

> - Serverless Devs 项目：https://www.github.com/serverless-devs/serverless-devs
> - Serverless Devs 文档：https://www.github.com/serverless-devs/docs
> - Serverless Devs 钉钉交流群：33947367
