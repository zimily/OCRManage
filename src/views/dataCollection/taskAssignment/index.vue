<template>
  <div>
    <collectionManage  v-if="isShow"  :visible.sync='isShow' @transmit="getMessage"></collectionManage>
    <collection-deteil v-if="!isShow" @transmit="getMessage"></collection-deteil>
  </div>
</template>

<script>
import CollectionManage from './components/collectionManage.vue';
import CollectionDeteil from '@/views/dataCollection/taskAssignment/components/collectionDeteil'

export default {
  components:{
     CollectionManage,
     CollectionDeteil
  },
  data(){
    return {
      isShow:true,
    }
  },
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