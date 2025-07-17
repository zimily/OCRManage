<template>
  <div class="report-container">
    <router-view />

    <!-- 顶部操作区（靠右布局） -->
    <el-row class="operation-bar">
      <el-col :span="24" class="flex-right">
        <span>报表类别</span>
        <el-select
          v-model="selectedReportType"
          placeholder="请选择"
          style="width: 12em; margin-left: 1em; margin-right: 1em"
          size="mini"
        >
          <el-option v-for="item in reportTypes" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <span>检验批部位</span>
        <el-input
          v-model="searchFloorWithInspectPart"
          placeholder=""
          style="width: 12em; margin-left: 1em; margin-right: 1em"
        />

        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="warning" style="margin-left: 10px">批量导出</el-button>
      </el-col>
    </el-row>

    <!-- 动态表格 -->
    <el-table
      ref="multipleTable"
      :data="filteredTableData"
      stripe
      style="width: 100%; margin-top: 15px"
      @selection-change="handleSelectionChange"
    >

      <!-- 第一列：多选框 -->
      <el-table-column type="selection" width="55" />
      <!-- 第二列：编号 -->
      <el-table-column label="编号" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 + (curPage - 1) * limit }}
        </template>
      </el-table-column>

      <!-- 固定列：项目名称、单位工程 -->
      <el-table-column prop="projectName" label="项目名称" align="center" />
      <el-table-column prop="unitProject" label="单位工程" align="center" />

      <!-- 动态列（根据报表类型显示） -->
      <el-table-column
        v-for="column in dynamicColumns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        align="center"
      />

      <!-- 最后一列：操作按钮 -->
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="warning" @click="handleExport(scope.row)">
            导出
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="curPage"
      :page-sizes="[10, 15, 20]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 报表类型
      reportTypes: [
        { value: 'subitem', label: '分项验收记录' },
        { value: 'division', label: '分部验收记录' },
        { value: 'ledger', label: '台账' },
        { value: 'temperature', label: '测温记录' },
        { value: 'concrete', label: '混凝土强度离散度' }
      ],
      selectedReportType: 'subitem', // 当前选中的报表类型
      searchFloorWithInspectPart: '', // 检验批部位搜索值
      curPage: 1, // 当前页码
      limit: 10, // 每页条数

      staticData: {
        subitem: [
          { projectName: '阳光城项目', unitProject: '1号楼', inspectionBatch: '地基与基础', inspectionDate: '2023-05-10', inspector: '张三', status: '合格' },
          { projectName: '阳光城项目', unitProject: '1号楼', inspectionBatch: '主体结构', inspectionDate: '2023-06-15', inspector: '李四', status: '合格' },
          { projectName: '阳光城项目', unitProject: '2号楼', inspectionBatch: '地基与基础', inspectionDate: '2023-05-12', inspector: '王五', status: '合格' },
          { projectName: '阳光城项目', unitProject: '2号楼', inspectionBatch: '主体结构', inspectionDate: '2023-06-20', inspector: '赵六', status: '待验收' },
          { projectName: '幸福家园项目', unitProject: '3号楼', inspectionBatch: '装饰装修', inspectionDate: '2023-07-05', inspector: '钱七', status: '合格' }
        ],
        division: [
          { projectName: '阳光城项目', unitProject: '1号楼', divisionName: '地基与基础分部', startDate: '2023-01-01', endDate: '2023-03-30', leader: '张三' },
          { projectName: '阳光城项目', unitProject: '1号楼', divisionName: '主体结构分部', startDate: '2023-04-01', endDate: '2023-07-30', leader: '李四' },
          { projectName: '幸福家园项目', unitProject: '2号楼', divisionName: '地基与基础分部', startDate: '2023-02-15', endDate: '2023-05-15', leader: '王五' }
        ],
        ledger: [
          { projectName: '阳光城项目', unitProject: '1号楼', materialName: '钢筋HRB400', specification: 'Φ20', batch: 'LP001', quantity: 500 },
          { projectName: '阳光城项目', unitProject: '1号楼', materialName: '钢筋HRB400', specification: 'Φ16', batch: 'LP002', quantity: 300 },
          { projectName: '阳光城项目', unitProject: '2号楼', materialName: '水泥P.O42.5', specification: '袋装', batch: 'SN1001', quantity: 1000 },
          { projectName: '幸福家园项目', unitProject: '3号楼', materialName: '砂子', specification: '中砂', batch: 'SC2001', quantity: 2000 }
        ],
        temperature: [
          { projectName: '阳光城项目', unitProject: '1号楼', location: '基础承台', temperature: '25℃', recordTime: '2023-05-10 08:30', recorder: '张三' },
          { projectName: '阳光城项目', unitProject: '1号楼', location: '基础承台', temperature: '26℃', recordTime: '2023-05-10 14:30', recorder: '张三' },
          { projectName: '阳光城项目', unitProject: '1号楼', location: '框架柱', temperature: '24℃', recordTime: '2023-05-11 08:30', recorder: '李四' },
          { projectName: '幸福家园项目', unitProject: '2号楼', location: '基础承台', temperature: '27℃', recordTime: '2023-06-01 08:30', recorder: '王五' }
        ],
        concrete: [
          { projectName: '阳光城项目', unitProject: '1号楼', batchNumber: 'HN20230501', strengthGrade: 'C30', testDate: '2023-05-10', dispersionDegree: '1.2', status: '合格' },
          { projectName: '阳光城项目', unitProject: '1号楼', batchNumber: 'HN20230601', strengthGrade: 'C40', testDate: '2023-06-15', dispersionDegree: '1.1', status: '合格' },
          { projectName: '幸福家园项目', unitProject: '2号楼', batchNumber: 'HN20230510', strengthGrade: 'C30', testDate: '2023-05-20', dispersionDegree: '1.3', status: '合格' }
        ]
      }
    }
  },
  computed: {
    // 动态列配置（根据报表类型变化）
    dynamicColumns() {
      const columns = {
        subitem: [
          { prop: 'inspectionBatch', label: '检验批', width: 150 },
          { prop: 'inspectionDate', label: '验收日期', width: 150 },
          { prop: 'inspector', label: '验收人', width: 120 },
          { prop: 'status', label: '验收状态', width: 120 }
        ],
        division: [
          { prop: 'divisionName', label: '分部工程名称', width: 180 },
          { prop: 'startDate', label: '开始日期', width: 150 },
          { prop: 'endDate', label: '结束日期', width: 150 },
          { prop: 'leader', label: '负责人', width: 120 }
        ],
        ledger: [
          { prop: 'materialName', label: '材料名称', width: 150 },
          { prop: 'specification', label: '规格型号', width: 150 },
          { prop: 'batch', label: '批次', width: 120 },
          { prop: 'quantity', label: '数量', width: 100 }
        ],
        temperature: [
          { prop: 'location', label: '测温部位', width: 150 },
          { prop: 'temperature', label: '温度值(℃)', width: 120 },
          { prop: 'recordTime', label: '记录时间', width: 180 },
          { prop: 'recorder', label: '记录人', width: 120 }
        ],
        concrete: [
          { prop: 'batchNumber', label: '养护条件', width: 150 },
          { prop: 'strengthGrade', label: '混凝土强度', width: 120 },
          { prop: 'testDate', label: '测试日期', width: 150 },
          { prop: 'dispersionDegree', label: '离散度', width: 120 }
        ]
      }
      return columns[this.selectedReportType] || []
    },
    // 过滤后的表格数据（含搜索和分页）
    filteredTableData() {
      // 获取当前报表类型的死数据
      const baseData = this.staticData[this.selectedReportType] || []

      // 搜索过滤（根据检验批部位）
      const filtered = baseData.filter(item => {
        if (!this.searchFloorWithInspectPart) return true
        // 搜索匹配逻辑：项目名称、单位工程、检验批部位等
        return item.projectName.includes(this.searchFloorWithInspectPart) ||
          item.unitProject.includes(this.searchFloorWithInspectPart) ||
          (item.inspectionBatch && item.inspectionBatch.includes(this.searchFloorWithInspectPart)) ||
          (item.location && item.location.includes(this.searchFloorWithInspectPart))
      })
      // 更新总条数
      this.total = filtered.length

      // 分页处理
      const start = (this.curPage - 1) * this.limit
      const end = start + this.limit
      return filtered.slice(start, end)
    }
  },
  methods: {
    // 搜索
    search() {
      this.curPage = 1 // 重置页码
    },
    // 分页大小变化
    handleSizeChange(newSize) {
      this.limit = newSize
      this.curPage = 1 // 重置页码
    },
    // 页码变化
    handleCurrentChange(newPage) {
      this.curPage = newPage
    },
    // 多选框选中变化
    handleSelectionChange(val) {
      console.log('选中的数据:', val)
    },
    // 单行导出
    handleExport(row) {
      console.log('导出单行数据:', row)
      this.$message.success(`正在导出 ${row.projectName} - ${row.unitProject} 的数据`)
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
</style>
