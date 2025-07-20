<template>
  <div>
    <div>
      <!-- 按钮 -->
      <!-- <el-button type="primary" icon="el-icon-plus" style="margin: 10px 10px" @click="addUsers">新建用户</el-button> -->
      <!--编辑用户 对话框 目前不能新建用户-->
      <el-dialog :title="dialog_title" :visible.sync="dialogFormVisible" :show-close="false" @close="resetForm">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item label="用户名称" prop="username" :label-width="formLabelWidth" required>
            <el-input v-model="form.username" placeholder="请输入内容(必填)" autocomplete="off" />
          </el-form-item>
          <el-form-item label="用户真实姓名" prop="realname" :label-width="formLabelWidth" required>
            <el-input v-model="form.realname" placeholder="请输入内容（必填）" autocomplete="off" />
          </el-form-item>
          <el-form-item label="角色名称" prop="userTypeId" :label-width="formLabelWidth" required>
            <el-select v-model="form.userTypeId" placeholder="请选择角色" @change="handleRoleChange">
              <el-option v-for="item in allRoleList" :key="item.roleId" :value="item.roleId" :label="item.roleName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄" prop="age" :label-width="formLabelWidth" required>
            <el-input v-model="form.age" placeholder="请输入内容" autocomplete="off" @input="handleAgeInput" />
          </el-form-item>
          <el-form-item label="性别" prop="userGender" :label-width="formLabelWidth" required>
            <el-select v-model="form.userGender" placeholder="请选择性别" style="width: 100%;">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>
          <el-form-item label="电话号码" prop="userPhone" :label-width="formLabelWidth">
            <el-input v-model="form.userPhone" placeholder="请输入内容" autocomplete="off" />
          </el-form-item>
          <el-form-item label="所属公司" :label-width="formLabelWidth">
            <el-input v-model="form.userCompanyId" placeholder="请输入内容" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmAddUser">确 定</el-button>
          <el-button @click="cancelAddUser">取 消</el-button>
        </div>
      </el-dialog>
      <!--查看用户 对话框 -->
      <el-dialog title="查看用户信息" :visible.sync="dialogCheckFormVisible" :show-close="false" @close="resetForm">
        <el-form :model="form">
          <el-form-item label="用户名称" :label-width="formLabelWidth">
            <el-input v-model="form.username" placeholder="" autocomplete="off" disabled />
          </el-form-item>
          <el-form-item label="用户真实姓名" :label-width="formLabelWidth">
            <el-input v-model="form.realname" placeholder="" autocomplete="off" disabled />
          </el-form-item>
          <el-form-item label="角色名称" :label-width="formLabelWidth">
            <el-input v-model="form.roleName" placeholder="" autocomplete="off" disabled />
          </el-form-item>
          <el-form-item label="年龄" :label-width="formLabelWidth">
            <el-input v-model="form.age" placeholder="" autocomplete="off" disabled />
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-input v-model="form.userGender" placeholder="" autocomplete="off" disabled />
          </el-form-item>
          <el-form-item label="电话号码" :label-width="formLabelWidth">
            <el-input v-model="form.userPhone" placeholder="" autocomplete="off" disabled />
          </el-form-item>
          <el-form-item label="所属公司" :label-width="formLabelWidth">
            <el-input v-model="form.userCompanyId" placeholder="" autocomplete="off" disabled />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmCheckUser">确 定</el-button>
        </div>
      </el-dialog>
      <span class="search-container" style="float: right">
        <!--搜索栏--->
        <el-input v-model="searchQuery" placeholder="请输入搜索内容" style="width: 300px; margin-right: 10px" />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </span>
      <!-- 表格 -->
      <div>
        <el-table :data="userInfo" style="width: 100%">
          <el-table-column type="index" label="序号" width="100" align="center" />
          <el-table-column prop="username" label="用户名称" align="center" />
          <el-table-column prop="userGender" label="性别" align="center" />
          <el-table-column prop="roleName" label="角色" align="center" />
          <el-table-column label="操作" prop="prop" align="center">
            <template slot-scope="{ row, $index }">
              <el-button type="info" icon="el-icon-view" size="mini" @click="checkUser(row, $index)">
                查看</el-button>
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateUser(row, $index)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页器 -->
      <el-pagination style="margin-top: 20px; text-align: center" :current-page="curPage" :page-sizes="[10, 15, 20]"
        :page-size="limit" layout=" prev, pager, next, jumper,->,sizes,total" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import {
  getAllUser,
  getAllRoles2,
  getUserById,
  searchUser,
  addUser,
  updateById,
  deleteUserById,

} from '@/api/authority'
export default {
  data() {
    // 自定义验证规则
    const validatePhone = (rule, value, callback) => {
      const phoneRegex = /^1[3-9]\d{9}$/; // 中国大陆手机号码规则
      if (!phoneRegex.test(value)) {
        callback(new Error('请输入有效的手机号码'));
      } else {
        callback();
      }
    };

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
        realname: '',
        roleName: '',
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
      dialogCheckFormVisible: false,
      allRoleList: [],
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        realname: [
          { required: true, message: '真实姓名不能为空', trigger: 'blur' }
        ],
        userTypeId: [
          { required: true, message: '角色不能为空', trigger: 'blur' }
        ],
        userPhone: [
          { required: true, message: '电话号码不能为空', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        age: [
          { required: true, message: '年龄不能为空', trigger: 'blur' },
          { type: 'number', min: 0, max: 100, message: '年龄必须在0到100之间', trigger: 'blur' }
        ],
        userGender: [
          { required: true, message: '性别不能为空', trigger: 'change' }
        ],
      },
    }
  },
  watch: {
  },
  created() {
    this.getAllUser()
    this.getAllRoles()
  },
  methods: {
    async getAllUser() {
      try {
        const res = await getAllUser(this.curPage, this.limit)
        if (res.code == 200) {
          console.log('全部用户列表', res)
          this.userInfo = res.result.records
          this.total = Number(res.result.total)
        } else {
          throw new Error(res.message || '获取所有用户列表失败')
        }
      } catch (error) {
        console.log(error)
        this.$message.error('出错啦，请稍后重试！')
      }
    },
    async getAllRoles() {
      try {
        const res = await getAllRoles2()
        if (res.code == 200) {
          console.log('所有角色列表', res)
          this.allRoleList = res.result.map(item => {
            return {
              roleId: String(item.roleId),
              roleName: item.roleName
            }
          })
        } else {
          throw new Error(res.message || '获取所有角色列表失败')
        }
      } catch (error) {
        console.log(error)
      }
    },
    resetForm() {
      // 将 form 对象重置为初始状态
      this.form = {
        userId: '',
        username: '',
        realname: '',
        userTypeId: '',
        roleName: '',
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
    handleAgeInput(value) {
      // 移除非数字字符
      let numericValue = value.replace(/[^0-9]/g, '');
      // 限制最大值为 100
      if (numericValue > 100) numericValue = 100;
      // 转换为数字类型
      this.form.age = numericValue === '' ? '' : Number(numericValue);
    },
    async confirmAddUser() {
      //验证表单
      const valid = await this.$refs.form.validate()
      if (!valid) {
        this.$message.error('请检查表单内容');
        return
      }
      if (this.dialog_title == '新建用户') {
        try {
          const res = await addUser(this.form)
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
          console.log('编辑后用户信息', this.form)
          const res = await updateById(this.form)
          if (res.code == '200') {
            this.$message({
              message: '编辑用户成功！',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.getAllUser()
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
      // this.form = { ...row }; // 使用深拷贝避免直接修改 row
      try {
        const res = await getUserById(id)
        if (res.code == 200) {
          console.log('查看用户信息', res)
          const userDetail = res.result[0];
          this.form = { ...userDetail };
          // this.form = {
          //   ...userDetail,
          //   roleName: userDetail.roleName // 关键：赋值角色名称
          // };
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
    handleRoleChange(roleId) {
      const selectedItem = this.allRoleList.find(item => item.roleId === roleId);
      console.log("切换角色", roleId, selectedItem);
      this.form.roleName = selectedItem.roleName;
    },
    async updateUser(row, index) {
      this.dialog_title = '编辑用户信息'
      this.dialogFormVisible = true
      const id = row.userId
      console.log("获取用户信息", row, id);
      try {
        const res = await getUserById(id);
        if (res.code === 200) {
          const userDetail = res.result[0];
          this.form = { ...userDetail };
        }
      } catch (error) {
        console.error('编辑时获取用户详情失败：', error);
      }
    }
  }
}
</script>

<style></style>
