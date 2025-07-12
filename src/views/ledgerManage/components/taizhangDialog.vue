<template>
  <el-dialog
    title="选择试验报告编号"
    :visible="isShow"
    :show-close="false"
    @close="handleClose(2)"
  >
    <el-table v-if="category==='钢筋原材'" :data="currentPageData" style="width: 100%">
      <el-table-column width="30%">
        <template v-slot="scope">
          <el-radio v-model="selectedRow" :label="scope.row" tabindex="-1">
            &nbsp;
          </el-radio>
        </template>
      </el-table-column>
      <!-- 其他列 -->
      <el-table-column prop="usePart" label="工程部位" />
      <el-table-column prop="steelType" label="钢筋种类" />
      <el-table-column prop="representAmount" label="代表批量" />
      <el-table-column prop="producer" label="生产厂家" />
      <el-table-column prop="heatBatchNumber" label="炉批号" />
    </el-table>
    <el-table v-else-if="category==='钢筋机械连接'" :data="currentPageData" style="width: 100%">
      <el-table-column width="30%">
        <template v-slot="scope">
          <el-radio v-model="selectedRow" :label="scope.row" tabindex="-1">
            &nbsp;
          </el-radio>
        </template>
      </el-table-column>
      <!-- 其他列 -->
      <el-table-column prop="usePart" label="工程部位" />
      <el-table-column prop="steelType" label="牌号" />
      <el-table-column prop="diameter" label="直径" />
      <el-table-column prop="connectorLevel" label="等级和接头类型" />
      <el-table-column prop="representAmount" label="代表批量" />
    </el-table>
    <el-table v-else-if="category==='钢筋焊接'" :data="currentPageData" style="width: 100%">
      <el-table-column width="30%">
        <template v-slot="scope">
          <el-radio v-model="selectedRow" :label="scope.row" tabindex="-1">
            &nbsp;
          </el-radio>
        </template>
      </el-table-column>
      <!-- 其他列 -->
      <el-table-column prop="usePart" label="工程部位" />
      <el-table-column prop="steelType" label="钢筋牌号" />
      <el-table-column prop="diameter" label="直径" />
      <el-table-column prop="producer" label="生产厂商" />
      <el-table-column prop="weldType" label="焊接类型" />
      <el-table-column prop="representAmount" label="代表批量" />
    </el-table>
    <el-table v-else :data="currentPageData" style="width: 100%">
      <el-table-column width="30%">
        <template v-slot="scope">
          <el-radio v-model="selectedRow" :label="scope.row" tabindex="-1">
            &nbsp;
          </el-radio>
        </template>
      </el-table-column>
      <!-- 其他列 -->
      <el-table-column prop="usePart" label="使用部位" />
      <el-table-column prop="concreteStrength" label="强度" />
      <el-table-column prop="maintCondition" label="养护类型" />
      <el-table-column prop="representAmount" label="代表批量" />
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose(2)">取 消</el-button>
      <el-button type="primary" @click="handleClose(1)">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getForm, getProjectNameList, getTaiZhang } from '@/api/ocrEntry'
import { getUser } from '@/utils/storage'

export default {
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    category: {
      type: String,
      default: ''
    },
    report_type: {
      type: Number,
      default: 0
    },
    projectSelect: {
      type: String,
      default: ''
    },
    subprojectSelect: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectedRow: null, // 当前选中行
      currentPage: 1, // 分页器数据
      currentPageData: [], // 分页器显示的数据
      limit: 10, // 每页显示的数据
      totalData: 0// 总条数
    }
  },
  created() {
    this.getTaiZhang()
  },
  methods: {
    async getTaiZhang() {
      try {
        console.log('OCR分页查询参数', this.report_type, this.currentPage, this.limit, this.projectSelect, this.subprojectSelect)
        const { result } = await getTaiZhang(this.report_type, this.currentPage, this.limit, this.projectSelect, this.subprojectSelect)
        console.log('OCR分页查询', result)
        this.totalData = parseInt(result.total)
        this.currentPageData = result.records
      } catch (error) {
        console.log(error)
        this.$message.error('出错啦，请稍后重试！')
      }
    },
    changeProject(val) {
      console.log(val)
    },
    handleClose(op) {
      let data = null
      if (op === 1) {
        data = this.selectedRow
      }
      this.$emit('save', data)
    },
    handleSizeChange(val) {
      this.limit = val
      this.getTaiZhang()
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getTaiZhang()
      console.log(`当前页: ${val}`)
    }
  }
}
</script>
<style scoped>

</style>
