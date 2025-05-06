<template>
  <div>
    <!-- 引入检验批 验收规范组件 -->
    <BatchsManage v-if="isShow"  :visible.sync='isShow' @transmit="getMessage"/>
    <!-- 控制子组件是否显示 -->
    <BatchDetail v-if="!isShow" @transmit="getMessage" :curInspecId="curInspecId"/>
  </div>
</template>

<script>
import BatchsManage from "@/views/inspectionBatch/components/batchesManage";
import BatchDetail from '@/views/inspectionBatch/components/batchDetail'
export default {
 data() {
    return {
      isShow:true,
      curInspecId:0,
    }
 },
  components: { BatchsManage,BatchDetail,},
  methods:{
    //检验批管理子组件传递数据
    getMessage(data){
      this.isShow=data.isShow
      this.curInspecId=data.id
      
    }
  }
};
</script>

<style>
</style>