<template>
  <div>
    <!-- 引入检验批管理组件 -->
    <BatchsManage v-if="isShow"  :visible.sync='isShow' @transmit="getMessage"/>
    <!-- 控制子组件是否显示 -->
    <BatchDetail v-if="!isShow" @transmit="getMessage"/>
  </div>
</template>

<script>
import BatchsManage from "@/views/inspectionBatch/components/batchesManage";
import BatchDetail from '@/views/inspectionBatch/components/batchDetail'
export default {
 data() {
    return {
      isShow:true,
    }
 },
  components: { BatchsManage,BatchDetail,},
  methods:{
    //检验批管理子组件传递数据
    getMessage(data){
      this.isShow=data.isShow
    }
  }
};
</script>

<style>
</style>