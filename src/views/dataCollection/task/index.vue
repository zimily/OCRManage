<template>
  <div>
    <!-- <tasks v-if="isShow===0"  :visible.sync='isShow' @transmit="getMessage"></tasks>
    <manualCollection v-else-if="isShow===1"  @transmit="getMessage"></manualCollection>
    <ocrCollection v-else="isShow===2" @transmit="getMessage"></ocrCollection> -->
    <router-view></router-view>
  </div>
</template>

<script>
import router from '@/router';

// import tasks from '@/views/dataCollection/task/components/tasks'
// import manualCollection from '@/views/dataCollection/task/components/manualCollection'
// import ocrCollection from '@/views/dataCollection/task/components/ocrCollection'

export default {
  components:{
   
  },
  data(){
    // return {
    //   isShow:0,
    
    // }
  },
   methods:{
    // getMessage(data){
    //   this.isShow=data.isShow
    // }
  }

};
</script>

<style>
</style>