<template>
  <div>
    <div>
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
                        :key="item.value"
                        :label="item.label"
                        :value="item.label"
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
      <el-button type="primary" style="margin-bottom: 1em" @click="addPeople">添加</el-button>
      <div>
        <!-- 表格 -->
        <el-table
          :data="personList"
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
  </div>
</template>

<script>

import {
  deleteAssignment,
  postSelectAssignment, putDistribute
} from '@/api/personAllocation'
import { getProjectsById } from '@/api/project'
import AllocationDialog from '@/views/project/components/allocationDialog.vue'

export default {
  components: {
    AllocationDialog
  },
  data() {
    return {
      projectId: 0, // 当前项目的id
      isZongGong: false, // 当前分项目下是否有总工
      searchData: {
        projectId: this.projectId,
        // projectId: 1,
        username: '',
        roleName: '',
        page: 1,
        pageSize: 10
      },
      roleSelect: '', // 存下拉框内容
      form: {},
      personList: [],
      project: {},
      tempSearch: '', // 用于暂存搜索框的内容
      projectName: '', // 项目名称
      currentPage: 1, // 分页器当前页码
      limit: 10, // 每页显示的数据
      totalData: 0, // 总共筛选出的数据条目
      options: [
        {
          value: 1,
          label: '总工'
        },
        {
          value: 2,
          label: '资料员'
        },
        {
          value: 3,
          label: '台账采集员'
        },
        {
          value: 4,
          label: '空'
        }
      ],
      looks: {
        isLook1: false,
        isLook2: false,
        pre: 0
      },
      lookId: 0// 查看用户详情的用户id
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
  },
  watch: {
    searchData: {
      handler() {
        this.postSelectAssignment()
      },
      deep: true
    },
    roleSelect: {
      handler() {
        this.searchData.roleName = this.roleSelect === '空' ? '' : this.roleSelect
      }
    }
  },
  created() {
    console.log('人员分配的类别筛选写死，后期看看')
    this.projectId = this.$route.query.id
    this.searchData.projectId = this.projectId

    this.getProject()
    this.postSelectAssignment()
  },
  methods: {
    async getProject() {
      try {
        const { result } = await getProjectsById(this.projectId)
        console.log('项目详情', result)
        this.companyId = result.companyId
        this.project = result
      } catch (error) {
        console.log(error)
      }
    },
    async postSelectAssignment() {
      try {
        console.log('searchData', this.searchData)
        const { result } = await postSelectAssignment(this.searchData)
        // console.log('分配好的人员的条件分页查询', result)
        this.personList = result.list
        this.isZongGong = !!result.list.find(item => item.roleName === '总工')
        this.totalData = result.total
      } catch (error) {
        console.log(error)
      }
    },
    async deleteAssignmentById(id) {
      try {
        const res = await deleteAssignment(id)
        console.log(res)
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
    changeXiang() {

    },
    addPeople() {
      this.looks = {
        isLook1: true,
        isLook2: false,
        pre: 0
      }
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
      this.searchData.username = this.tempSearch
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
      await this.postSelectAssignment()
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
        }
      }
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
</style>
