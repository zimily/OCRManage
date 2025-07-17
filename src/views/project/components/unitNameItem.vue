<template>
  <div>
    <div>
      <el-row>
        <el-col :span="24">
          <el-form ref="form" :disabled="chakan" :model="subProInfo" label-width="12em">
            <el-row>
              <el-col :span="12">
                <el-form-item :required="true" label="单位工程名称">
                  <el-input
                    v-model="subProInfo.subprojectName"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :required="true" label="勘察单位项目负责人">
                  <el-input
                    v-model="subProInfo.kanchaDirector"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item :required="true" label="施工单位项目负责人">
                  <el-input
                    v-model="subProInfo.shigongDirector"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :required="true" label="监督单位项目负责人">
                  <el-input
                    v-model="subProInfo.jianduDirector"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item :required="true" label="建设单位项目负责人">
                  <el-input
                    v-model="subProInfo.jiansheDirector"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :required="true" label="施工面积（m²）">
                  <el-input v-model="subProInfo.area" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item :required="true" label="监理单位项目负责人">
                  <el-input
                    v-model="subProInfo.jianliDirector"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :required="true" label="项目技术负责人">
                  <el-input
                    v-model="subProInfo.technicalDirector"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :required="true" label="设计单位项目负责人">
                  <el-input
                    v-model="subProInfo.shejiDirector"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8" label-width="5em">
                <el-form-item :required="true" label="层数" label-width="6em">
                  <span> 地下 </span>
                  <el-input v-model="subProInfo.floorUnderground" style="width: 4em;" />
                  <span> 层 ~ 地上</span>
                  <el-input v-model="subProInfo.floorOverground" style="width: 4em;margin-left: 1em" />
                  <span> 层</span>
                </el-form-item>
              </el-col>
              <el-col :span="8" label-width="3em">
                <el-form-item :required="true" label="开工时间">
                  <el-date-picker
                    v-model="subProInfo.startDate"
                    style="width: 100%"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
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
          <el-form ref="form" :disabled="chakan" :model="form" label-width="170px">
            <el-row>
              <el-col :span="12">
                <el-form-item v-slot="scope" label="钢筋分项验收依据">
                  <el-select
                    v-model="yanshou_rule1"
                    placeholder="请选择"
                    style="width: 100%"
                    :disabled="!checkRule[1]"
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
                    style="width: 100%"
                    :disabled="!checkRule[2]"
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
                    style="width: 100%"
                    :disabled="!checkRule[3]"
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
                    style="width: 100%"
                    :disabled="!checkRule[4]"
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
    <el-button v-if="!chakan" type="primary" @click="addInspect">添加检验批部位</el-button>
    <el-table
      :data="allInspect"
      max-height="30em"
      style="width: 100%;overflow-y:scroll;overflow-x:hidden;"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column prop="inspectName" label="检验批部位" align="center" width="200%" />
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
      <el-table-column v-if="!chakan" v-slot="scope" prop="prop" label="操作" align="center">
        <template>
          <el-button
            type="danger"
            size="mini"
            :disabled="chakan"
            @click="deletejianyan(scope)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--弹窗-->
    <el-dialog
      title="检验批部位添加"
      :visible.sync="dialogVisible"
      :show-close="false"
      width="40%"
      @close="handleClose"
    >
      <div>
        <el-row>
          <el-col :span="24">
            <el-form label-width="120px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="楼层范围">
                    <el-input v-model="buildingFloor" placeholder="请输入内容" />
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
        <el-button type="primary" @click="saveInspect">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-button v-if="!chakan" type="primary" @click="preserve">保存</el-button>
    <el-button v-if="!chakan" type="info" @click="cancel">取消</el-button>
  </div>
</template>

<script>
import TableItem from '@/views/project/components/tableItem.vue'
import {
  getSubprojects, getTasksBySubprojectId, getYanShouRules, getYanSouRulesById
} from '@/api/project'
import { int, integer } from 'mockjs/src/mock/random/basic'

