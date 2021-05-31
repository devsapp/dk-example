const { http, tablestoreInitialzerPlugin } = require('@serverless-devs/dk');

const handler = http.onRequest({
  handler: async (request) => {
    return {
      html: `<!DOCTYPE html>
      <html>
      
      <head>
          <meta charset="UTF-8">
          <!-- import CSS -->
          <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
      </head>
      
      <body>
          <div id="app">
              <h3>dk-tablestore demo演示</h3>
              <el-button type="primary" @click="drawer = true">新建</el-button>
              <el-drawer title="我是标题" :visible.sync="drawer" :size="640">
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                      <el-form-item label="姓名" prop="name">
                          <el-input v-model="ruleForm.name"></el-input>
                      </el-form-item>
                      <el-form-item label="年龄" prop="age">
                          <el-input v-model="ruleForm.age"></el-input>
                      </el-form-item>
                      <el-form-item>
                          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                          <el-button @click="drawer=false">取消</el-button>
                      </el-form-item>
                  </el-form>
              </el-drawer>
          </div>
      </body>
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
      
      <!-- import Vue before Element -->
      <script src="https://unpkg.com/vue/dist/vue.js"></script>
      <!-- import JavaScript -->
      <script src="https://unpkg.com/element-ui/lib/index.js"></script>
      <script>
          new Vue({
              el: '#app',
              data: function () {
                  return {
                      drawer: false,
                      ruleForm: {
                          name: '',
                          age: '',
                      },
                      rules: {
                          name: [
                              { required: true, message: '请输入姓名', trigger: 'change' },
                          ],
                          age: [
                              { required: true, message: '请输入年龄', trigger: 'change' }
                          ],
                      }
                  }
              },
              mounted() {
                  this.init()
              },
              methods: {
                  init() {
                      // 创建dk_user表
                      axios('https://1694024725952210.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo/dk-user/')
                  },
                  submitForm(formName) {
                      this.$refs[formName].validate((valid) => {
                          if (valid) {
                              alert('submit!');
                          } else {
                              console.log('error submit!!');
                              return false;
                          }
                      });
                  },
              }
          })
      </script>
      
      </html>`,
    };
  },
});

handler.use(tablestoreInitialzerPlugin());

exports.initializer = handler.initializerHandler;

exports.handler = handler;
