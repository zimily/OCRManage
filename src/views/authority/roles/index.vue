<template>
  <div>
      <roles-manage v-if="isShow"  :visible.sync='isShow' @transmit="getMessage"></roles-manage>
    <roles-detail v-if="!isShow" @transmit="getMessage"></roles-detail>

  </div>
</template>

<script>
import RolesManage from './components/rolesManage.vue'
import RolesDetail from './components/rolesDetail.vue'

export default {
  data() {
    return {
      isShow:true,
    }
 },
  components:{
   RolesManage,
   RolesDetail,
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