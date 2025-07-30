<template>

  <div class="table1_container">
    <div class="table1_dataShower">
      <button class="report-top-button">返回上级页面</button>
      <h1>检验批质量验收记录</h1>
    </div>
  </div>
</template>

<script>
import router from '@/router'

export default {
  data() {
    return {
      localStorageId: '',
      reportData:{}
    }
  },
  mounted() {  //钩子函数
    //从localstorage中拿数据
    const localStorageId = this.$route.query.localStorageId;
    this.localStorageId = localStorageId; // 保存id用于销毁时清理
    if (localStorageId) {
      const data = localStorage.getItem(localStorageId);
      if (data) {
        this.reportData = JSON.parse(data);
        console.log(this.reportData);
      }
    }
  },
  beforeDestroy() { //离开页面要做的事

    //那就是清除localstorage！！！
    if(this.localStorageId){
      localStorage.removeItem(this.localStorageId);
    }
    document.querySelector('body').setAttribute('style', 'background-color: white;'); //还原，因为这是个全局样式

  },
  beforeCreate() {
    document.querySelector('body').setAttribute('style', 'background-color:#f5f5f5;') //设置对比色
  },
  methods: {
    back() {
      this.$router.go(-1);
    }
  }
}
</script>

<style>
.table1_container{
  width: 80%;
  background: white;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
.table1_dataShower {
  width:80%;
  background: white;
  margin: 0 auto;
  border: 1px black solid;
}
/*这是返回按钮的样式*/
.report-top-button {
  display: block;
  margin: 0 auto;
  margin-bottom: 20px;
  padding: 12px 28px;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Arial', sans-serif;
  color: #ffffff;
  background: linear-gradient(90deg, #1e3a8a, #3b82f6); /* 建筑行业蓝色调，稳重且有活力 */
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.report-top-button:hover {
  background: linear-gradient(90deg, #1e3a8a, #2563eb);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.report-top-button:active {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transform: translateY(0);
}
</style>
