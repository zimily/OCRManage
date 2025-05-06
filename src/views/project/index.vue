<template>
  <div>
    <project-manage v-if="isShow"  :visible.sync='isShow' @transmit="getMessage"></project-manage>
    <project-detail v-if="!isShow" @transmit="getMessage"></project-detail>
  </div>
</template>

<script>
import ProjectManage from './components/projectManage.vue'
import ProjectDetail from '@/views/project/components/projectDetail'
export default {
  data() {
    return {
      isShow:true,
    }
 },
  components:{
    ProjectManage,
    ProjectDetail,
  },
  methods:{
    //子组件传递数据
    getMessage(data){
      this.isShow=data.isShow
    }
  }

}
</script>

<style>

</style>