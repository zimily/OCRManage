<template>
  <div>
    <div class="title">项目信息</div>
    <el-form ref="info" :model="info" label-width="80px">
      <el-form-item label="项目号">
        <el-input v-model="info.projectInnerCode" />
      </el-form-item>
      <el-form-item label="项目名称">
        <el-input v-model="info.projectName" />
      </el-form-item>
      <el-form-item label="所在区域">
        <el-cascader
          v-model="pcaData"
          size="large"
          :options="pcaTextArr"
          placeholder="请选择省市区"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="施工单位">
        <el-input v-model="info.shigongCompanyName" />
      </el-form-item>
      <el-form-item label="建设单位">
        <el-input v-model="info.jiansheCompanyName" />
      </el-form-item>
      <el-form-item label="监理单位">
        <el-input v-model="info.jianliCompanyName" />
      </el-form-item>
      <el-form-item label="设计单位">
        <el-input v-model="info.shejiCompanyName" />
      </el-form-item>
      <el-form-item label="勘察单位">
        <el-input v-model="info.kanchaCompanyName" />
      </el-form-item>
      <el-form-item label="监督单位">
        <el-input v-model="info.jianduCompanyName" />
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="preserve">保存</el-button>
        <el-button type="info" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { pcaTextArr } from 'element-china-area-data'
import { getProjectsById, putProjects } from '@/api/project' // 引入
export default {
  name: 'ProjectInfo',
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
        this.pcaData = JSON.parse(this.info.projectCity)
        // console.log('getProjectsById', result)
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
