<template>
  <div class="container">
    <div class="title">
       <span>OCR采集</span>
    </div>
     <div class='name'>
       <div class='sp1'>项目名称：{{projectName}}</div>
       <div class='sp2'>检验批名称：{{batchName}}</div>
     </div>
     <div style="margin-top: 10px">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="submit()">提交</el-button>
      </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      projectName:'蓬莱嘉园1#楼建设项目',
      batchName:'1#楼东1-7/A-F三层墙柱-现浇结构外观及尺寸偏差'
    }
  },
  methods:{
    submit(){
      const isShow = 0;
      const data = { isShow };
      this.$emit("transmit", data);
    },
    cancel(){
      const isShow = 0;
      const data = { isShow };
      this.$emit("transmit", data);
    }
  }

}
</script>

<style>
.title{
  display: flex;
}
.title>span{
  font-size: 30px;
  margin: auto;
}
.name{
  margin-left: 50px;
  
}
.sp1{
  margin-top: 10px;
  
}
.sp2{
  margin-top: 10px;
}
</style>