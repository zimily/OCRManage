<template>
  <div>
    <div>
      <!-- 按钮 -->
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin: 10px 10px"
        @click="addUsers"
      >新建用户</el-button>
      <!--新建用户 对话框 -->
      <el-dialog
        :title="dialog_title"
        :visible.sync="dialogFormVisible"
        :show-close="false"
      >
        <el-form :model="form">
          <el-form-item label="用户名称" :label-width="formLabelWidth">
            <el-input
              v-model="form.username"
              placeholder="请输入内容(必填)"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input
              v-model="form.password"
              placeholder="请输入内容（必填）"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="用户真实姓名" :label-width="formLabelWidth">
            <el-input
              v-model="form.realname"
              placeholder="请输入内容（必填）"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="角色ID" :label-width="formLabelWidth">
            <el-input
              v-model="form.userTypeId"
              placeholder="请输入内容（必填）"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="年龄" :label-width="formLabelWidth">
            <el-input
              v-model="form.age"
              placeholder="请输入内容"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-input
              v-model="form.userGender"
              placeholder="请输入内容"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="电话号码" :label-width="formLabelWidth">
            <el-input
              v-model="form.userPhone"
              placeholder="请输入内容"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="所属公司" :label-width="formLabelWidth">
            <el-input
              v-model="form.userCompanyId"
              placeholder="请输入内容"
              autocomplete="off"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAddUser">取 消</el-button>
          <el-button type="primary" @click="confirmAddUser">确 定</el-button>
        </div>
      </el-dialog>
      <span class="search-container" style="float: right">
        <!--搜索栏--->
        <el-input
          v-model="searchQuery"
          placeholder="请输入搜索内容"
          style="width: 300px; margin-right: 10px"
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </span>
      <!-- 表格 -->
      <div>
        <el-table :data="userInfo" style="width: 100%">
          <el-table-column type="index" width="100" align="center" />
          <el-table-column prop="username" label="用户名称" align="center" />
          <el-table-column prop="userGender" label="性别" align="center" />
          <el-table-column prop="userTypeName" label="角色" align="center" />
          <el-table-column label="操作" prop="prop" align="center">
            <template slot-scope="{ row, $index }">
              <el-button
                type="info"
                icon="el-icon-view"
                size="mini"
                @click="checkUser(row, $index)"
              >
                查看</el-button>
              <!--查看用户 对话框 -->
              <el-dialog
                title="查看用户信息"
                :visible.sync="dialogCheckFormVisible"
                :show-close="false"
              >
                <el-form :model="form">
                  <el-form-item label="用户名称" :label-width="formLabelWidth">
                    <el-input
                      v-model="form.username"
                      placeholder="请输入内容(必填)"
                      autocomplete="off"
                    />
                  </el-form-item>
                  <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input
                      v-model="form.password"
                      placeholder="请输入内容（必填）"
                      autocomplete="off"
                    />
                  </el-form-item>
                  <el-form-item
                    label="用户真实姓名"
                    :label-width="formLabelWidth"
                  >
                    <el-input
                      v-model="form.realname"
                      placeholder="请输入内容（必填）"
                      autocomplete="off"
                    />
                  </el-form-item>
                  <el-form-item label="角色ID" :label-width="formLabelWidth">
                    <el-input
                      v-model="form.userTypeId"
                      placeholder="请输入内容（必填）"
                      autocomplete="off"
                    />
                  </el-form-item>
                  <el-form-item label="年龄" :label-width="formLabelWidth">
                    <el-input
                      v-model="form.age"
                      placeholder="请输入内容"
                      autocomplete="off"
                    />
                  </el-form-item>
                  <el-form-item label="性别" :label-width="formLabelWidth">
                    <el-input
                      v-model="form.userGender"
                      placeholder="请输入内容"
                      autocomplete="off"
                    />
                  </el-form-item>
                  <el-form-item label="电话号码" :label-width="formLabelWidth">
                    <el-input
                      v-model="form.userPhone"
                      placeholder="请输入内容"
                      autocomplete="off"
                    />
                  </el-form-item>
                  <el-form-item label="所属公司" :label-width="formLabelWidth">
                    <el-input
                      v-model="form.userCompanyId"
                      placeholder="请输入内容"
                      autocomplete="off"
                    />
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button
                    type="primary"
                    @click="confirmCheckUser"
                  >确 定</el-button>
                </div>
              </el-dialog>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateUser(row, $index)"
              >编辑</el-button>
              <el-popconfirm
                confirm-button-text="是"
                cancel-button-text="否"
                icon="el-icon-info"
                icon-color="red"
                :title="'确认删除 ' + row.username + ' 用户信息吗？'"
                @onConfirm="deleteUser(row, $index)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                >删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页器 -->
      <el-pagination
        style="margin-top: 20px; text-align: center"
        :current-page="curPage"
        :page-sizes="[10, 15, 20]"
        :page-size="limit"
        layout=" prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import {
  getAllUser,
  getUserById,
  searchUser,
  addUser,
  updateById,
  deleteUserById
} from '@/api/authority'
export default {
  data() {
    return {
      searchQuery: '',
      limit: 15,
      total: 0,
      curPage: 1,
      userInfo: [],
      dialogFormVisible: false,
      form: {
        userId: '',
        username: '',
        password: '',
        realname: '',
        userTypeId: '',
        userPhone: '',
        userNumber: '',
        userGender: '',
        userCompanyId: '',
        age: '',
        isDelete: true
      },
      flag: 1, // 0 无状态；  1 新建用户； 2 查看用户信息； 3 编辑用户信息
      dialog_title: '标题',
      formLabelWidth: '120px',
      dialogCheckFormVisible: false
    }
  },
  created() {
    this.getAllUser()
  },
  methods: {
    async getAllUser() {
      try {
        const res = await getAllUser(this.curPage, this.limit)
        if (res.code == 200) {
          console.log('请求用户', res)
          this.userInfo = res.result.records
          this.total = res.result.total
        } else {
          throw new Error(res.message || '获取所有用户列表失败')
        }
      } catch (error) {
        console.log(error)
        this.$message.error('出错啦，请稍后重试！')
      }
    },
    resetForm() {
      // 将 form 对象重置为初始状态
      this.form = {
        userId: '',
        username: '',
        password: '',
        realname: '',
        userTypeId: '',
        userPhone: '',
        userNumber: '',
        userGender: '',
        userCompanyId: '',
        age: '',
        isDelete: true
      }
      this.dialog_title = ''
    },
    addUsers() {
      this.dialog_title = '新建用户'
      this.dialogFormVisible = true
    },
    removeEmptyProperties(obj) {
      for (const key in obj) {
        if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
          delete obj[key]
        }
      }
      return obj
    },
    async confirmAddUser() {
      this.dialogFormVisible = false
      // 要剔除表单中空的字段
      const info = this.removeEmptyProperties(this.form)
      if (this.dialog_title == '新建用户') {
        try {
          const res = await addUser(info)
          if (res.code == '200') {
            this.getAllUser()
            this.$message({
              message: '新建用户成功！',
              type: 'success'
            })
            this.resetForm()
          } else {
            this.$message.error('操作失败！')
            throw new Error(res.message)
          }
        } catch (error) {
          console.error('操作失败', error)
        }
      } else if (this.dialog_title == '编辑用户信息') {
        try {
          const res = await updateById(info)
          if (res.code == '200') {
            this.getAllUser()
            this.$message({
              message: '编辑用户成功！',
              type: 'success'
            })
            this.resetForm()
          } else {
            this.$message.error('操作失败！')
            throw new Error(res.message)
          }
        } catch (error) {
          console.error('操作失败', error)
        }
      }
    },
    cancelAddUser() {
      this.dialogFormVisible = false
      this.resetForm()
    },
    async handleSearch() {
      try {
        const res = await searchUser(this.searchQuery)
        if (res.code == 200) {
          console.log('搜索结果', res)
          this.userInfo = res.result
        } else {
          throw new Error(res.message || '用户搜索失败')
        }
      } catch (error) {
        console.log(error)
        this.$message.error('出错啦，请稍后重试！')
      }
    },
    handleSizeChange(size) {
      // console.log("页面的数据条数",size)
      this.limit = size
      this.getAllUser()
    },
    handleCurrentChange(index) {
      // console.log("直接跳转到",index)
      this.curPage = index
      this.getAllUser()
    },
    async deleteUser(row, index) {
      // console.log(row, index);
      const id = row.userId
      try {
        const res = await deleteUserById(id)
        if (res.code == '200') {
          this.$message({
            message: '删除操作成功！',
            type: 'success'
          })
          this.getAllUser()
        } else {
          this.$message.error('删除操作失败！')
          throw new Error(res.message)
        }
      } catch (error) {
        console.error('操作失败', error)
      }
    },
    async checkUser(row, index) {
      this.dialogCheckFormVisible = true
      const id = row.userId
      this.form = row
      try {
        const res = await getUserById(id)
        if (res.code == 200) {
          console.log('id-uesr', res)
        } else {
          throw new Error(res.message || '失败')
        }
      } catch (error) {
        console.log(error)
        this.$message.error('出错啦，请稍后重试！')
      }
    },
    confirmCheckUser() {
      this.dialogCheckFormVisible = false
      this.resetForm()
    },
    updateUser(row, index) {
      this.dialog_title = '编辑用户信息'
      this.dialogFormVisible = true
      const id = row.userId
      // console.log("查看用户信息", row, id);
      this.form = row
    }
  }
}
</script>

<style>
</style>
