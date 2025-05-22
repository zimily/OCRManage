<template>
  <!-- 人员添加弹窗 -->
  <el-dialog v-if="dialogVisible1&&!dialogVisible2" :visible.sync="dialogVisible1" title="人员添加" width="60%">
    <div>
      <el-row>
        <el-col :span="24">
          <el-form ref="form" :model="form" label-width="170px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="类别">
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
                </el-form-item>
              </el-col>
              <el-col :span="12">
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
      <el-table :data="currentPageData" stripe style="width: 100%">
        <el-table-column prop="selection" label="选择" width="90">
          <template v-slot="scope">
            <div>
              <el-checkbox
                v-model="scope.row.selection"
                @click.prevent.stop.native="handleListSelectedFn('selection', scope)"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="用户编号" width="180" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="role" label="角色" width="100" />
        <el-table-column prop="phone" label="所属单位" width="180" />
        <el-table-column prop="phone" label="部门" width="180" />
        <el-table-column prop="option" label="操作" width="100">
          <el-button
            type="info"
            size="mini"
            @click="savePeople(2)"
          >查看
          </el-button>
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="savePeople(0)">取 消</el-button>
      <el-button type="primary" @click="savePeople(-1)">确 定</el-button>
    </span>
  </el-dialog>

  <!-- 用户查看弹窗 -->
  <el-dialog v-else-if="dialogVisible1&&dialogVisible2" :visible.sync="dialogVisible2" title="用户查看" width="40%">
    <div>
      <el-row>
        <el-col :span="24">
          <el-form label-width="120px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="用户姓名">{{ '张三' }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属项目">{{ '龙湖小区建设项目' }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="用户编号">{{ '13adad45sda' }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="角色">{{ '总工' }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="所属单位">{{ '中建五局A公司甲分公司' }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="部门">{{ '工程部' }}</el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="savePeople(1)">取 消</el-button>
      <el-button type="primary" @click="savePeople(1)">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getPerson, getProject } from '@/api/personAllocation'
import { getProjectsById } from '@/api/project'

export default {
  props: {
    looks: {
      type: Object,
      default: () => {
        return {
          isLook1: false,
          isLook2: false,
          option: 'add'
        }
      }
    }
  },
  data() {
    return {
      form: {},
      tempSearch: '',
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
      ],
      tableData: [
        {
          name: '张三',
          role: '总工',
          phone: '0',
          selection: false
        },
        {
          name: '李四',
          role: '采集员',
          phone: '1',
          selection: false
        },
        {
          name: '王五',
          role: '总工',
          phone: '2',
          selection: false
        },
        {
          name: '赵六',
          role: '分析员',
          phone: '3',
          selection: false
        }
      ],
      ZGongIndex: -1, // 总工的索引
      selection: false,
      currentPage: 1, // 分页器数据
      currentPageData: [], // 分页器显示的数据
      limit: 10, // 每页显示的数据
      totalData: 0, // 总共筛选出的数据条目
      dialogVisible1: false, // 人员添加弹窗
      dialogVisible2: false// 用户查看弹窗
    }
  },
  watch: {
    looks: {
      handler(newVal, oldVal) {
        this.dialogVisible1 = newVal.isLook1
        this.dialogVisible2 = newVal.isLook2
      },
      deep: true
    }
  },
  async created() {
    try {
      const { result } = await getPerson(id)
      this.personList = result
      this.project = data.result

      console.log('getPerson', result)
    } catch (error) {
      console.log(error)
    }

    this.changeCurrentPageData()
  },
  methods: {
    changeXiang() {

    },
    handleSearch() {},
    savePeople(option) {
      const obj = { option: option, data: this.tableData, looks: this.looks }
      this.$emit('savePeople', obj)
    },
    // 点击table列表内的选择框
    handleListSelectedFn(selectionvalue, scope) {
      // 跟据分页器计算当前条的实际下标
      const index = scope.$index + this.limit * (this.currentPage - 1)

      if (this.ZGongIndex === index) {
        this.ZGongIndex = -1
      } else if (this.ZGongIndex !== -1 && scope.row.role === '总工') { // 选中了当前总工
        this.$message({
          message: '已有一个总工',
          type: 'warning'
        })
        return
      } else if (this.ZGongIndex === -1 && scope.row.role === '总工') {
        this.ZGongIndex = index
      }
      // table列表内选择框状态改变
      // console.log(scope)
      this.tableData[index][selectionvalue] = !this.tableData[index][selectionvalue]
    },
    handleSizeChange(val) {
      this.limit = val
      console.log(`每页 ${val} 条`)
      this.changeCurrentPageData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      console.log(`当前页: ${val}`)
      this.changeCurrentPageData()
    },
    changeCurrentPageData() {
      let res = this.tableData
      if (this.tempSearch !== '') {
        res = this.tableData.filter(item => item.name === this.tableData)
      }
      this.totalData = res.length
      this.currentPageData = res.slice(
        (this.currentPage - 1) * this.limit,
        this.currentPage * this.limit
      )
    }
  }
}
</script>

<style>

</style>
