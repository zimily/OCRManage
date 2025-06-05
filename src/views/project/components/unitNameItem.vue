<template>
  <div>
    <div>
      <el-row>
        <el-col :span="24">
          <el-form ref="form" :model="subProInfo" label-width="170px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="单位工程名称">
                  <el-input
                    v-model="subProInfo.subprojectName"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="勘察单位项目负责人">
                  <el-input
                    v-model="subProInfo.kanchaDirector"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="施工单位项目负责人">
                  <el-input
                    v-model="subProInfo.shigongDirector"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="监督单位项目负责人">
                  <el-input
                    v-model="subProInfo.jianduDirector"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="建设单位项目负责人">
                  <el-input
                    v-model="subProInfo.jiansheDirector"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="施工面积（m²）">
                  <el-input v-model="subProInfo.area" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="监理单位项目负责人">
                  <el-input
                    v-model="subProInfo.jianliDirector"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目技术负责人">
                  <el-input
                    v-model="subProInfo.technicalDirector"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="设计单位项目负责人">
                  <el-input
                    v-model="subProInfo.shejiDirector"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <hr>
    <div>
      <el-row>
        <el-col :span="24">
          <el-form ref="form" :model="form" label-width="170px">
            <el-row>
              <el-col :span="12">
                <el-form-item v-slot="scope" label="钢筋分项验收依据">
                  <el-select
                    v-model="yanshou_rule1"
                    placeholder="请选择"
                    @change="changeXiang(scope)"
                  >
                    <el-option
                      v-for="item in options[0]"
                      :key="item.label"
                      :label="item.label"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-slot="scope" label="模板分项验收依据">
                  <el-select
                    v-model="yanshou_rule2"
                    placeholder="请选择"
                    @change="changeXiang(scope)"
                  >
                    <el-option
                      v-for="item in options[1]"
                      :key="item.label"
                      :label="item.label"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item v-slot="scope" label="混凝土分项验收依据">
                  <el-select
                    v-model="yanshou_rule3"
                    placeholder="请选择"
                    @change="changeXiang(scope)"
                  >
                    <el-option
                      v-for="item in options[2]"
                      :key="item.label"
                      :label="item.label"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-slot="scope" label="现浇结构分项验收依据">
                  <el-select
                    v-model="yanshou_rule4"
                    placeholder="请选择"
                    @change="changeXiang(scope)"
                  >
                    <el-option
                      v-for="item in options[3]"
                      :key="item.label"
                      :label="item.label"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <hr>
    <!--   添加检验批部位   -->
    <el-button type="primary" @click="addInspect">添加检验批部位</el-button>
    <el-table
      :data="allInspect"
      style="width: 100%"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column prop="inspectName" label="检验批部位" align="center" />
      <el-table-column
        v-for="(item, index) in arrList"
        :key="index"
        v-slot="scope"
        :prop="item.value"
        :label="item.label"
        align="center"
      >
        <TableItem :value="scope.row.obj" :str="item.label" />
      </el-table-column>
      <el-table-column v-slot="scope" prop="prop" label="操作" align="center">
        <template>
          <el-button
            type="danger"
            size="mini"
            @click="deletejianyan(scope)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--弹窗-->
    <el-dialog title="检验批部位添加" :visible.sync="dialogVisible" width="40%">
      <div>
        <el-row>
          <el-col :span="24">
            <el-form label-width="120px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="楼层范围">
                    <el-input
                      v-model="buildingFloor"
                      placeholder="请输入内容"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="至">
                    <el-input v-model="buildingTop" placeholder="请输入内容" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="检验批部位名称">
                <el-input v-model="inspectName" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="检验批选择">
                <el-checkbox-group v-model="checkList">
                  <el-checkbox
                    v-for="(item, index) in arrList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveInspect">确 定</el-button>
      </span>
    </el-dialog>
    <el-button type="primary" @click="preserve">保存</el-button>
    <el-button type="info" @click="cancel">取消</el-button>
  </div>
</template>

<script>
import TableItem from '@/views/project/components/tableItem.vue'
import {
  getNewSubprojectId,
  getSubprojects, getTasksBySubprojectId, getYanShouRules, getYanSouRulesById, postSubAndTasks
} from '@/api/project'

