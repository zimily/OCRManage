<template>
  <div class="dashboard-card">
    <div class="card-header">
      <h3>{{ title }}</h3>
      <slot name="header-extra"></slot>
    </div>
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardCard',
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.dashboard-card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100px; /* 或者设置一个适当的最小高度 */
}
.dashboard-card:hover {
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.2); /* 鼠标悬停时增加阴影 */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.card-content {
  flex: 1;
  overflow: auto;
}
</style>