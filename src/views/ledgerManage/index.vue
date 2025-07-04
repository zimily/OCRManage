<template>
  <div>
    <div class="nav-buttons">
      <el-button 
        type="primary" 
        @click="navigate('RawMaterial', 'raw')"
        :class="{ active: $route.name === 'RawMaterial' }">钢筋原材</el-button>
      <el-button 
        type="primary" 
        @click="navigate('Connection', 'connection')"
        :class="{ active: $route.name === 'Connection' }">钢筋机械连接</el-button>
      <el-button 
        type="primary" 
        @click="navigate('Weld', 'weld')"
        :class="{ active: $route.name === 'Weld' }">钢筋焊接</el-button>
      <el-button 
        type="primary" 
        @click="navigate('Beton', 'beton')"
        :class="{ active: $route.name === 'Beton' }">混凝土强度</el-button>
    </div>
    <div class="content-container">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    navigate(routeName, category) {
      this.$router.push({ 
        name: routeName,
        params: { category }
      });
    }
  }
}
</script>

<style scoped>
.nav-buttons {
  padding: 20px;
  background: #f5f5f5;
  margin-bottom: 20px;
}

.el-button.active {
  background-color: #409EFF !important; /* 更深的蓝色 */
  border-color: #409EFF !important;
  color: #fff !important;
}

.el-button:not(.active) {
  background-color: #fff;
  color: #409EFF;
  border-color: #dcdfe6;
}

.content-container {
  padding: 0 20px;
}
</style>