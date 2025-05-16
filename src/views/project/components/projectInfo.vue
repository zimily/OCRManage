<template>
  <div>
    <div class="title">项目信息</div>
    <el-form ref="info" :model="info" label-width="80px">
      <el-form-item label="项目号">
        <el-input v-model="info.proNo" />
      </el-form-item>
      <el-form-item label="项目名称">
        <el-input v-model="info.proName" />
      </el-form-item>
      <el-form-item label="所在区域">
        <el-cascader
          v-model="info.provinces"
          size="large"
          :options="options"
          placeholder="请选择省市区"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="施工单位">
        <el-input v-model="info.constructionUnit" />
      </el-form-item>
      <el-form-item label="建设单位">
        <el-input v-model="info.develpoerUnit" />
      </el-form-item>
      <el-form-item label="监理单位">
        <el-input v-model="info.supervisionUnit" />
      </el-form-item>
      <el-form-item label="设计单位">
        <el-input v-model="info.designUnit" />
      </el-form-item>
      <el-form-item label="勘察单位">
        <el-input v-model="info.surveyUnit" />
      </el-form-item>
      <el-form-item label="监督单位">
        <el-input v-model="info.regulatoryUnit" />
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="preserve">保存</el-button>
        <el-button type="info" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { regionData } from 'element-china-area-data' // 引入
export default {
  name: 'ProjectInfo',
  data() {
    return {
      info: {
        proNo: '457875',
        proName: '郑州中原保利心语项目',
        provinces: ['41', '4102', '410202'], // 默认选中西湖区
        constructionUnit: '中建A局B公司甲分公司',
        develpoerUnit: '郑州煜盛房地产开发有限公司',
        supervisionUnit: '中新华都国际工程咨询有限公司',
        designUnit: '河南省纺织建设设计院有限公司',
        surveyUnit: '郑州中核岩土工程有限公司',
        regulatoryUnit: '河南省XX有限公司'
      },
      options: regionData // 选择格式
    }
  },
  methods: {
    preserve() {
      // 发请求保存项目信息

      const isShow = 0 // 使得右侧组件显示空白，只有点击的新建节点才能显示信息
      const isAbled = false
      const data = { isShow, isAbled }
      this.$emit('transmit', data)
    },
    cancel() {
      //   const isShow = false;
      //   const data = { isShow };
      //   this.$emit("transmit", data);
    },
    // 事件触发  区域选择
    handleChange(e) {
      console.log(e, '所选code值')
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
