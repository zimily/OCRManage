<template>
  <!-- 人员添加弹窗 -->
  <el-dialog v-if="dialogVisible&&!dialogVisible2" :visible.sync="dialogVisible" title="人员添加" width="60%">
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
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="selection" label="选择" width="90">
          <template v-slot="scope">
            <div>
              <el-checkbox
                v-model="scope.row.selection"
                @click.prevent.stop.native="handleListSelectedFn('selection', 'isIndeterminate', scope)"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="用户编号" width="180" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="address" label="角色" width="100" />
        <el-table-column prop="phone" label="所属单位" width="180" />
        <el-table-column prop="phone" label="部门" width="180" />
        <el-table-column prop="isRight" label="操作" width="100">
          <el-button
            type="info"
            size="mini"
            @click="dialogVisible2=true"
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
      <el-button @click="savePeople(-1)">取 消</el-button>
      <el-button type="primary" @click="savePeople">确 定</el-button>
    </span>
  </el-dialog>

  <!-- 用户查看弹窗 -->
  <el-dialog v-else-if="dialogVisible&&dialogVisible2" :visible.sync="dialogVisible2" title="用户查看" width="40%">
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
      <el-button @click="dialogVisible2 = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
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
          address: '3',
          phone: '1',
          selection: false,
          pass: false
        },
        {
          name: '李四',
          address: '3',
          phone: '1',
          selection: false,
          pass: false
        },
        {
          name: '王五',
          address: '3',
          phone: '1',
          selection: false,
          pass: false
        },
        {
          name: '赵六',
          address: '3',
          phone: '1',
          selection: false,
          pass: false
        }
      ],
      pass: false,
      selection: false,
      isIndeterminate: false,
      isIndeterminate1: false,
      currentPage: 1, // 分页器数据
      limit: 10, // 每页显示的数据
      totalData: 0, // 总共筛选出的数据条目
      dialogVisible2: false// 用户查看弹窗
    }
  },
  methods: {
    changeXiang() {

    },
    handleSearch() {},
    savePeople(option) {
      if (option !== -1) {
        console.log('保存数据的步骤')
      }
      this.$emit('savePeople', this.tableData)
    },
    handleListSelectedFn(selectionvalue, isIndeterminatevalue, scope) { // 点击table列表内的选择框
      // table列表内选择框状态改变
      this.tableData[scope.$index][selectionvalue] = !this.tableData[scope.$index][selectionvalue]
      // 判断是否在全选状态下
      const statusSelectio = this.allSelectionFn(selectionvalue)
      if (statusSelectio) {
        // 列表全部被选中,头部变更为选中状态
        this[selectionvalue] = true
        this[isIndeterminatevalue] = false
        return false
      }
      // 列表有选中且非全选，头部全选框待定状态
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i][selectionvalue] === true) {
          this[isIndeterminatevalue] = true
          return false
        }
      }
      // 列表有没有选中，头部全选框未选状态
      this[isIndeterminatevalue] = false
      this[selectionvalue] = false
    },
    allSelectionFn(selectionvalue) { // 判断是否在全选状态下
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i][selectionvalue] !== true) {
          return false
        }
      }
      return true
    },
    handleSizeChange(val) {
      this.limit = val
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style>

</style>
