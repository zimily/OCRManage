<template>
  <div class="report-container">
    <router-view/>

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="检验批验收记录" name="1">检验批验收记录</el-tab-pane>
      <el-tab-pane label="隐蔽验收记录" name="2">隐蔽验收记录</el-tab-pane>
      <el-tab-pane label="分部验收记录" name="3">分部验收记录</el-tab-pane>
      <el-tab-pane label="分项验收记录" name="4">分项验收记录</el-tab-pane>
      <el-tab-pane label="台账" name="5">台账</el-tab-pane>
      <el-tab-pane label="混凝土测温记录" name="6">混凝土测温记录</el-tab-pane>
      <el-tab-pane label="混凝土强度离散度" name="7">混凝土强度离散度</el-tab-pane>
    </el-tabs>
    <!--检验批验收记录搜索框-->

    <div id="searchForm1" style="display: flex; justify-content: flex-end; align-items: center" v-if="currentTableName === '1' || currentTableName === '2'">
      <span style="line-height: 100%">请输入检验批部位：</span>
      <el-input v-model="inspectPart" placeholder="请输入检验批部位进行检索" style="width: 300px"/>
      <el-button type="primary" style="margin-left: 10px" @click="search">搜索</el-button>
    </div>

    <!-- 检验批验收记录表格 -->   <!-- key是保证dom不残留的关键，这个必须不同 -->
    <el-table
      ref="table1"
      :data="currentPageData"
      :key="'table1' + currentTableName"
      stripe
      style="width: 100%; margin-top: 15px"
      @selection-change="handleSelectionChange"
      v-if="currentTableName === '1'"
    >

      <!-- 第一列：多选框 -->
      <el-table-column type="selection" width="55"/>
      <!-- 第二列：编号 -->
      <el-table-column label="编号" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 + (currentPage - 1) * pageSize }}
        </template>
      </el-table-column>

      <!-- 固定列：项目名称、单位工程 -->
      <el-table-column prop="projectName" label="项目名称" align="center"/>
      <el-table-column prop="subprojectName" label="单位工程" align="center"/>
      <el-table-column prop="inspectPart" label="检验批部位" align="center"/>
      <el-table-column prop="finishDate" label="验收日期" align="center"/>

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

    <!-- 隐蔽验收记录表格 -->
    <el-table
      ref="table2"
      :data="currentPageData"
      :key="'table2' + currentTableName"
      stripe
      style="width: 100%; margin-top: 15px"
      @selection-change="handleSelectionChange"
      v-if="currentTableName === '2'"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="项目号" width="80" align="center" prop="projectId"></el-table-column>
      <el-table-column label="工程名称" prop="projectName" align="center"></el-table-column>
      <el-table-column label="单位工程" prop="danweiProject" align="center"></el-table-column>
      <el-table-column label="检验批部位" prop="inspectPart" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="200px">

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
            taskId: '1'

          }
        ],
      currentPage: 1,           //当前页码
      pageSize: 10,             //页面容量
      totalData: 0,             //总记录条数
      activeName: '1',         //多选框选中的value，默认赋值为1
      inspectPart: '',        //检验批部位，用来搜索
      currentPageData: [],   //这是接收的数据
      currentTableName: '1' //记录当前要展示的表格id
    }
  },
  computed: {},
  methods: {
    // 搜索
    async search() {
      // 首先判断输入是否合法！
      // 好像都可以。。。那就不管了
      console.log(this.inspectPart + '    ' + this.currentPage + '   ' + this.pageSize)
      // 点击search之后，首先需要发送请求，拿到数据
      //todo 需要根据切换表格的不同展示不同的数据，要用到switch-case来进行接口的访问
      switch(this.currentTableName){
        case '1':
          const { result } = await search(this.inspectPart, this.currentPage, this.pageSize)
          this.currentPageData = result.records
          console.log('切换表格后，现在为1表格，看到我说明接口成功请求了')
          break;

        default:
          console.log('switch-case执行了default方法，有地方出错了！！！')
          this.currentPageData = []    //正常是不会这样的
      }
      console.log('条件分页查询result：' + JSON.stringify(result))

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
    //使用多选框展示不同表格，这是切换表格数据展示的关键函数
    handleClick(tab, event) {
      this.currentTableName = tab.name   //这个是因为多选框的value和展示表格的控制变量的值是对应的，value 1 对应 currentTableName 1
      console.log('目前切换的表格为:' + this.currentTableName)

      //初始化表格
      this.currentPageData = []   //确保上一个表格的数据被完全销毁
      this.currentPage = 1
      this.pageSize = 10
      this.search()
    },
    handlePreview(row) {
      console.log('<UNK>:', row)
    }
  },
  mounted() {
    this.search()
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
