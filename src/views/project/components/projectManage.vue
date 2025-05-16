<template>
  <div>
    <div style="margin: 1em">
      <el-row>
        <el-col :span="24">
          <el-row>
            <el-col :span="12" style="margin-left: 20em">{{ '类别' }}
              <el-select
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
            </el-col>
            <el-col :span="6">
              <el-input
                v-model="searchQuery"
                placeholder="请输入搜索内容"
                style="width: 300px; margin-right: 10px"
              />
              <el-button type="primary" @click="handleSearch">搜索</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <div>
      <el-table :data="currentPageData" style="width: 100%" border>
        <el-table-column
          label="项目号"
          prop="companyId"
          align="center"
        />
        <el-table-column
          label="项目名称"
          prop="projectName"
          align="center"
        />
        <el-table-column
          label="所属单位"
          prop="shigongCompanyName"
          width="200"
          align="center"
        />
        <el-table-column
          label="状态"
          width="200"
          align="center"
        >
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
              @click="allocation(scope)"
            >人员分配</el-button>
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="updateproject(scope)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteProject(scope)"
            >删除</el-button>
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
export default {

  data() {
    return {
      searchQuery: '', // 用于存储输入框的内容
      info: [],
      currentPage: 1, // 分页器数据
      limit: 10, // 每页显示的数据
      totalData: 0, // 总共筛选出的数据条目
      options: [
        {
          value: 1,
          label: '黄金糕'
        },
        {
          value: 2,
          label: '双皮奶'
        },
        {
          value: 3,
          label: '蚵仔煎'
        }
      ]
    }
  },
  computed: {
    currentPageData() {
      let res = this.info
      if (this.searchQuery !== '') {
        res = this.info.filter(item => item.name === this.info)
      }
      this.totalData = res.length
      return res.slice(
        (this.currentPage - 1) * this.limit,
        this.currentPage * this.limit
      )
    }
  },
  async created() {
    try {
      const { result } = await getProjects()
      this.info = result
    } catch (error) {
      console.log(error)
    }
    console.log(this.info)
    const list = JSON.parse(JSON.stringify(this.info))
    for (let i = 0; i < list.length; i++) {
      this.info.push(list[i])
    }
  },
  methods: {
    changeXiang() {

    },
    // 编辑按钮
    updateproject(scope) {
      console.log('点击项目编辑', scope, scope.$index)
      this.$router.push({
        path: '/menus/project/projectEdit',
        query: { index: scope.$index }
      })
    },
    // 搜索事件
    handleSearch() {
      console.log('搜索内容:', this.searchQuery)
    },
    // 分页器
    handleSizeChange(val) {
      this.limit = val
      console.log(`每页 ${val} 条`)

      console.log(this.currentPage)
      console.log(this.limit)
      console.log(this.totalData)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      console.log(`当前页: ${val}`)

      console.log(this.currentPage)
      console.log(this.limit)
      console.log(this.totalData)
    },
    headerCellClassName({ column }) {
      return 'header-cell-highlight' // 返回自定义的类名
    },
    // 人员分配
    allocation(scope) {
      console.log('人员分配', scope.row.name)
      // 注意params/query传参的时候，params-name/query-path  路径的内容是不同，对应于路由中的name,path属性，注意区分大小写
      this.$router.push({
        name: 'PersonAllocation',
        params: {
          id: scope.row.projectId
        }
      })
    }
  }
}
</script>

<style>
</style>
