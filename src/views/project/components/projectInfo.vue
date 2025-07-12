<template>
  <div>
    <div class="title">项目信息</div>
    <el-row>
      <el-col :span="24">
        <el-form ref="info" :disabled="chakan" :model="info" label-width="30%">
          <el-row>
            <el-col :span="12">
              <el-form-item :required="true" label="项目号">
                <el-input v-model.trim="info.projectInnerCode" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :required="true" label="项目类别">
                <el-input v-model.trim="info.projectType" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :required="true" label="项目名称">
                <el-input v-model.trim="info.projectName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :required="true" label="结构类型">
                <el-input v-model.trim="info.structureType" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :required="true" label="所在区域">
                <el-cascader
                  v-model="pcaData"
                  size="large"
                  :options="pcaTextArr"
                  placeholder="请选择省市区"
                  @change="handleChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :required="true" label="总建筑面积">
                <el-input v-model.trim="info.totalArea" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :required="true" label="施工单位">
                <el-input v-model.trim="info.shigongCompanyName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :required="true" label="开工时间">
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
              <el-form-item :required="true" label="建设单位">
                <el-input v-model.trim="info.jiansheCompanyName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :required="true" label="合同竣工时间">
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
              <el-form-item :required="true" label="监理单位">
                <el-input v-model.trim="info.jianliCompanyName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :required="true" label="建设单位项目负责人">
                <el-input v-model.trim="info.jiansheDirector" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :required="true" label="设计单位">
                <el-input v-model.trim="info.shejiCompanyName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :required="true" label="施工单位项目负责人">
                <el-input v-model.trim="info.shigongDirector" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :required="true" label="勘察单位">
                <el-input v-model.trim="info.kanchaCompanyName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :required="true" label="监理单位项目负责人">
                <el-input v-model.trim="info.jianliDirector" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :required="true" label="监督单位">
                <el-input v-model.trim="info.jianduCompanyName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :required="true" label="设计单位项目负责人">
                <el-input v-model.trim="info.shejiDirector" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :required="true" label="承包方式">
                <el-input v-model.trim="info.contractMethod" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :required="true" label="勘察单位项目负责人">
                <el-input v-model.trim="info.kanchaDirector" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :required="true" label="项目用途">
                <el-input v-model.trim="info.projectUsage" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-col :span="24">
          <el-button style="margin-left: 7em" type="primary" @click="preserve">{{ chakan?'确认':'保存' }}</el-button>
          <el-button type="info" @click="cancel">取消</el-button>
        </el-col>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { pcaTextArr } from 'element-china-area-data'
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
      pcaData: [],
      pcaTextArr// 选择格式
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
    projectExcel(val) {
      if (val) {
        const temp = JSON.parse(JSON.stringify(val))
        this.pcaData = temp[2]['填写范例'].split('-')
        this.info.projectCity = JSON.stringify(this.pcaData)

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
        this.pcaData = JSON.parse(this.info.projectCity)
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
      if (this.chakan) {
        const isShow = false
        const data = { isShow }
        this.$emit('transmit', data)
      } else if (this.checkProInfo() && !this.chakan) {
        const isShow = 0 // 使得右侧组件显示空白，只有点击的新建节点才能显示信息
        const isAbled = false
        const data = { isShow, isAbled }

        this.info.startDate = this.info.startDate + ' 00:00:00'
        this.info.endDate = this.info.endDate + ' 00:00:00'
        this.putSubprojects()
        this.$emit('transmit', data)
      }
    },
    cancel() {
      //   const isShow = false;
      //   const data = { isShow };
      //   this.$emit("transmit", data);
      this.$router.back()
    },
    // 事件触发  区域选择
    handleChange(e) {
      const jsonValue = JSON.stringify(e)
      console.log('省市区json字符串', jsonValue)
      this.info.projectCity = jsonValue
    },
    checkProInfo() {
      let bol = true
      if (this.info.projectInnerCode === null || this.info.projectInnerCode === '') {
        this.$message.warning('请填写项目号')
        bol = false
      } else if (this.info.projectType === null || this.info.projectType === '') {
        this.$message.warning('请填写项目类别')
        bol = false
      } else if (this.info.projectName === null || this.info.projectName === '') {
        this.$message.warning('请填写项目名称')
        bol = false
      } else if (this.info.structureType === null || this.info.structureType === '') {
        this.$message.warning('请填写结构类型')
        bol = false
      } else if (this.pcaData.length < 3) {
        this.$message.warning('请选择项目所在省市区')
        bol = false
      } else if (this.info.totalArea === null || this.info.totalArea === '') {
        this.$message.warning('请填写项目总面积')
        bol = false
      } else if (this.info.shigongCompanyName === null || this.info.shigongCompanyName === '') {
        this.$message.warning('请填写施工单位')
        bol = false
      } else if (this.info.startDate === null || this.info.startDate === '') {
        this.$message.warning('请填写项目开始时间')
        bol = false
      } else if (this.info.jiansheCompanyName === null || this.info.jiansheCompanyName === '') {
        this.$message.warning('请填写建设公司名称')
        bol = false
      } else if (this.info.endDate === '' || this.info.endDate === null) {
        this.$message.warning('请填写合同竣工时间')
        bol = false
      } else if (this.info.jianliCompanyName === null || this.info.jianliCompanyName === '') {
        this.$message.warning('请填写监理单位')
        bol = false
      } else if (this.info.jiansheDirector === null || this.info.jiansheDirector === '') {
        this.$message.warning('请填写建设单位负责人')
        bol = false
      } else if (this.info.shejiCompanyName === null || this.info.shejiCompanyName === '') {
        this.$message.warning('请填写设计单位')
        bol = false
      } else if (this.info.shigongDirector === null || this.info.shigongDirector === '') {
        this.$message.warning('请填写施工单位负责人')
        bol = false
      } else if (this.info.kanchaCompanyName === null || this.info.kanchaCompanyName === '') {
        this.$message.warning('请填写勘察单位')
        bol = false
      } else if (this.info.jianliDirector === null || this.info.jianliDirector === '') {
        this.$message.warning('请填写监理单位负责人')
        bol = false
      } else if (this.info.jianduCompanyName === null || this.info.jianduCompanyName === '') {
        this.$message.warning('请填写监督单位')
        bol = false
      } else if (this.info.shejiDirector === null || this.info.shejiDirector === '') {
        this.$message.warning('请填写设计单位负责人')
        bol = false
      } else if (this.info.contractMethod === null || this.info.contractMethod === '') {
        this.$message.warning('请填写承包方式')
        bol = false
      } else if (this.info.kanchaDirector === null || this.info.kanchaDirector === '') {
        this.$message.warning('请填写勘察单位负责人')
        bol = false
      } else if (this.info.projectUsage === null || this.info.projectUsage === '') {
        this.$message.warning('请填写项目用途')
        bol = false
      }
      return bol
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
.app-main-wrapper {
  height: calc(100vh - 100px);
  overflow-y: auto;
}
</style>
