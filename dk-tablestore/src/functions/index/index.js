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
          <div id="app" style="padding: 0 24px;">
              <h3>dk-tablestore 增删改查 demo 演示</h3>
              <el-button type="primary" @click="handleOpenDialogByAdd" size="small">新建</el-button>
              <!-- table -->
              <el-table :data="list" border style="width: 100%; margin-top: 16px;">
                  <el-table-column prop="name" label="姓名">
                  </el-table-column>
                  <el-table-column prop="age" label="年龄">
                  </el-table-column>
                  <el-table-column label="操作">
                      <template slot-scope="scope">
                          <el-button size="mini" @click="handleOpenDialogByEdit(scope.row)">Edit</el-button>
                          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">Delete
                          </el-button>
                      </template>
                  </el-table-column>
              </el-table>
              <!-- slide -->
              <el-drawer :title="drawerTitle" :visible.sync="drawer" :size="640">
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width: 80%;">
                      <el-form-item label="姓名" prop="name">
                          <el-input v-model="ruleForm.name"></el-input>
                      </el-form-item>
                      <el-form-item label="年龄" prop="age">
                          <el-input-number v-model="ruleForm.age" controls-position="right" style="width: 100%;">
                          </el-input-number>
                      </el-form-item>
                      <el-form-item>
                          <el-button type="primary" @click="handleConfirm('ruleForm')">确定</el-button>
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
          function request(options) {
              return axios({
                  baseURL: 'https://1694024725952210.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo',
                  ...options
              })
          }
          new Vue({
              el: '#app',
              data: function () {
                  return {
                      drawer: false,
                      ruleForm: {
                          name: undefined,
                          age: undefined,
                      },
                      rules: {
                          name: [
                              { required: true, message: '请输入姓名', trigger: 'change' },
                          ],
                          age: [
                              { required: true, message: '请输入年龄', trigger: 'change' }
                          ],
                      },
                      list: [],
                      isEdit: false
                  }
              },
              computed: {
                  drawerTitle() {
                      return this.isEdit ? '编辑' : '新建'
                  }
              },
              mounted() {
                  this.init()
              },
              methods: {
                  async  init() {
                      // 创建dk_user表
                      await request({
                          url: '/dk-user/'
                      })
                      await this.get()
                  },
                  async get() {
                      const { data } = await request({ url: '/get/' })
                      this.list = data.map(item => {
                          const primaryKey = item.primaryKey[0];
                          const temp = {}
                          item.attributes.forEach(obj => {
                              temp[obj.columnName] = obj.columnValue
                          })
                          return {
                              [primaryKey.name]: primaryKey.value,
                              ...temp
                          }
                      })
      
                  },
                  handleOpenDialogByAdd() {
                      this.ruleForm = {
                          name: undefined,
                          age: undefined,
                      }
                      this.isEdit = false
                      this.drawer = true
                  },
                  handleOpenDialogByEdit(row) {
                      this.ruleForm = row;
                      this.isEdit = true
                      this.drawer = true
      
                  },
                  handleConfirm(formName) {
                      this.$refs[formName].validate((valid) => {
                          if (valid) {
                              request({
                                  url: this.isEdit ? '/update/' : '/create/',
                                  method: this.isEdit ? 'put' : 'post',
                                  data: this.ruleForm
                              }).then(() => {
                                  this.drawer = false
                                  this.get()
                                  this.$message.success(this.isEdit ? '数据更新成功' : '数据创建成功');
                              }).catch(() => {
                                  this.$message.error(his.isEdit ? '数据更新失败' : '数据创建失败');
                              })
                          } else {
                              console.log('error submit!!');
                              return false;
                          }
                      });
      
                  },
                  handleDelete(row) {
                      request({
                          url: '/remove/',
                          method: 'delete',
                          params: {
                              id: row.id
                          }
                      }).then(() => {
                          this.get()
                          this.$message.success('数据删除成功');
                      }).catch(() => {
                          this.$message.error('数据删除失败');
                      })
                  }
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