<template>
  <div class="quick-actions">
    <el-row :gutter="10">
      <el-col :span="8" v-for="(action, index) in actions" :key="index">
        <el-button 
          class="action-btn" 
          :icon="action.icon" 
          @click="$emit('action-click', action.name)"
        >
          {{ action.name }}
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'QuickActions',
  data() {
    return {
      actions: [
        { name: '新增用户', icon: 'el-icon-user-add' },
        { name: '创建订单', icon: 'el-icon-plus' },
        { name: '导出数据', icon: 'el-icon-download' },
        { name: '系统设置', icon: 'el-icon-setting' },
        { name: '消息通知', icon: 'el-icon-message' },
        { name: '刷新数据', icon: 'el-icon-refresh' }
      ]
    }
  }
}
</script>

<style scoped>
.quick-actions h3 {
  margin-bottom: 15px;
}
.action-btn {
  width: 100%;
  margin-bottom: 10px;
  padding: 12px 0;
}
</style>