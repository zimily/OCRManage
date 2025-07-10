<template>
  <!-- 人员添加弹窗 -->
  <el-dialog
    v-if="dialogVisible1&&!dialogVisible2"
    :show-close="false"
    :visible.sync="dialogVisible1"
    title="人员添加"
    width="60%"
  >
    <div>
      <el-row>
        <el-col :span="24">
          <el-form ref="form" :model="form" label-width="170px">
            <el-row>
              <el-col :span="12">
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
      <el-table :data="currentPageData" style="width: 100%" :row-class-name="isEnableClass">
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
        <el-table-column prop="userId" label="用户编号" width="180" />
        <el-table-column prop="realname" label="姓名" width="100" />
        <el-table-column prop="roleName" label="角色" width="100" />
        <el-table-column prop="companyName" label="所属单位" width="180" />
        <el-table-column prop="pkDeptdoc" label="部门" width="180" />
        <el-table-column v-slot="scope" prop="option" label="操作" width="100">
          <el-button
            type="info"
            size="mini"
            @click="savePeople(2,scope)"
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
  <el-dialog
    v-else-if="dialogVisible1&&dialogVisible2"
    :show-close="false"
    :visible.sync="dialogVisible2"
    title="用户查看"
    width="40%"
  >
    <div>
      <el-row>
        <el-col :span="24">
          <el-form label-width="120px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="用户姓名">{{ userDetail.realname }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属项目">{{ userDetail.projectName }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="用户编号">{{ userDetail.psncode }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="角色">{{ userDetail.roleName }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="所属单位">{{ userDetail.companyName }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="部门">{{ userDetail.deptName }}</el-form-item>
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
import { getAssignDetailById, getPerson, putDistribute } from '@/api/personAllocation'
import user from '../../../store/modules/user'
import ca from 'element-ui/src/locale/lang/ca'
import { getUser } from '@/utils/storage'

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
    },
    lookId: {
      type: Number,
      default: 0
    },
    isZongGong: {
      type: Boolean,
      default: false
    },
    personList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      roleSelect: '', // 存下拉框内容
      form: {},
      tempSearch: '',
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
      tableData: [], // 全部用户数据
      ZGongId: -1, // 总工的ID
      selection: false,
      currentPage: 1, // 分页器数据
      currentPageData: [], // 分页器显示的数据
      limit: 10, // 每页显示的数据
      dialogVisible1: false, // 人员添加弹窗
      dialogVisible2: false, // 用户查看弹窗
      lookDetailId: 0, //  查看用户详情的用户id
      userDetail: {}// 用户细节
    }
  },
  computed: {
    user() {
      return user
    },
    totalData() { // 总共筛选出的数据条目
      return this.tableData.length
    }
  },
  watch: {
    looks: {
      handler(newVal, oldVal) {
        this.dialogVisible1 = newVal.isLook1
        this.dialogVisible2 = newVal.isLook2
      },
      deep: true
    },
    lookId: {
      handler(newVal) {
        this.lookDetailId = newVal
      }
    },
    lookDetailId: {
      handler(newVal) {
        this.getAssignDetailById()
      }
    },
    roleSelect: {
      handler(newVal) {
        this.changeCurrentPageData()
      }
    }
  },
  created() {
    this.getPersons()
  },
  methods: {
    //  获取人员列表
    async getPersons() {
      try {
        this.tableData = []
        const user = getUser()
        console.log('getUser', user.userId)
        const { result } = await getPerson(user.userId)
        // this.tableData = result
        for (let i = 0; i < result.length; i++) {
          this.tableData.push({
            certid: result[i].certid,
            companyName: result[i].companyName,
            deptname: result[i].deptname,
            email: result[i].email,
            userId: result[i].id,
            isDelete: result[i].isDelete,
            password: result[i].password,
            phone: result[i].phone,
            pkDeptdoc: result[i].pkDeptdoc,
            psncode: result[i].psncode,
            psnscopename: result[i].psnscopename,
            realname: result[i].realname,
            roleName: result[i].roleName,
            userAge: result[i].userAge,
            companyId: result[i].userCompanyId,
            userGender: result[i].userGender,
            username: result[i].userName,
            roleId: result[i].userTypeId,
            projectName: '',
            projectId: '',
            selection: false,
            invalidStatus: 0
          })
          // this.tableData[i].selection = false
        }
        // console.log('tableData', this.tableData)
        // this.changeCurrentPageData()
        console.log('getPerson', result)
        this.changeCurrentPageData()
      } catch (error) {
        console.log(error)
      }
    },
    async getAssignDetailById() {
      try {
        console.log('lookDetailId', this.lookDetailId)
        const { result } = await getAssignDetailById(this.lookDetailId)
        if (result && result.length) {
          this.userDetail = result[0]
          if (result.length > 1) {
            for (let i = 1; i < result.length; i++) {
              this.userDetail.projectName += `, ${result[i].projectName}`
            }
          }
        } else {
          this.userDetail = {
            realname: '',
            projectName: '',
            psncode: '',
            roleName: '',
            companyName: '',
            deptName: ''
          }
        }
        console.log('getAssignDetailById', this.lookDetailId, result)
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
    handleSearch() {
      this.changeCurrentPageData()
    },
    savePeople(option, scope) {
      if (scope) {
        this.lookDetailId = scope.row.userId
      }
      const obj = { option: option, data: this.tableData.filter(item => item.selection === true), looks: this.looks }
      this.$emit('savePeople', obj)
      if (option === 0 || option === -1) {
        this.tableData.forEach(item => {
          item.selection = false
        })
      }
    },
    // 点击table列表内的选择框
    handleListSelectedFn(selectionvalue, scope) {
      // 跟据分页器计算当前条的实际下标
      const index = scope.$index + this.limit * (this.currentPage - 1)
      const userId = scope.row.userId
      // console.log(scope)
      if (this.personList.find(item => item.userId === userId)) {
        return
      }
      if (this.isZongGong && scope.row.roleName === '总工') {
        this.$message({
          message: '分项目下已有一个总工，请先删除',
          type: 'warning'
        })
        return
      }
      if (this.ZGongId === userId) {
        this.ZGongId = -1
      } else if (this.ZGongId !== -1 && scope.row.roleName === '总工') { // 选中了当前总工
        this.$message({
          message: '已有一个总工',
          type: 'warning'
        })
        return
      } else if (this.ZGongId === -1 && scope.row.roleName === '总工') {
        this.ZGongId = userId
      }
      this.tableData[index][selectionvalue] = !this.tableData[index][selectionvalue]
    },
    handleSizeChange(val) {
      this.limit = val
      console.log(`每页 ${val} 条`)
      // this.changeCurrentPageData()
      this.changeCurrentPageData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      console.log(`当前页: ${val}`)
      // this.changeCurrentPageData()
      this.changeCurrentPageData()
    },
    changeCurrentPageData() {
      let res = this.tableData
      if (this.tempSearch !== '') {
        res = this.tableData.filter(item => !!item.realname.includes(this.tempSearch))
      }
      if (this.roleSelect !== '' && this.roleSelect !== '空') {
        res = res.filter(item => item.roleName === this.roleSelect)
      }
      // console.log('changeCurrentPageData', res)
      this.currentPageData = res.slice(
        (this.currentPage - 1) * this.limit,
        this.currentPage * this.limit
      )

      console.log('currentPageData', this.currentPageData)
    },
    // 改变行样式，如果人员在分项目里，就改变该行样式
    isEnableClass({ row, index }) {
      if (this.personList.find(item => item.userId === row.userId)) {
        return 'info-row'
      }
    }
  }
}
</script>

<style scoped>
.el-table .info-row {
  background-color: #c5c1c1;
}
</style>
