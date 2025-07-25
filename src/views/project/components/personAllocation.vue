<template>
  <div>
    <div v-if="roleName==='分公司管理员'">
      <!--头部-->
      <div style="margin: 1em">
        <el-row>
          <el-col :span="24">
            <el-form ref="form" :model="form" label-width="170px">
              <el-row>
                <el-col :span="4">
                  <el-form-item label="项目号">{{ project.projectInnerCode }}</el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="项目名称">{{ project.projectName }}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="类别">
                    <el-select
                      v-model="roleSelect"
                      placeholder="请选择"
                      value=""
                      @change="changeXiang()"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.roleId"
                        :label="item.roleName"
                        :value="item.roleName"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <!--搜索栏--->
                  <el-input
                    v-model="tempSearch"
                    placeholder="请输入搜索内容"
                    style="width:70%"
                    @keyup.enter.native="handleSearch"
                  />
                  <el-button type="primary" style="width: 30%" @click="handleSearch">搜索</el-button>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <el-button-group style="display: flex;margin-bottom: 1em">
        <el-button type="primary" style="margin-right: 1em" @click="addPeople">添加</el-button>
        <el-upload
          ref="upload"
          class="imp-button"
          :action="aaa"
          :on-change="importProject"
          name="excelFile"
          multiple
          :show-file-list="false"
          :auto-upload="false"
        >
          <el-button type="warning">导入</el-button>
        </el-upload>
      </el-button-group>
      <div>
        <!-- 表格 -->
        <el-table
          :data="currentPageData"
          style="width: 100%"
          border
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        >
          <el-table-column
            prop="realname"
            label="姓名"
            align="center"
          />
          <el-table-column
            prop="roleName"
            label="角色"
            align="center"
          />
          <el-table-column
            prop="companyName"
            label="所属单位"
            align="center"
          />
          <el-table-column prop="prop" label="操作" align="center">
            <template v-slot="scope">
              <el-button
                type="info"
                size="mini"
                @click="lookUser(scope)"
              >查看
              </el-button>
              <el-button
                type="danger"
                size="mini"
                @click="deleteBatch(scope)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          style="margin-top:20px; text-align:center"
          :current-page="currentPage"
          :page-sizes="[10, 15, 20]"
          layout="prev, pager, next,jumper,->,sizes,total"
          :total="totalData"
          :page-size="limit"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <!--弹窗-->
      <AllocationDialog
        :looks="looks"
        :look-id="lookId"
        :project="project"
        :is-zong-gong="isZongGong"
        :person-list="personList"
        @savePeople="savePeople"
      />
    </div>
    <div v-else class="container">
      <el-row :gutter="10" class="full-height-row">
        <el-col :span="6" class="full-height-col">
          <el-card shadow="hover" class="full-height-card">
            <div>
              <el-tree
                ref="tree"
                :data="treeData"
                :props="defaultProps"
                node-key="id"
                show-checkbox
                default-expand-all
                @node-click="hangleNodeClick"
              />
            </div>
          </el-card>
        </el-col>
        <el-col :span="18" class="full-height-col">
          <el-card shadow="hover" class="full-height-card">
            <el-button type="primary" @click="addPeople">添加</el-button>
            <!-- 表格 -->
            <el-table
              :data="currentPageData"
              style="width: 100%"
              border
              :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            >
              <el-table-column
                prop="realname"
                label="姓名"
                align="center"
              />
              <el-table-column
                prop="roleName"
                label="角色"
                align="center"
              />
              <el-table-column
                prop="companyName"
                label="所属单位"
                align="center"
              />
              <el-table-column prop="prop" label="操作" align="center">
                <template v-slot="scope">
                  <el-button
                    type="info"
                    size="mini"
                    @click="lookUser(scope)"
                  >查看
                  </el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    @click="deleteBatch(scope)"
                  >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="info" @click="back">退出</el-button>
            <!--弹窗-->
            <AllocationDialog
              :looks="looks"
              :look-id="lookId"
              :project="project"
              :is-zong-gong="isZongGong"
              :person-list="personList"
              @savePeople="savePeople"
            />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

