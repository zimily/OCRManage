<template>
  <div>
    <div>
      <!-- 按钮 -->
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin: 10px 10px"
        @click="addRoles"
        >新建角色</el-button
      >
      <el-dialog
        title="新建角色"
        :visible.sync="dialogFormVisible"
        :show-close="false"
      >
        <el-form :model="form">
          <el-form-item label="角色名称:" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="权限名称:" :label-width="formLabelWidth">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
              >全选</el-checkbox
            >
            <div style="margin: 15px 0"></div>
            <el-checkbox-group
              v-model="form.checkedPermissions"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                v-for="permission in form.permissions"
                :label="permission"
                :key="permission.id"
                >{{ permission.pageName }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAddRole">取 消</el-button>
          <el-button type="primary" @click="confirmAddRole">确 定</el-button>
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
    </div>
    <!-- 表格 -->
    <div>
      <el-table :data="role_list">
        <el-table-column type="index" width="100" align="center">
        </el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" prop="prop" align="center">
          <template slot-scope="{ row, $index }">
            <el-button
              type="info"
              icon="el-icon-view"
              size="mini"
              @click="checkRole(row, $index)"
            >
              查看</el-button
            >
            <el-dialog
              title="查看角色权限信息"
              :visible.sync="dialogCheckRoleVisible"
            >
              <el-form :model="curRole">
                <el-form-item label="角色名称" :label-width="formLabelWidth">
                  <span v-text="curRole.roleName"></span>
                </el-form-item>
                <el-form-item label="权限列表" :label-width="formLabelWidth">
                  <!-- 循环渲染每个权限标签 -->
                  <div class="tag-container">
                    <el-tag
                      v-for="(permission, index) in curRole.permissions"
                      :key="index"
                      type="warning"
                    >
                      {{ permission.pageName }}
                    </el-tag>
                  </div>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button
                  type="primary"
                  @click="dialogCheckRoleVisible = false"
                  >确 定</el-button
                >
              </div>
            </el-dialog>
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="updateRole(row, $index)"
              >编辑</el-button
            >
            <el-dialog
              title="编辑角色信息"
              :visible.sync="dialogUpdateRoleVisible"
              :show-close="false"
            >
              <el-form :model="form">
                <el-form-item label="角色名称:" :label-width="formLabelWidth">
                  <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限名称:" :label-width="formLabelWidth">
                  <el-checkbox
                    :indeterminate="isIndeterminate"
                    v-model="checkAll"
                    @change="handleCheckAllChange"
                    >全选</el-checkbox
                  >
                  <div style="margin: 15px 0"></div>
                  <el-checkbox-group
                    v-model="form.checkedPermissions"
                    @change="handleCheckedCitiesChange"
                  >
                    <el-checkbox
                      v-for="permission in form.permissions"
                      :label="permission"
                      :key="permission.id"
                      >{{ permission.pageName }}</el-checkbox
                    >
                  </el-checkbox-group>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="cancelUpdateRole">取 消</el-button>
                <el-button type="primary" @click="confirmUpdateRole"
                  >确 定</el-button
                >
              </div>
            </el-dialog>
            <el-popconfirm
              confirm-button-text="是"
              cancel-button-text="否"
              icon="el-icon-info"
              icon-color="red"
              :title="'确认删除 ' + row.roleName + ' 角色信息吗？'"
              @onConfirm="deleteRole(row, $index)"
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
      @current-change="handleCurrentChange"
      :current-page="curPage"
      :page-sizes="[10, 15, 20]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->,sizes,total"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  getAllRoles,
  reqPermissionList,
  addRoleWithPermissions,
  deleteRoleById,
  getRoleById,
  updateRole,
  searchRole,
} from "@/api/authority";
export default {
  data() {
    return {
      searchQuery: "", // 用于存储输入框的内容
      role_list: [],
      limit: 15,
      total: 0,
      curPage: 1,
      dialogFormVisible: false,
      form: {
        name: "",
        roleId: "", //新建状态下没有，编辑状态下有
        checkedPermissions: [],
        permissions: [],
      },
      formLabelWidth: "100px",
      allPermissionList: [],
      checkAll: false,
      isIndeterminate: true, //控制全选复选框的中间状态（部分选中）
      curRole: {}, //当前角色信息
      dialogCheckRoleVisible: false,
      dialogUpdateRoleVisible: false,
      updateData: {
        name: "",
        checkedPermissions: [],
        permissions: [],
      },
      checkAll2: false,
      isIndeterminate2: true,
    };
  },
  created() {
    //获取所有角色信息
    this.getAllRoles(); // 添加 await 确保异步操作完成后再获取
    this.getAllPermissions();
  },
  mounted() {},
  methods: {
    async getAllRoles() {
      try {
        if (this.curPage < 1) this.curPage = 1;
        // console.log(this.curPage, this.limit);
        let res = await getAllRoles(this.curPage, this.limit);
        if (res.code == 200 && res.result) {
          // console.log(res)
          this.role_list = res.result.records || [];
          this.total = res.result.total || 0;
          // console.log('role_list',this.role_list)
        } else {
          throw new Error(res.message || "获取角色列表失败");
        }
      } catch (error) {
        console.error("获取角色列表失败:", error);
        this.$message.error("获取角色列表失败，请稍后重试");
      }
    },
    resetForm() {
      // 将 form 对象重置为初始状态
      this.form = {
        name: "",
        checkedPermissions: [],
        permissions: [],
      };
      this.checkAll = false;
      // 或者更精准的字段重置（推荐）
      // this.form.name = "";
      // this.form.checkedPermissions = [];
      // this.form.permissions = [];
    },
    async getAllPermissions() {
      //获取所有权限数据
      try {
        let res = await reqPermissionList();
        if (res.code == 200) {
          this.allPermissionList = res.result;
          // console.log("所有权限", this.allPermissionList);
        } else {
          throw new Error(res.message || "获取所有权限列表失败");
        }
      } catch (error) {
        console.error(error);
        this.$message.error("获取所有权限列表失败，请稍后重试");
      }
    },
    async addRoles() {
      this.dialogFormVisible = true;
      this.form.permissions = this.allPermissionList;
    },
    handleCheckAllChange(val) {
      console.log("val", val);
      this.form.checkedPermissions = val ? this.form.permissions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      console.log("value", value, typeof value);
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.form.permissions.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.form.permissions.length;
    },
    //确认
    async confirmAddRole() {
      this.dialogFormVisible = false;
      console.log("新角色的数据", this.form);
      const roleName = this.form.name;
      let arr = [];
      for (var p in this.form.checkedPermissions) {
        console.log(this.form.checkedPermissions[p]);
        arr.push(this.form.checkedPermissions[p].id);
      }
      const str = arr.join(); // 默认用逗号连接
      console.log(str);
      try {
        let res = await addRoleWithPermissions(roleName, str);
        if (res.code == 200) {
          this.$message({
            message: "新建角色操作成功！",
            type: "success",
          });
        } else {
          this.$message.error("新建操作失败！");
          throw new Error(res.message);
        }
      } catch (error) {
        console.error(error);
        this.$message.error("新建操作失败，请稍后重试");
      }
      this.resetForm();
      this.getAllRoles();
    },
    //取消
    cancelAddRole() {
      this.dialogFormVisible = false;
      this.resetForm();
    },
    //搜索事件
    async handleSearch() {
      console.log("搜索内容:", this.searchQuery);
      try {
        let res = await searchRole(this.searchQuery);
        if (res.code == 200) {
          this.role_list = res.result.records || [];
          this.total = res.result.total || 0;
          this.limit = res.result.size || 0;
          console.log("搜索", res);
        } else {
          throw new Error(res.message || "角色搜索失败");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("出错啦，请稍后重试！");
      }
    },
    //查看权限
    async checkRole(row, index) {
      this.dialogCheckRoleVisible = true;
      console.log(row, index);
      const id = row.roleId;
      let res = await getRoleById(id);
      try {
        let res = await getRoleById(id);
        console.log("查看权限", res);
        if (res.code == 200) {
          this.curRole = res.result;
          console.log(this.curRole);
        } else {
          // 如果后端返回了错误码（非200）
          this.$message.error("查看操作失败！");
          throw new Error(res.message);
        }
      } catch (error) {
        // 请求失败时的处理
        console.error("查看请求出错:", error);
        this.$message.error("查看请求失败，请检查网络或稍后再试");
      }
    },
    //编辑权限
    async updateRole(row, index) {
      this.dialogUpdateRoleVisible = true;
      console.log(row, index);
      const id = row.roleId;
      this.form.roleId = row.roleId;
      try {
        let res = await getRoleById(id);
        // console.log("编辑权限", res, res.code);
        if (res.code == 200) {
          // console.log("**", this.form.name);
          this.form.name = res.result.roleName;
          // console.log("当前权限", this.form.name, res.result.permissions);
          this.form.permissions = this.allPermissionList; //全部权限
          const havePermissions = res.result.permissions; //已有权限
          console.log(havePermissions, this.form.permissions);
          console.log(havePermissions.length, this.form.permissions.length);

          //判断哪一些是已选的，是否已全选
          if (havePermissions.length == this.form.permissions.length) {
            this.checkAll = true;
            this.handleCheckAllChange(true);
          }
          this.form.checkedPermissions = [];
          for (const aObj of havePermissions) {
            for (const bObj of this.form.permissions) {
              if (aObj.permissionId == bObj.id) {
                // 假设比较id属性
                this.form.checkedPermissions.push(bObj);
                break; // 如果只需要第一个匹配项
              }
            }
          }
          // console.log("已选权限", this.form.checkedPermissions);
        } else {
          // 如果后端返回了错误码（非200）
          this.$message.error("获取角色信息失败！");
          throw new Error(res.message);
        }
      } catch (error) {
        // 请求失败时的处理
        console.error("获取当前角色信息请求出错:", error);
        this.$message.error("获取当前角色信息请求失败，请检查网络或稍后再试");
      }
    },
    async confirmUpdateRole() {
      this.dialogUpdateRoleVisible = false;
      //收集要提交的数据
      // console.log("编辑角色的数据", this.form);
      const roleId = this.form.roleId;
      let arr = [];
      for (var p in this.form.checkedPermissions) {
        // console.log(this.form.checkedPermissions[p]);
        arr.push(this.form.checkedPermissions[p].id);
      }
      const str = arr.join(); // 默认用逗号连接
      // console.log(str);
      try {
        let res = await updateRole(roleId, str);
        // console.log("确认按钮",res)
        if (res.code == 200) {
          this.$message({
            message: "角色修改操作成功！",
            type: "success",
          });
        } else {
          // 如果后端返回了错误码（非200）
          this.$message.error("编辑操作失败！");
          throw new Error(res.message);
        }
      } catch (error) {
        // 请求失败时的处理
        console.error("编辑当前角色信息请求出错:", error);
        this.$message.error("编辑请求失败，请检查网络或稍后再试");
      }
      this.resetForm();
      this.getAllRoles();
    },
    cancelUpdateRole() {
      this.dialogUpdateRoleVisible = false;
      this.resetForm();
    },
    //删出角色
    async deleteRole(row, index) {
      // console.log(row, index);
      try {
        let res = await deleteRoleById(row.roleId);
        if (res.code == 200) {
          this.$message({
            message: "角色删除操作成功！",
            type: "success",
          });
        } else {
          this.$message.error("删除操作失败！");
          throw new Error(res.message);
        }
      } catch (error) {
        console.error("删除角色请求出错:", error);
        this.$message.error("删除角色请求失败，请检查网络或稍后再试");
      }
      this.getAllRoles();
    },
    handleConfirm(event) {
      console.log("事件对象:", event);
    },
    handleSizeChange(size) {
      this.limit = size;
      this.getAllRoles();
    },
    handleCurrentChange(index) {
      this.curPage = index;
      this.getAllRoles();
    },
  },
};
</script>

<style>
.tag-container {
  display: flex; /* 启用 Flex 布局 */
  flex-wrap: wrap; /* 允许换行 */
  gap: 12px; /* 标签间距（包括水平和垂直） */
}
</style>