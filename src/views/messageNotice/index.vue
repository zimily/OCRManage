<template>
  <div class="notification-container">
    <div class="notification-header">
      <h2>消息通知</h2>
      <div class="header-actions">
        <button @click="markAllAsRead">全部已读</button>
        <button @click="deleteAll">全部删除</button>
        <div class="filter">
          <select v-model="selectedFilter">
            <option value="all">全部</option>
            <option value="unread">未读</option>
            <option value="system">系统通知</option>
            <option value="business">业务通知</option>
            <option value="social">社交互动</option>
            <option value="project">项目工程</option>
          </select>
        </div>
      </div>
    </div>

    <div class="notification-list">
      <div
        v-for="(item, index) in filteredNotifications"
        :key="index"
        :class="['notification-item', { 'unread': !item.read }]"
        @click="markAsRead(item.id)"
      >
        <div class="notification-icon">
          <i :class="getIconClass(item.type)" />
        </div>
        <div class="notification-content">
          <p class="title">{{ item.title }}</p>
          <p class="message">{{ item.message }}</p>
          <p class="time">{{ formatTime(item.time) }}</p>
        </div>
        <div class="notification-actions">
          <span v-if="!item.read" class="unread-dot" />
          <button v-if="item.actionBtn" @click.stop="handleAction(item.actionBtn)">{{ item.actionBtn.text }}</button>
        </div>
        <span class="close-btn" @click.stop="deleteSingle(item.id)">x</span>
      </div>
    </div>

    <div v-if="!notifications.length" class="empty-notification">
      <p>暂无消息通知</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  data() {
    return {
      notifications: [
        {
          id: 1,
          type: 'system',
          title: '系统更新通知',
          message: '我们已更新了系统功能，点击查看详情',
          time: '2025-07-14 10:30',
          read: false,
          actionBtn: { text: '查看详情', action: 'viewUpdate' }
        },
        {
          id: 2,
          type: 'business',
          title: '编辑成功',
          message: '您的项目 #20250714001 已编辑成功',
          time: '2025-07-14 09:15',
          read: true
        },
        {
          id: 3,
          type: 'social',
          title: '新的提交消息',
          message: '用户"张三"提交了新项目',
          time: '2025-07-13 16:40',
          read: false
        },
        {
          id: 4,
          type: 'system',
          title: '安全提醒',
          message: '检测到您的账户在异地登录，如有异常请立即修改密码',
          time: '2025-07-12 21:05',
          read: true
        },
        {
          id: 5,
          type: 'business',
          title: '服务到期提醒',
          message: '您的服务将在3天后到期',
          time: '2025-07-11 14:20',
          read: false,
          actionBtn: { text: '前往续费', action: 'renewService' }
        },
        {
          id: 6,
          type: 'project',
          title: '项目任务分配',
          message: '您被分配到项目"xxx"的任务"任务1"',
          time: '2025-07-10 15:25',
          read: false
        },
        {
          id: 7,
          type: 'project',
          title: '项目进度更新',
          message: '项目"xxx"进度已更新至50%',
          time: '2025-07-09 08:40',
          read: true
        },
        {
          id: 8,
          type: 'project',
          title: '项目会议通知',
          message: '将于2025-07-15 14:00召开项目"xxx"会议',
          time: '2025-07-08 11:30',
          read: false,
          actionBtn: { text: '查看详情', action: 'viewMeeting' }
        },
        {
          id: 9,
          type: 'project',
          title: '项目物资采购提醒',
          message: '项目"xxx"所需物资即将短缺，请及时采购',
          time: '2025-07-07 16:10',
          read: false,
          actionBtn: { text: '前往采购', action: 'purchaseMaterials' }
        },
        {
          id: 10,
          type: 'project',
          title: '项目风险预警',
          message: '项目"xxx"存在进度延误风险，请尽快采取措施',
          time: '2025-07-06 09:20',
          read: true
        }
      ],
      selectedFilter: 'all'
    }
  },
  computed: {
    filteredNotifications() {
      if (this.selectedFilter === 'all') return this.notifications
      if (this.selectedFilter === 'unread') return this.notifications.filter(item => !item.read)
      return this.notifications.filter(item => item.type === this.selectedFilter)
    }
  },
  methods: {
    getIconClass(type) {
      const icons = {
        system: 'fa fa-bell',
        business: 'fa fa-shopping-cart',
        social: 'fa fa-comment'
      }
      return icons[type] || 'fa fa-info-circle'
    },
    formatTime(time) {
      // 简化的时间格式化，可使用日期库
      return new Date(time).toLocaleString()
    },
    markAsRead(id) {
      const notification = this.notifications.find(item => item.id === id)
      if (notification && !notification.read) {
        notification.read = true
        // 这里添加API调用，将已读状态同步到服务器
      }
    },
    markAllAsRead() {
      this.notifications.forEach(item => {
        if (!item.read) {
          item.read = true
        }
      })
      // 调用API将所有消息标记为已读
    },
    deleteAll() {
      if (this.notifications.length === 0) {
        this.$message && this.$message.info('没有消息可删除')
        return
      }
      if (confirm('确定要删除所有消息吗？此操作不可恢复。')) {
        // 调用API删除服务器数据
        this.notifications = []

        // 提示删除成功
        this.$message && this.$message.success('所有消息已删除')
      }
    },
    deleteSingle(id) {
      if (confirm('确定要删除这条消息吗？')) {
        const index = this.notifications.findIndex(item => item.id === id)
        if (index !== -1) {
          this.notifications.splice(index, 1)
        }
      }
    },
    handleAction(action) {
      console.log(`执行操作: ${action}`)

      switch (action) {
        case 'viewUpdate':
          this.$router.push('/updates') // 查看更新日志
          break

        case 'renewService':
          this.$emit('open-modal', 'renew') // 打开续费弹窗
          break

        case 'purchaseMaterials':
          this.$emit('open-modal', 'purchase') // 打开采购弹窗
          break

        case 'viewMeeting':
          this.$router.push('/meetings') // 查看会议详情
          break

        default:
          console.warn('未处理的操作:', action)
      }
    }
  }
}
</script>

<style scoped>
.notification-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.notification-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-actions button {
  background-color: #f0f0f0;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #555;
  transition: background-color 0.3s;
}

.header-actions button:hover {
  background-color: #e0e0e0;
}

.filter select {
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  font-size: 14px;
  color: #555;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 15px;
  border-radius: 6px;
  transition: background-color 0.3s;
  border: 1px solid #eee;
  cursor: pointer;
}

.notification-item:hover {
  background-color: #f8f8f8;
}

.notification-item.unread {
  background-color: #f0f8ff;
  border-left: 3px solid #1e88e5;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  flex-shrink: 0;
}

.notification-icon i {
  color: #555;
  font-size: 18px;
}

.notification-content {
  flex-grow: 1;
}

.notification-content .title {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.notification-content .message {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.notification-content .time {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.notification-actions {
  display: flex;
  align-items: center;
  margin-left: 15px;
  flex-shrink: 0;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff5252;
  display: inline-block;
  margin-right: 10px;
}

.notification-actions button {
  background-color: #1e88e5;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.3s;
}

.notification-actions button:hover {
  background-color: #0d47a1;
}

.empty-notification {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #999;
}

.empty-notification img {
  width: 200px;
  height: 150px;
  object-fit: cover;
  margin-bottom: 20px;
  opacity: 0.6;
  border-radius: 8px;
}

.close-btn {
  color: #999;
  font-size: 16px;
  margin: 0;
  padding: 0 10px;
  cursor: pointer;
  align-self: center;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #666;
}
</style>
