<template>
  <div>
    <div class="title">项目信息</div>
    <el-row>
      <el-col :span="24">
        <el-form ref="info" :model="info" label-width="30%">
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目号">
                <el-input v-model="info.projectInnerCode" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目类别">
                <el-input v-model="info.projectType" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目名称">
                <el-input v-model="info.projectName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结构类型">
                <el-input v-model="info.structureType" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所在区域">
                <el-cascader
                  v-model="pcData"
                  size="large"
                  :options="pcTextArr"
                  placeholder="请选择省市"
                  @change="handleChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="总建筑面积">
                <el-input v-model="info.totalArea" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="施工单位">
                <el-input v-model="info.shigongCompanyName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开工时间">
                <el-date-picker
                  v-model="info.startDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="建设单位">
                <el-input v-model="info.jiansheCompanyName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同竣工时间">
                <el-date-picker
                  v-model="info.endDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="监理单位">
                <el-input v-model="info.jianliCompanyName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="建设单位项目负责人">
                <el-input v-model="info.jiansheDirector" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设计单位">
                <el-input v-model="info.shejiCompanyName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="施工单位项目负责人">
                <el-input v-model="info.shigongDirector" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="勘察单位">
                <el-input v-model="info.kanchaCompanyName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="监理单位项目负责人">
                <el-input v-model="info.jianliDirector" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="监督单位">
                <el-input v-model="info.jianduCompanyName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设计单位项目负责人">
                <el-input v-model="info.shejiDirector" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="承包方式">
                <el-input v-model="info.contractMethod" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="勘察单位项目负责人">
                <el-input v-model="info.kanchaDirector" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目用途">
                <el-input v-model="info.projectUsage" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="">
            <el-button type="primary" @click="preserve">保存</el-button>
            <el-button type="info" @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { pcTextArr } from 'element-china-area-data'
import { getProjectsById, putProjects } from '@/api/project' // 引入
export default {
  name: 'ProjectInfo',
  props: {
    projectExcel: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      info: {
        // proNo: '457875',
        // proName: '郑州中原保利心语项目',
        // provinces: ['北京市', '市辖区', '东城区'], // 默认选中西湖区
        // constructionUnit: '中建A局B公司甲分公司',
        // develpoerUnit: '郑州煜盛房地产开发有限公司',
        // supervisionUnit: '中新华都国际工程咨询有限公司',
        // designUnit: '河南省纺织建设设计院有限公司',
        // surveyUnit: '郑州中核岩土工程有限公司',
        // regulatoryUnit: '河南省XX有限公司'
      },
      pcData: [],
      pcTextArr// 选择格式
    }
  },
  computed: {
    projectId() {
      return this.$route.query.projectId
    }
  },
  watch: {
    projectExcel(val) {
      if (val) {
        const temp = JSON.parse(JSON.stringify(val))
        this.pcData = temp[2]['填写范例'].split('-')
        this.info.projectCity = JSON.stringify(this.pcData)

        this.info.projectName = temp[1]['填写范例']
        this.info.jiansheCompanyName = temp[3]['填写范例']
        this.info.shigongCompanyName = temp[4]['填写范例']
        this.info.jianliCompanyName = temp[5]['填写范例']
        this.info.shejiCompanyName = temp[6]['填写范例']
        this.info.kanchaCompanyName = temp[7]['填写范例']
        this.info.jianduCompanyName = temp[8]['填写范例']
        this.info.contractMethod = temp[9]['填写范例']
        this.info.projectUsage = temp[10]['填写范例']
        this.info.projectType = temp[11]['填写范例']
        this.info.structureType = temp[12]['填写范例']
        this.info.totalArea = temp[13]['填写范例']
        this.info.startDate = temp[14]['填写范例']
        this.info.endDate = temp[15]['填写范例']
        this.info.jiansheDirector = temp[16]['填写范例']
        this.info.shigongDirector = temp[17]['填写范例']
        this.info.jianliDirector = temp[18]['填写范例']
        this.info.shejiDirector = temp[19]['填写范例']
        this.info.kanchaDirector = temp[20]['填写范例']
      }
      // else {
      //   this.info = {
      //     projectName: '',
      //     projectCity: '',
      //     projectType: '',
      //     structureType: '',
      //     totalArea: '',
      //     startDate: '',
      //     endDate: '',
      //     jiansheDirector: '',
      //     shigongDirector: '',
      //     jianliDirector: '',
      //     shejiDirector: '',
      //     kanchaDirector: '',
      //     jiansheCompanyName: '',
      //     shigongCompanyName: ''
      //   }
      // }
    }
  },
  created() {
    this.getProjectsById()
  },
  methods: {
    async getProjectsById() {
      try {
        const { result } = await getProjectsById(this.projectId)
        this.info = result
        this.info.isCreated = true
        this.pcData = JSON.parse(this.info.projectCity)
        console.log('getProjectsById', result)
      } catch (error) {
        console.log(error)
      }
    },
    async putSubprojects() {
      try {
        const res = await putProjects(this.projectId, this.info)
        console.log('putProjects更新项目', res)
      } catch (error) {
        console.log(error)
      }
    },
    preserve() {
      // 发请求保存项目信息

      const isShow = 0 // 使得右侧组件显示空白，只有点击的新建节点才能显示信息
      const isAbled = false
      const data = { isShow, isAbled }

      this.info.startDate = this.info.startDate + ' 00:00:00'
      this.info.endDate = this.info.endDate + ' 00:00:00'
      this.putSubprojects()
      this.$emit('transmit', data)
    },
    cancel() {
      //   const isShow = false;
      //   const data = { isShow };
      //   this.$emit("transmit", data);
    },
    // 事件触发  区域选择
    handleChange(e) {
      const jsonValue = JSON.stringify(e)
      console.log('省市区json字符串', jsonValue)
      this.info.projectCity = jsonValue
    }
  }
}
</script>

<style>
.title{
    text-align: center;
    margin-bottom:10px ;
    font-weight: bold;
    font-size: 20px;
}
.el-form-item {
    margin-bottom: 10px;
}
</style>