export default {
  components: { TableItem },
  props: {
    subprojectId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      form: {},
      defaultSubProInfo: {
        subprojectName: '前端项目9-1', // 单位工程名称
        kanchaDirector: '张三', // 勘察单位负责人
        shigongDirector: '建工', // 施工单位负责人
        jianduDirector: '监工', // 监督单位负责人
        jiansheDirector: '建设单位负责人', // 建设单位负责人
        area: 10000, // 施工面积
        jianliDirector: '监理单位负责人', // 监理单位负责人
        technicalDirector: '项目技术负责人', // 项目技术负责人
        shejiDirector: '设计单位负责人', // 设计单位负责人
        startDate: '2025-05-01 00:00:00',
        finishDate: '2025-05-01 00:00:00',
        projectId: 0,
        subprojectId: 0
      },
      subProInfo: {} || this.defaultSubProInfo,
      allInspect: [], // 所有检验批部位,
      options: [], // 验收依据下拉框
      yanshou_rule1: '', // 存验收依据下拉框1的选择
      yanshou_rule2: '', // 存验收依据下拉框2的选择
      yanshou_rule3: '', // 存验收依据下拉框3的选择
      yanshou_rule4: '', // 存验收依据下拉框4的选择
      dialogVisible: false,
      buildingFloor: 0,
      buildingTop: 0,
      inspectName: '', // 检验批部位名称
      checkList: [], // 选中的复选框
      arrList: [
        { value: 'obj0', label: '钢筋原材' },
        { value: 'obj1', label: '钢筋加工' },
        { value: 'obj2', label: '钢筋连接' },
        { value: 'obj3', label: '钢筋安装' },
        { value: 'obj4', label: '模板安装' },
        { value: 'obj5', label: '混凝土拌合物' },
        { value: 'obj6', label: '混凝土施工' },
        { value: 'obj7', label: '现浇结构' }
      ]
    }
  },
  computed: {
    projectId() {
      return this.$route.query.projectId
    }
  },
  watch: {
    async subprojectId(newValue) {
      console.log('subprojectId newValue', newValue)
      if (newValue) {
        await this.getSubprojects()
        await this.getYanSouRulesById()
        await this.getTasksBySubprojectId()
      } else {
        this.subProInfo = this.defaultSubProInfo
        this.yanshou_rule1 = ''
        this.yanshou_rule2 = ''
        this.yanshou_rule3 = ''
        this.yanshou_rule4 = ''
        this.allInspect = []
      }
    }
  },
  async created() {
    await this.getYanShouRules()
    this.subProInfo = this.defaultSubProInfo
    if (this.subprojectId) {
      await this.getSubprojects()
      await this.getYanSouRulesById()
      await this.getTasksBySubprojectId()
    }
  },
  methods: {
    async getSubprojects() {
      if (this.subprojectId) {
        try {
          const { result } = await getSubprojects(this.subprojectId)
          console.log('getSubprojects', result)
          this.subProInfo = result
        } catch (error) {
          console.log(error)
        }
      }
    },
    // async postSubprojects() {
    //   try {
    //     this.subProInfo.subprojectName = '前端项目9-1', // 单位工程名称
    //     this.subProInfo.kanchaDirector = '张三', // 勘察单位负责人
    //     this.subProInfo.shigongDirector = '建工', // 施工单位负责人
    //     this.subProInfo.jianduDirector = '监工', // 监督单位负责人
    //     this.subProInfo.jiansheDirector = '建设单位负责人', // 建设单位负责人
    //     this.subProInfo.area = 10000, // 施工面积
    //     this.subProInfo.jianliDirector = '监理单位负责人', // 监理单位负责人
    //     this.subProInfo.technicalDirector = '项目技术负责人', // 项目技术负责人
    //     this.subProInfo.shejiDirector = '设计单位负责人', // 设计单位负责人
    //     this.subProInfo.startDate = '2025-05-01 00:00:00',
    //     this.subProInfo.finishDate = '2025-05-01 00:00:00',
    //     this.subProInfo.projectId = this.projectId
    //     this.subProInfo.subprojectId = 2411748
    //     const res = await postSubprojects(this.subProInfo)
    //     console.log('创建一个新的分项目', res)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },
    async getTasksBySubprojectId() {
      try {
        const { result } = await getTasksBySubprojectId(this.subprojectId)
        console.log('根据分项目ID获取该分项目下的所有检验批信息', result)
        this.allInspect = []
        // 遍历楼层，把楼层相同的检验批名字放在一个数组里
        const temp = []
        let pre = 0
        if (result.length) {
          temp.push(result[0].inspectType)
          for (let i = 1; i < result.length; i++) {
            if (result[i].floor !== result[pre].floor) {
              this.allInspect.push({
                floor: result[pre].floor,
                inspectName: result[pre].inspectPart,
                obj: JSON.parse(JSON.stringify(temp))
              })
              pre = i
            } else {
              temp.push(result[i].inspectType)
            }
          }
          this.allInspect.push({
            floor: result[pre].floor,
            inspectName: result[pre].inspectPart,
            obj: temp
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getYanSouRulesById() {
      try {
        const { result } = await getYanSouRulesById(this.subprojectId)
        console.log('根据分项目ID获取该分项目的所有验收规范', result)
        if (result.length) {
          this.yanshou_rule1 = result[0].yanshouRule
          this.yanshou_rule2 = result[1].yanshouRule
          this.yanshou_rule3 = result[2].yanshouRule
          this.yanshou_rule4 = result[3].yanshouRule
        } else {
          this.yanshou_rule1 = ''
          this.yanshou_rule2 = ''
          this.yanshou_rule3 = ''
          this.yanshou_rule4 = ''
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getYanShouRules() {
      try {
        const { result } = await getYanShouRules()
        // console.log('获取可以用的验收规范', result)
        this.options = result
      } catch (error) {
        console.log(error)
      }
    },
    saveInspect() {
      console.log(this.allInspect)
      for (let i = this.buildingFloor; i <= this.buildingTop; i++) {
        if (this.allInspect.findIndex(item => item.floor === i) !== -1) continue// 去重操作
        if (i === 0) {
          this.allInspect.push({
            floor: i,
            inspectName: '楼前地面',
            obj: this.checkList
          })
        } else {
          this.allInspect.push({
            floor: i,
            inspectName: i.toString() + '层' + this.inspectName,
            obj: this.checkList
          })
        }
      }
      // 排序
      this.allInspect.sort((a, b) => {
        return a.floor - b.floor
      })

      console.log(this.allInspect)
      this.dialogVisible = false
    },
    addInspect() {
      this.dialogVisible = true
    },
    changeXiang(scope) {
    },
    cancel() {
      const data = {
        isShow: 0, // 右侧组件显示空白
        isAbled: false, // 新建按钮可用
        action: 'cancel'
      }
      this.$emit('transmit', data)
    },
    async preserve() {
      const tasks = []
      this.allInspect.forEach(item => {
        item.obj.forEach(item2 => {
          tasks.push({
            taskId: 0,
            subprojectId: this.subprojectId,
            projectFenxiangId: 0,
            inspectPart: item.inspectName,
            inspectId: 0,
            status: 0,
            finishDate: '2025-05-01 00:00:00',
            taskItemTableName: '',
            dataTableName: 'string',
            shigongRule: 'string',
            projectDirector: 'string',
            finishDate2: '2025-05-01 00:00:00',
            floor: item.floor,
            projectId: this.projectId,
            fenbaoCompany: 'string',
            fenbaoDirector: 'string',
            fenbaoTechnical: 'string',
            checkResult: 'string',
            conclusion: 'string',
            inspectType: item2,
            isUpdate: 1
          })
        })
      })
      console.log('tasks', tasks)
      // console.log('this.subProInfo', this.subProInfo)
      this.subProInfo.projectId = this.projectId
      this.subProInfo.subprojectId = this.subprojectId
      const tempData = {
        subproject: this.subProInfo,
        yanshouRules: [{
          inspect_type_id: 1,
          yanshou_rule: this.yanshou_rule1
        },
        {
          inspect_type_id: 2,
          yanshou_rule: this.yanshou_rule2
        },
        {
          inspect_type_id: 3,
          yanshou_rule: this.yanshou_rule3
        },
        {
          inspect_type_id: 4,
          yanshou_rule: this.yanshou_rule4
        }],
        tasks: tasks
      }
      const data = {
        isShow: 0, // 右侧组件显示空白
        isAbled: false, // 新建按钮可用
        action: 'preserve',
        isNew: false, // 是否新增分项目,
        data: tempData,
        nodeName: this.subProInfo.subprojectName
      }
      // 如果有分项目ID，则更新分项目，否则创建新的分项目
      if (!this.subprojectId) {
        data.isNew = true
      }
      // await this.postSubAndTasks(tasks)
      this.$emit('transmit', data)
    },
    deletejianyan(scope) {
      console.log(scope)
      this.allInspect.splice(scope.$index, 1)
    }
  }
}
</script>

<style>
.el-form-item {
  margin-bottom: 0;
}

.el-table .cell,
.el-table--border td:first-child .cell,
.el-table--border th:first-child .cell {
  padding-left: 0;
}

.el-table .cell {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding-right: 0;
}

.el-table td,
.el-table th {
  padding: 0;
  min-width: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
}

hr {
  color: gray;
  width: 90%;
}
</style>
