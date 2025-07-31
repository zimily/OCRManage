<template>
  <div class="recent-activities">
    <h3>最近活动</h3>
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :timestamp="activity.time"
        placement="top"
      >
        <el-card shadow="hover">
          <div class="activity-item">
            <el-avatar :size="40" :src="activity.avatar" />
            <div class="activity-content">
              <div class="activity-text">
                <span class="user-name">{{ activity.user }}</span>
                <span>{{ activity.action }}</span>
                <span class="target">{{ activity.target }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  name: 'RecentActivities',
  props: {
    activities: Array
  }
}
</script>

<style scoped>
.recent-activities h3 {
  margin-bottom: 20px;
}
.activity-item {
  display: flex;
  align-items: center;
}
.activity-content {
  margin-left: 15px;
}
.user-name {
  font-weight: bold;
  margin-right: 5px;
}
.target {
  color: #409EFF;
  margin-left: 5px;
}
</style>