<template>
  <div class="report-container">
    <router-view />

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="检验批验收记录" name="1">检验批验收记录</el-tab-pane>
      <!--      <el-tab-pane label="隐蔽验收记录" name="2">隐蔽验收记录</el-tab-pane>
            <el-tab-pane label="分部验收记录" name="3">分部验收记录</el-tab-pane>
            <el-tab-pane label="分项验收记录" name="4">分项验收记录</el-tab-pane>
            <el-tab-pane label="台账" name="5">台账</el-tab-pane>
            <el-tab-pane label="混凝土测温记录" name="6">混凝土测温记录</el-tab-pane>
            <el-tab-pane label="混凝土强度离散度" name="7">混凝土强度离散度</el-tab-pane>-->
    </el-tabs>
    <!--这是搜索框-->

    <div id="searchForm" style="display: flex; justify-content: flex-end; align-items: center">
      <span style="line-height: 100%">请输入检验批部位：</span>
      <el-input v-model="inspectPart" placeholder="请输入检验批部位进行检索" style="width: 300px" />
      <el-button type="primary" style="margin-left: 10px" @click="search">搜索</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="currentPageData"
      stripe
      style="width: 100%; margin-top: 15px"
      @selection-change="handleSelectionChange"
    >

      <!-- 第一列：多选框 -->
      <el-table-column type="selection" width="55" />
      <!-- 第二列：编号 -->
      <el-table-column label="编号" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 + (currentPage - 1) * pageSize }}
        </template>
      </el-table-column>

      <!-- 固定列：项目名称、单位工程 -->
      <el-table-column prop="projectName" label="项目名称" align="center" />
      <el-table-column prop="subprojectName" label="单位工程" align="center" />
      <el-table-column prop="inspectPart" label="检验批部位" align="center" />
      <el-table-column prop="finishDate" label="验收日期" align="center" />

      <!-- 最后一列：操作按钮 -->
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="primary" @click="handlePreview(scope.row)">
            预览
          </el-button>
          <el-button type="warning" @click="handleExport(scope.row)">
            导出
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="currentPage"
      :page-sizes="[10, 15, 20]"
      :page-size="pageSize"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="totalData"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
// 仓库提交测试。
import current from 'element-ui/packages/table/src/store/current'
import { search } from '@/api/statementManage'

export default {
  data() {
    return {
      responseData:
        [
          {
            projectName: '测试',
            subprojectName: '测试',
            inspectPart: '测试检验批',
            finishDate: '2005-05-01',
            taskId: '1',

          }
        ],
      currentPage: 1,
      pageSize: 10,
      totalData: 100,
      activeName: '1',
      inspectPart: '',
      currentPageData: []
    }
  },
  computed: {

    mounted(){
      console.log(`current:${this.current}  size:${ this.size }   total:${ this.total }`)
    }

  },
  methods: {
    // 搜索
    async search() {
      // 首先判断输入是否合法！
      // 好像都可以。。。那就不管了
      console.log(this.inspectPart + "    " + this.currentPage + "   " + this.pageSize)
      // 点击search之后，首先需要发送请求，拿到数据
      const { result } = await search(this.inspectPart, this.currentPage, this.pageSize)
      console.log('条件分页查询result：' + JSON.stringify(result))
      this.currentPageData = result.records
      this.totalData = Number(result.total)
    },
    // 分页大小变化
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.currentPage = 1 // 重置页码
      this.search()
    },
    // 页码变化
    handleCurrentChange(newPage) {
      this.currentPage = newPage
      this.search()
    },
    // 多选框选中变化
    handleSelectionChange(val) {
      console.log('选中的数据:', val)
    },
    // 单行导出
    handleExport(row) {
      console.log('导出单行数据:', row)
      this.$message.success(`正在导出 ${row.projectName} - ${row.unitProject} 的数据`)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handlePreview(row) {
      console.log('<UNK>:', row)
    }
  }
}
</script>

<style scoped>
.report-container {
  padding: 20px;
}

/* 顶部操作区靠右布局 */
.operation-bar {
  margin-bottom: 10px;
}

.flex-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

/* 表格样式优化 */
::v-deep .el-table th {
  background-color: #f5f7fa;
  font-weight: 500;
}

#searchForm {
  margin-top: 20px;
}
</style>