export default {
  components: { TableItem },
  props: {
    ischakan: {
      type: Boolean,
      default: false
    },
    subprojectId: {
      type: String,
      default: null
    },
    subprojectExcel: {
      type: Array,
      default: () => {
        return []
      }
    },
    jianyanExcel: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      form: {},
      defaultSubProInfo: {
        subprojectName: '', // 单位工程名称
        kanchaDirector: '', // 勘察单位负责人
        shigongDirector: '', // 施工单位负责人
        jianduDirector: '', // 监督单位负责人
        jiansheDirector: '', // 建设单位负责人
        area: '', // 施工面积
        jianliDirector: '', // 监理单位负责人
        technicalDirector: '', // 项目技术负责人
        shejiDirector: '', // 设计单位负责人
        floorOverground: 0, // 层高（地上）
        floorUnderground: 0, // 层高（地下）
        startDate: '',
        finishDate: '',
        projectId: 0,
        subprojectId: 0
        // subprojectName: '前端项目9-1', // 单位工程名称
        // kanchaDirector: '张三', // 勘察单位负责人
        // shigongDirector: '建工', // 施工单位负责人
        // jianduDirector: '监工', // 监督单位负责人
        // jiansheDirector: '建设单位负责人', // 建设单位负责人
        // area: 10000, // 施工面积
        // jianliDirector: '监理单位负责人', // 监理单位负责人
        // technicalDirector: '项目技术负责人', // 项目技术负责人
        // shejiDirector: '设计单位负责人', // 设计单位负责人
        // startDate: '2025-05-01 00:00:00',
        // finishDate: '2025-05-01 00:00:00',
        // projectId: 0,
        // subprojectId: 0
      },
      subProInfo: {} || this.defaultSubProInfo,
      allInspect: [], // 所有检验批部位,
      options: [], // 验收依据下拉框
      yanshou_rule1: '', // 存验收依据下拉框1的选择
      yanshou_rule2: '', // 存验收依据下拉框2的选择
      yanshou_rule3: '', // 存验收依据下拉框3的选择
      yanshou_rule4: '', // 存验收依据下拉框4的选择
      checkRule: [0, 0, 0, 0, 0], // 存验收依据是否能选中
      dialogVisible: false,
      buildingFloor: 0,
      buildingTop: 0,
      inspectName: '', // 检验批部位名称
      checkList: [], // 选中的复选框
      arrList: [
        { value: '1', label: '钢筋原材' },
        { value: '2', label: '钢筋加工' },
        { value: '3', label: '钢筋连接' },
        { value: '4', label: '钢筋安装' },
        { value: '5', label: '模板安装' },
        { value: '6', label: '混凝土拌合物' },
        { value: '7', label: '混凝土施工' },
        { value: '8', label: '现浇结构' }
      ],
      jianyanMap: new Map(), // 由施工部位，检验批名称 =>施工依据
      taskMap: new Map()// 由施工部位，检验批名称 =>
    }
  },
  computed: {
    projectId() {
      return this.$route.query.projectId
    },
    chakan() {
      return this.$route.query.chakan === 'true'
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
    },
    subprojectExcel(newVal) {
      const temp = JSON.parse(JSON.stringify(newVal))
      this.subProInfo.subprojectName = temp[0]['填写范例'] // 单位工程名称
      this.subProInfo.jiansheDirector = temp[1]['填写范例'] // 建设单位负责人
      this.subProInfo.shigongDirector = temp[2]['填写范例'] // 施工单位负责人
      this.subProInfo.jianliDirector = temp[3]['填写范例'] // 监理单位负责人
      this.subProInfo.shejiDirector = temp[4]['填写范例'] // 设计单位负责人
      this.subProInfo.kanchaDirector = temp[5]['填写范例'] // 勘察单位负责人
      this.subProInfo.jianduDirector = temp[6]['填写范例'] // 监督单位负责人
      this.subProInfo.technicalDirector = temp[7]['填写范例']// 项目技术负责人
      this.subProInfo.startDate = temp[8]['填写范例']// 开工时间
      this.subProInfo.area = temp[9]['填写范例'] // 施工面积
      this.subProInfo.floorOverground = parseInt(temp[10]['填写范例'])// 层高（地上）
      this.subProInfo.floorUnderground = parseInt(temp[11]['填写范例']) // 层高（地下）
    },
    jianyanExcel(newVal) {
      const arr = JSON.parse(JSON.stringify(newVal))
      arr.sort((a, b) => {
        return parseInt(a['施工部位'].substring(0, 4)) - parseInt(b['施工部位'].substring(0, 4))
      })
      this.allInspect = []
      let temp = []
      let pre = 0
      if (arr.length) {
        temp.push(arr[0]['检验批名称'])
        this.setYanshouByExcel(arr[0])

        const key = JSON.stringify({ name: arr[0]['施工部位'], obj: arr[0]['检验批名称'] })
        this.jianyanMap.set(key, arr[0]['施工依据'])

        // const key2 = JSON.stringify({ name: arr[0]['施工部位'], obj: arr[0]['检验批名称'] })
        for (let i = 1; i < arr.length; i++) {
          if (arr[i]['施工部位'] !== arr[pre]['施工部位']) {
            this.allInspect.push({
              floor: parseInt(arr[pre]['施工部位'].substring(0, 4)),
              inspectName: arr[pre]['施工部位'],
              obj: JSON.parse(JSON.stringify(temp))
            })
            pre = i
            temp = []
            temp.push(arr[i]['检验批名称'])
          } else {
            temp.push(arr[i]['检验批名称'])
          }
          this.setYanshouByExcel(arr[i])
          const key2 = JSON.stringify({ name: arr[i]['施工部位'], obj: arr[i]['检验批名称'] })
          this.jianyanMap.set(key2, arr[i]['施工依据'])
        }
        this.allInspect.push({
          floor: parseInt(arr[pre]['施工部位'].substring(0, 4)),
          inspectName: arr[pre]['施工部位'],
          obj: temp
        })
      }
      this.checkRules()
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
    int,
    integer,
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
        let temp = []
        let pre = 0
        if (result.length) {
          temp.push(result[0].inspectType)
          const key = JSON.stringify({ name: result[0].inspectPart, obj: result[0].inspectType })
          this.taskMap.set(key, result[0])
          for (let i = 1; i < result.length; i++) {
            if (result[i].floor !== result[pre].floor || result[i].inspectPart !== result[pre].inspectPart) {
              this.allInspect.push({
                floor: result[pre].floor,
                inspectName: result[pre].inspectPart,
                obj: JSON.parse(JSON.stringify(temp))
              })
              pre = i
              temp = []
              temp.push(result[i].inspectType)
            } else {
              temp.push(result[i].inspectType)
            }
            const key2 = JSON.stringify({ name: result[i].inspectPart, obj: result[i].inspectType })
            this.taskMap.set(key2, result[i])
          }
          this.allInspect.push({
            floor: result[pre].floor,
            inspectName: result[pre].inspectPart,
            obj: temp
          })
          console.log('allInspect', this.allInspect)
        }
        this.checkRules()
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
        console.log('获取可以用的验收规范', result)
        this.options = result
      } catch (error) {
        console.log(error)
      }
    },
    saveInspect() {
      console.log(this.allInspect)
      this.buildingFloor = parseInt(this.buildingFloor)
      this.buildingTop = parseInt(this.buildingTop)
      // console.log(this.buildingFloor, typeof this.buildingFloor, this.buildingTop, typeof this.buildingTop)
      if (this.buildingFloor > this.buildingTop) {
        this.$message.warning('楼层填写错误')
        return
      }
      for (let i = this.buildingFloor; i <= this.buildingTop; i++) {
        // if (this.allInspect.findIndex(item => item.floor === i) !== -1) continue// 去重操作
        if (i === 0) {
          this.allInspect.push({
            floor: i,
            inspectName: '楼前地面' + this.inspectName,
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
      this.checkRules()
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
      if (!this.checkSubProInfo()) {
        return
      }
      const tasks = []
      this.allInspect.forEach(item => {
        item.obj.forEach(item2 => {
          const key = JSON.stringify({ name: item.inspectName, obj: item2 })
          const shigong = this.jianyanMap.get(key)
          const jianyan = this.taskMap.get(key)
          console.log(jianyan)
          tasks.push({
            taskId: 0,
            subprojectId: this.subprojectId,
            projectFenxiangId: jianyan ? jianyan.projectFenxiangId : 0,
            inspectPart: item.inspectName,
            inspectId: this.arrList.find(item3 => item3.label === item2).value,
            status: jianyan ? jianyan.status : 0,
            finishDate: '2025-05-01 00:00:00',
            taskItemTableName: jianyan ? jianyan.taskItemTableName : '',
            dataTableName: jianyan ? jianyan.dataTableName : '',
            shigongRule: shigong || '', // 施工依据
            projectDirector: jianyan ? jianyan.projectDirector : '',
            finishDate2: '2025-05-01 00:00:00',
            floor: item.floor,
            projectId: this.projectId,
            fenbaoCompany: jianyan ? jianyan.fenbaoCompany : '',
            fenbaoDirector: jianyan ? jianyan.fenbaoDirector : '',
            fenbaoTechnical: jianyan ? jianyan.fenbaoTechnical : '',
            checkResult: jianyan ? jianyan.checkResult : '',
            conclusion: jianyan ? jianyan.conclusion : '',
            inspectType: item2,
            isUpdate: 1
          })
        })
      })
      console.log('tasks', tasks)
      // console.log('this.subProInfo', this.subProInfo)
      this.subProInfo.projectId = this.projectId
      this.subProInfo.subprojectId = this.subprojectId
      this.subProInfo.startDate = this.subProInfo.startDate + ' 00:00:00'
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
      this.checkRules()
    },
    checkSubProInfo() {
      let bool = true
      if (this.subProInfo.subprojectName === '') {
        // subprojectName: '前端项目9-1', // 单位工程名称
        //   kanchaDirector: '张三', // 勘察单位负责人
        //   shigongDirector: '建工', // 施工单位负责人
        //   jianduDirector: '监工', // 监督单位负责人
        //   jiansheDirector: '建设单位负责人', // 建设单位负责人
        //   area: 10000, // 施工面积
        //   jianliDirector: '监理单位负责人', // 监理单位负责人
        //   technicalDirector: '项目技术负责人', // 项目技术负责人
        //   shejiDirector: '设计单位负责人', // 设计单位负责人
        //   startDate: '2025-05-01 00:00:00',
        //   finishDate: '2025-05-01 00:00:00',
        //   projectId: 0,
        //   subprojectId: 0
        this.$message.error('请填写单位工程名称')
        bool = false
      } else if (this.subProInfo.kanchaDirector === '') {
        this.$message.error('请填写勘察单位负责人')
        bool = false
      } else if (this.subProInfo.shigongDirector === '') {
        this.$message.error('请填写施工单位负责人')
        bool = false
      } else if (this.subProInfo.jianduDirector === '') {
        this.$message.error('请填写监督单位负责人')
        bool = false
      } else if (this.subProInfo.jiansheDirector === '') {
        this.$message.error('请填写建设单位负责人')
        bool = false
      } else if (this.subProInfo.area === '') {
        this.$message.error('请填写施工面积')
        bool = false
      } else if (this.subProInfo.jianliDirector === '') {
        this.$message.error('请填写监理单位负责人')
        bool = false
      } else if (this.subProInfo.technicalDirector === '') {
        this.$message.error('请填写项目技术负责人')
        bool = false
      } else if (this.subProInfo.shejiDirector === '') {
        this.$message.error('请填写设计单位负责人')
        bool = false
      }
      return bool
    },
    setYanshouByExcel(obj) {
      // console.log('obj', obj['检验批名称'])
      // console.log(obj['检验批名称'] === '钢筋原材')
      if (obj['检验批名称'] === '钢筋原材' ||
          obj['检验批名称'] === '钢筋加工' ||
          obj['检验批名称'] === '钢筋连接' ||
          obj['检验批名称'] === '钢筋安装') {
        this.yanshou_rule1 = obj['验收依据']
      } else if (obj['检验批名称'] === '模板安装') {
        this.yanshou_rule2 = obj['验收依据']
      } else if (obj['检验批名称'] === '现浇结构') {
        this.yanshou_rule4 = obj['验收依据']
      } else {
        this.yanshou_rule3 = obj['验收依据']
      }
    },
    checkRules() {
      const bol = [0, 0, 0, 0, 0]
      this.allInspect.forEach(item => {
        item.obj.forEach(item2 => {
          if (item2 === '钢筋原材' || item2 === '钢筋加工' || item2 === '钢筋连接' || item2 === '钢筋安装') {
            bol[1] = 1
          } else if (item2 === '模板安装') {
            bol[2] = 1
          } else if (item2 === '现浇结构') {
            bol[4] = 1
          } else {
            bol[3] = 1
          }
        })
      })
      this.checkRule = JSON.parse(JSON.stringify(bol))
      console.log(this.checkRule)
    },
    handleClose() {
      this.buildingFloor = 0
      this.buildingTop = 0
      this.inspectName = ''
      this.checkList = []
    }
  }
}
</script>

<style scoped>
::v-deep .app-main-wrapper {
  height: calc(100vh - 100px);
  overflow-y: auto;
}

/*启用 Element Plus 的默认表头固定功能*/
::v-deep.el-table__header-wrapper {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
}

::v-deep .el-form-item {
  margin-bottom: 0;
}

::v-deep .el-table .cell,
.el-table--border td:first-child .cell,
.el-table--border th:first-child .cell {
  padding-left: 0;
}

::v-deep.el-table .cell {
  line-height: 2em;
  padding-right: 0;
}

::v-deep .el-table td,
.el-table th {
  padding: 0;
  text-align: center;
}

::v-deep .el-table::before {
  height: 0;
}

hr {
  color: gray;
  width: 90%;
}
</style>