import {
  deleteAssignment, getAl1RolesNoPage, getAllRolesNoPage, getPersonInProject,
  postSelectAssignment, putDistribute
} from '@/api/personAllocation'
import { getAllSubprojectsById, getProjectsById } from '@/api/project'
import AllocationDialog from '@/views/project/components/allocationDialog.vue'
import UnitNameItem from '@/views/project/components/unitNameItem.vue'
import ProjectInfo from '@/views/project/components/projectInfo.vue'

export default {
  components: {
    ProjectInfo, UnitNameItem,
    AllocationDialog
  },
  data() {
    return {
      aaa: '',
      projectId: 0, // 当前项目的id
      isZongGong: false, // 当前分项目下是否有总工
      searchData: {
        projectId: this.projectId,
        // projectId: 1,
        realname: '',
        roleName: '',
        page: 1,
        pageSize: 10
      },
      roleSelect: '', // 存下拉框内容
      form: {},
      currentPageData: [],
      personList: [],
      project: {},
      tempSearch: '', // 用于暂存搜索框的内容
      projectName: '', // 项目名称
      currentPage: 1, // 分页器当前页码
      limit: 10, // 每页显示的数据
      totalData: 0, // 总共筛选出的数据条目
      options: [],
      looks: {
        isLook1: false,
        isLook2: false,
        pre: 0
      },
      lookId: '', // 查看用户详情的用户id
      treeData: [
        {
          id: 0,
          subprojectName: '郑州中原保利心语项目',
          disabled: true, // 不可勾选 根节点不能删除
          children: []
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'subprojectName'
      },
      idCounter: 1,
      subprojectId: null// 总工下的分项目id
    }
  },
  computed: {
    // currentPageData() {
    //   let res = this.personList
    //   if (this.searchQuery !== '') {
    //     res = this.personList.filter(item => item.name === this.searchQuery)
    //   }
    //   return res.slice(
    //     (this.currentPage - 1) * this.limit,
    //     this.currentPage * this.limit
    //   )
    // },
    // totalData() { // 总共筛选出的数据条目
    //   return this.personList.length
    // }
    roleName() {
      return this.$route.query.roleName
    }
  },
  watch: {
    searchData: {
      handler() {
        if (this.roleName === '分公司管理员') {
          this.postSelectAssignment()
        }
        this.postSelectAssignment()// ==========================================================
      },
      deep: true
    },
    roleSelect: {
      handler() {
        this.searchData.roleName = this.roleSelect === '空' ? '' : this.roleSelect
      }
    }
  },
  async  created() {
    this.projectId = this.$route.query.id
    this.searchData.projectId = this.projectId

    await this.getProject()
    if (this.roleName === '总工') {
      await this.getAllSubprojectsById()
    } else {
      await this.getAllRolesNoPage()
      await this.postSelectAssignment()
      await this.getPersonInProject()
    }
    console.log(this.roleName)
  },
  methods: {
    async getProject() {
      try {
        const { result } = await getProjectsById(this.projectId)
        console.log('项目详情', result)
        this.treeData[0].subprojectName = result.projectName
        this.companyId = result.companyId
        this.project = result
      } catch (error) {
        console.log(error)
      }
    },
    async getAllRolesNoPage() {
      try {
        const { result } = await getAllRolesNoPage()
        console.log('获取所有角色列表', result)
        this.options = result
        this.options.push({ roleId: '空', roleName: '空' })
      } catch (error) {
        console.log(error)
      }
    },
    async postSelectAssignment() {
      try {
        const { result } = await postSelectAssignment(this.searchData)
        console.log('分配好的人员的条件分页查询', result)
        this.currentPageData = result.list
        this.isZongGong = !!result.list.find(item => item.roleName === '总工')
        this.totalData = parseInt(result.total)
      } catch (error) {
        console.log(error)
      }
    },
    async getPersonInProject() {
      try {
        const { result } = await getPersonInProject(this.projectId)
        console.log('获取某个项目下所有的人员', result)
        this.personList = result
      } catch (error) {
        console.log(error)
      }
    },
    async deleteAssignmentById(id) {
      try {
        const res = await deleteAssignment(id)
        console.log('删除人员', res)
      } catch (error) {
        console.log(error)
      }
    },
    async putDistribute(data) {
      try {
        const res = await putDistribute(data)
        console.log('putDistribute', res)
      } catch (error) {
        console.log(error)
      }
    },
    async getAllSubprojectsById() {
      try {
        const { result } = await getAllSubprojectsById(this.projectId)
        console.log('getAllSubprojectsById', this.projectId, result)
        this.treeData[0].children = result
      } catch (error) {
        console.log(error)
      }
    },
    changeXiang() {
      this.searchData.page = 1
    },
    addPeople() {
      this.looks = {
        isLook1: true,
        isLook2: false,
        pre: 0
      }
    },
    // 退出按钮
    back() {
      this.$router.back()
    },
    importProject(file) {
      const fd = new FormData()
      // if (!this.isCreated && this.isShow === 1) { // 导入项目数据
      //   fd.append('file', file.raw)
      //   this.excelToJSON(fd)
      // } else { // 导入分项目数据
      //   console.log('file', file)
      //   fd.append('file', file.raw)
      //   this.excelToJSONs(fd)
      // }
      // console.log('文件', file)
      console.log('fd', fd)
    },
    // 分页器
    handleSizeChange(val) {
      this.limit = val
      this.searchData.pageSize = val
      console.log(this.limit)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.searchData.page = val
    },
    handleSearch() {
      this.searchData.realname = this.tempSearch
      this.searchData.page = 1
    },
    lookUser(scope) {
      this.looks = {
        isLook1: true,
        isLook2: true,
        pre: 1
      }
      this.lookId = scope.row.userId
    },
    async deleteBatch(scope) {
      if (scope.row.roleName === '总工') {
        this.isZongGong = false
      }
      await this.deleteAssignmentById(scope.row.assignmentId)
      if ((this.totalData - 1) % this.limit === 0) {
        this.currentPage--
        this.searchData.page = Math.max(1, this.currentPage)
      }
      await this.postSelectAssignment()
      await this.getPersonInProject()
    },
    async savePeople(obj) {
      const { option, data, looks } = obj
      // console.log(obj)
      if (option === 2 && looks.pre === 0) {
        this.looks = { // 进入用户查看弹窗
          isLook1: true,
          isLook2: true,
          pre: 0
        }
      } else if (option === 1 && looks.pre === 0) { // 进入人员添加弹窗
        this.looks = {
          isLook1: true,
          isLook2: false,
          pre: 0
        }
      } else {
        this.looks = { // 进入主界面
          isLook1: false,
          isLook2: false,
          pre: 0
        }
      }
      if (option === -1) {
        data.forEach(item => {
          item.projectName = this.project.projectName
          item.projectId = this.project.projectId
        })
        console.log(data, 'data')
        if (data.length > 0) {
          await this.putDistribute(data)
          await this.postSelectAssignment()
          await this.getPersonInProject()
        }
      }
    },
    // 点击树的节点
    hangleNodeClick(node) {
      console.log('点击树的节点', node, this.idCounter)
      if (node.id === 0) return
      this.subprojectId = node.subprojectId
    }
  }
}
</script>

<style scoped>
.title {
  text-align: center;
  font-weight: bold; /* 加粗 */
  font-size: 20px; /* 增大字体 */
}

.app-main-wrapper {
  height: calc(100vh - 100px);
  overflow-y: auto;
}

.container {
  height: 100vh;
  overflow: hidden; /* 防止溢出滚动条 */
}

.full-height-row {
  height: 100%;
}

.full-height-col {
  height: 100%;
}

.full-height-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.app-main-wrapper {
  height: calc(100vh - 100px);
  overflow-y: auto;
}
</style>
