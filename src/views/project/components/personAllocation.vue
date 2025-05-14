<template>
  <div>
    <div>
      <!--头部-->
        <div class="title">{{projectName}}人员分配</div>
      <div>
        <span class="search-container" style="float: right">
          <!--搜索栏--->
          <el-input
            v-model="tempSearch"
            placeholder="请输入搜索内容"
            style="width: 300px; margin-right: 10px;margin-top: 10px;margin-bottom: 10px"
            @keyup.enter.native="handleSearch"
          />
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </span>
      </div>
      <div>
        <!-- 表格 -->
        <el-table
          :data="currentPageData"
          style="width: 100%"
          border
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        >
          <el-table-column
            prop="name"
            label="姓名"
            align="center"
          />
          <el-table-column
            prop="role"
            label="角色"
            align="center"
          />
          <el-table-column
            prop="affiliation"
            label="所属单位"
            align="center"
          />
          <el-table-column
            prop="projectName"
            label="所属项目"
            align="center"
          />
          <el-table-column prop="prop" label="操作" align="center">
            <template v-slot="scope">
              <el-button
                type="info"
                size="mini"
                @click="deleteBatch(scope)"
              >查看
              </el-button>
              <el-button
                type="warning"
                size="mini"
                @click="updateBatch(scope)"
              >编辑
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
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  data() {
    return {
      searchQuery: '', // 用于存储搜索框的最后内容
      tempSearch: '', // 用于暂存搜索框的内容
      projectName:'',//项目名称  
      currentPage: 1, // 分页器当前页码
      totalData: 0, // 总共筛选出的数据条目
      limit: 10 // 每页显示的数据
    }
  },
  computed: {
    ...mapState('personAllocation', ['personList']),
    currentPageData() {
      let res = this.personList
      if (this.searchQuery !== '') {
        res = this.personList.filter(item => item.name === this.searchQuery)
      }
      this.totalData = res.length
      return res.slice(
        (this.currentPage - 1) * this.limit,
        this.currentPage * this.limit
      )
    }
  },
  created() {
    //接收兄弟组件（项目管理）传递的路由参数   刷新会掉？？？（待解决）
    this.projectName=this.$route.params.name;
    console.log(this.projectName,this.$route.params)
    this.$store.commit('personAllocation/setPersonList')
  },
  methods: {
    // 分页器
    handleSizeChange(val) {
      this.limit = val
      console.log(this.limit)
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleSearch() {
      this.searchQuery = this.tempSearch
    },
    deleteBatch() {

    },
    updateBatch() {

    }
  }
}
</script>

<style>
.title {
  text-align: center;
  font-weight: bold;  /* 加粗 */
  font-size: 20px;    /* 增大字体 */
}
</style>
