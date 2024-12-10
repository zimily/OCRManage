<template>
  <div>
    <statements  v-if="isShow"  :visible.sync='isShow' @transmit="getMessage"></statements>
    <statementDetail v-if="!isShow" @transmit="getMessage"></statementDetail>
  </div>
</template>

<script>
import statements from '@/views/statement/components/statements'
import statementDetail from '@/views/statement/components/statementDetail'

export default {
  components:{
    statements,
    statementDetail
   
  },
  data(){
    return {
      isShow:true,
    }
  },
  methods:{
    getMessage(data){
      this.isShow=data.isShow
    }
  }

}
</script>

<style>

</style>