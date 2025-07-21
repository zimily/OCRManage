<template>
  <div>
    <div style="margin: 1em">
      <el-row :gutter="20">
        <el-col :span="6" :offset="2">
          <div class="left">
            <span style="margin-right:1em">状态</span>
            <el-select v-model="projectState" placeholder="请选择" value="" @change="changeXiang">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </div>
        </el-col>
        <el-col :span="6" :offset="8">
          <div class="right">
            <el-input
              v-model="searchQuery"
              placeholder="请输入搜索内容"
              style="width: 20em; margin-right: 1em"
              @click="handleSearch"
              @keyup.enter.native="handleSearch"
            />
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <div>
      <el-table :data="currentPageData" style="width: 100%" border>
        <el-table-column
          label="项目号"
          prop="projectInnerCode"
          align="center"
          width="150"
        />
        <el-table-column label="项目名称" prop="projectName" align="center" min-width="200" />
        <el-table-column
          label="所属单位"
          prop="shigongCompanyName"
          min-width="200"
          align="center"
        />
        <el-table-column label="状态" width="200" align="center">
          <template v-slot="scope">
            <span v-if="scope.row.isCreated">已创建</span>
            <span v-else>待创建</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="prop" width="400" align="center">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-user"
              size="mini"
              :disabled="roleName === '总工'"
              @click="allocation(scope)"
            >人员分配
            </el-button>
            <el-button
              type="info"
              icon="el-icon-view"
              size="mini"
              :disabled="!scope.row.isCreated"
              @click="lookProject(scope)"
            >查看
            </el-button>
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="updateproject(scope)"
            >编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        style="margin-top: 20px; text-align: center"
        :current-page="currentPage"
        :page-sizes="[10, 15, 20]"
        :page-size="limit"
        layout=" prev, pager, next, jumper,->,sizes,total"
        :total="totalData"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getProjects } from '@/api/project'
import user from '@/store/modules/user'
import { getRoleById, getUserById } from '@/api/authority'
import { getUser, getUserId } from '@/utils/storage'
import { getPersonInProject } from '@/api/personAllocation'

export default {
  data() {
    return {
      roleName: '',
      tempTotal: 0, // 暂存人员分配数据总条数
      projectState: '', // 存下拉框内容
      searchQuery: '', // 用于存储输入框的内容
      finalSearchQuery: '', // 用于存储输入框最终的内容
      info: [],
      currentPage: 1, // 分页器数据
      limit: 10, // 每页显示的数据
      totalData: 0, // 总共筛选出的数据条目
      options: [
        {
          value: 1,
          label: '待创建'
        },
        {
          value: 2,
          label: '已创建'
        },
        {
          value: 3,
          label: '空'
        }
      ]
    }
  },
  computed: {
    currentPageData() {
      let res = this.info
      if (this.finalSearchQuery !== '') {
        res = this.info.filter((item) => !!item.projectName.includes(this.finalSearchQuery))
      }
      if (this.projectState !== '空' && this.projectState !== '') {
        const state = this.projectState !== '待创建'
        res = res.filter((item) => item.isCreated === state)
      }
      this.totalData = res.length
      return res.slice(
        (this.currentPage - 1) * this.limit,
        this.currentPage * this.limit
      )
    }
  },
  async created() {
    await this.getProjects()
    await this.getRoleById()
    this.chakan = false
  },
  methods: {
    changeXiang() {
    },
    async getProjects() {
      try {
        const { result } = await getProjects()
        console.log('项目信息', result)
        this.info = result
      } catch (error) {
        console.log(error)
      }
    },
    async getRoleById() {
      try {
        const { result } = await getUserById(getUserId())
        console.log('当前用户职位', result)
        this.roleName = result[0].roleName
      } catch (error) {
        console.log(error)
      }
    },
    // 编辑按钮
    updateproject(scope) {
      console.log('点击项目编辑', scope, scope.row)
      console.log(scope)
      this.$router.push({
        path: '/menus/project/projectEdit',
        query: { projectId: scope.row.projectId, chakan: 'false' }
      })
    },
    lookProject(scope) {
      this.$router.push({
        path: '/menus/project/projectEdit',
        query: { projectId: scope.row.projectId, chakan: 'true' }
      })
    },
    // 搜索事件
    handleSearch() {
      console.log('搜索内容:', this.searchQuery)
      this.finalSearchQuery = this.searchQuery
    },
    // 分页器
    handleSizeChange(val) {
      this.limit = val
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      console.log(`当前页: ${val}`)
    },
    headerCellClassName({ column }) {
      return 'header-cell-highlight' // 返回自定义的类名
    },
    // 人员分配
    allocation(scope) {
      console.log('人员分配', scope.row)
      // 注意params/query传参的时候，params-name/query-path  路径的内容是不同，对应于路由中的name,path属性，注意区分大小写
      this.$router.push({
        name: 'PersonAllocation',
        query: {
          id: scope.row.projectId
        }
      })
    }
  }
}
</script>

<style>
.app-main-wrapper {
  height: calc(100vh - 100px);
  overflow-y: auto;
}

.left {
  display: flex;
  align-items: center;
  padding: 0.5em;
}

.right {
  display: flex;
  align-items: center;
  padding: 0.5em;
}
</stylesc>
