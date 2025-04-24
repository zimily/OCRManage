<template>
  <div>
    <div>
      <!-- 按钮 -->
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin: 10px 10px"
        @click="addUsers"
        >新建用户</el-button
      >
      <!--新建用户 对话框 -->
      <el-dialog
        :title=dialog_title
        :visible.sync="dialogFormVisible"
        :show-close="false"
      >
        <el-form :model="form">
          <el-form-item label="用户名称" :label-width="formLabelWidth">
            <el-input
              v-model="form.username"
              placeholder="请输入内容(必填)"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input
              v-model="form.password"
              placeholder="请输入内容（必填）"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户真实姓名" :label-width="formLabelWidth">
            <el-input
              v-model="form.realname"
              placeholder="请输入内容（必填）"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色ID" :label-width="formLabelWidth">
            <el-input
              v-model="form.userTypeId"
              placeholder="请输入内容（必填）"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="年龄" :label-width="formLabelWidth">
            <el-input
              v-model="form.age"
              placeholder="请输入内容"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-input
              v-model="form.userGender"
              placeholder="请输入内容"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话号码" :label-width="formLabelWidth">
            <el-input
              v-model="form.userPhone"
              placeholder="请输入内容"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属公司" :label-width="formLabelWidth">
            <el-input
              v-model="form.userCompanyId"
              placeholder="请输入内容"
              autocomplete="off"
            ></el-input>
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
        ></el-input>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </span>
      <!-- 表格 -->
      <div>
        <el-table :data="userInfo" style="width: 100%">
          <el-table-column type="index" width="100" align="center">
          </el-table-column>
          <el-table-column prop="username" label="用户名称" align="center">
          </el-table-column>
          <el-table-column prop="userGender" label="性别" align="center">
          </el-table-column>
          <el-table-column prop="userTypeName" label="角色" align="center">
          </el-table-column>
          <el-table-column label="操作" prop="prop" align="center">
            <template slot-scope="{ row, $index }">
              <el-button
                type="info"
                icon="el-icon-view"
                size="mini"
                @click="checkUser(row, $index)"
              >
                查看</el-button
              >
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
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input
                      v-model="form.password"
                      placeholder="请输入内容（必填）"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="用户真实姓名"
                    :label-width="formLabelWidth"
                  >
                    <el-input
                      v-model="form.realname"
                      placeholder="请输入内容（必填）"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="角色ID" :label-width="formLabelWidth">
                    <el-input
                      v-model="form.userTypeId"
                      placeholder="请输入内容（必填）"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="年龄" :label-width="formLabelWidth">
                    <el-input
                      v-model="form.age"
                      placeholder="请输入内容"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="性别" :label-width="formLabelWidth">
                    <el-input
                      v-model="form.userGender"
                      placeholder="请输入内容"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="电话号码" :label-width="formLabelWidth">
                    <el-input
                      v-model="form.userPhone"
                      placeholder="请输入内容"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="所属公司" :label-width="formLabelWidth">
                    <el-input
                      v-model="form.userCompanyId"
                      placeholder="请输入内容"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button
                    type="primary"
                    @click="confirmCheckUser"
                    >确 定</el-button
                  >
                </div>
              </el-dialog>
              <el-button type="warning" icon="el-icon-edit" size="mini"   @click="updateUser(row, $index)"
                >编辑</el-button
              >
              <el-popconfirm
                confirm-button-text="是"
                cancel-button-text="否"
                icon="el-icon-info"
                icon-color="red"
                :title="'确认删除 ' + row.username + ' 用户信息吗？'"
                @onConfirm="deleteUser(row, $index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页器 -->
      <el-pagination
        style="margin-top: 20px; text-align: center"
        @size-change="handleSizeChange"
        @current-change="getAllUser"
        :current-page="curPage"
        :page-sizes="[10, 15, 20]"
        :page-size="limit"
        layout=" prev, pager, next, jumper,->,sizes,total"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getAllUser, getUserById, addUser, updateById,deleteUserById } from "@/api/authority";
export default {
  data() {
    return {
      searchQuery: "",
      limit: 15,
      total: 0,
      curPage: 1,
      userInfo: [],
      dialogFormVisible: false,
      form: {
        userId: "",
        username: "",
        password: "",
        realname: "",
        userTypeId: "",
        userPhone: "",
        userNumber: "",
        userGender: "",
        userCompanyId: "",
        age: "",
        isDelete: true,
      },
      flag:1,// 0 无状态；  1 新建用户； 2 查看用户信息； 3 编辑用户信息
      dialog_title:"标题",
      formLabelWidth: "120px",
      dialogCheckFormVisible: false,
    };
  },
  created() {
    this.getAllUser();
  },
  methods: {
    async getAllUser() {
      const pageNum = 1;
      const pageSize = 15;
      let res = await getAllUser(this.curPage, this.limit);
      if (res.code == 200) {
        this.userInfo = res.result.records;
        this.total = res.result.total;
      }
      console.log("请求用户", res);
    },
    resetForm() {
      // 将 form 对象重置为初始状态
      this.form = {
        userId: "",
        username: "",
        password: "",
        realname: "",
        userTypeId: "",
        userPhone: "",
        userNumber: "",
        userGender: "",
        userCompanyId: "",
        age: "",
        isDelete: true,
      };
      this.dialog_title="";
    },
    addUsers() {
      this.dialog_title="新建用户"
      this.dialogFormVisible = true;
    },
    async confirmAddUser() {
      this.dialogFormVisible = false;
      console.log("点击的确认按钮",this.dialog_title)
      if(this.dialog_title=="新建用户"){
        console.log("新用户的信息", this.form);
        let res = await addUser(this.form);
      }else if(this.dialog_title=="编辑用户信息"){
          let res = await updateById(this.form);
        console.log("编辑用户的信息", this.form);

      }
    },
    cancelAddUser() {
      this.dialogFormVisible = false;
      this.resetForm();
    },
    handleSearch() {},
    handleSizeChange(size) {
      this.limit = size;
      this.getAllUser();
    },
    async deleteUser(row, index) {
      console.log(row, index);
      const id = row.userId;
       let res = await deleteUserById(id);

    },
   checkUser(row, index) {
      this.dialogCheckFormVisible = true;
      const id = row.userId;
      console.log("查看用户信息", row, id);
      this.form=row
    },
    confirmCheckUser(){
      this.dialogCheckFormVisible = false;
      this.resetForm();
    },
    updateUser(row,index){
      this.dialog_title="编辑用户信息"
      this.dialogFormVisible = true;
      const id = row.userId;
      console.log("查看用户信息", row, id);
      this.form=row
    }
  },
};
</script>

<style>
</style>