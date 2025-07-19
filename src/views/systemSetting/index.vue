<template>
  <div class="settings-container">
    <div class="settings-header">
      <h2>系统设置</h2>
    </div>

    <div class="settings-tabs">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        :class="['tab-item', {'active': currentTab === tab.id}]"
        @click="currentTab = tab.id"
      >
        {{ tab.title }}
      </div>
    </div>

    <div class="settings-content">
      <!-- 账户与安全 -->
      <div v-if="currentTab === 'account'" class="setting-panel">
        <h3 class="panel-title">账户与安全</h3>

        <div class="setting-item">
          <div class="item-label">用户名</div>
          <div class="item-content">
            <span>{{ userInfo.username }}</span>
            <button @click="editUsername">修改</button>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-label">头像</div>
          <div class="item-content">
            <img :src="userInfo.avatar" alt="用户头像" class="avatar">
            <button @click="changeAvatar">更换头像</button>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-label">绑定邮箱</div>
          <div class="item-content">
            <span>{{ userInfo.email || '未绑定' }}</span>
            <button @click="bindEmail">{{ userInfo.email ? '更换邮箱' : '绑定邮箱' }}</button>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-label">绑定手机</div>
          <div class="item-content">
            <span>{{ userInfo.phone || '未绑定' }}</span>
            <button @click="bindPhone">{{ userInfo.phone ? '更换手机' : '绑定手机' }}</button>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-label">修改密码</div>
          <div class="item-content">
            <button @click="changePassword">修改密码</button>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-label">登录设备管理</div>
          <div class="item-content">
            <button @click="manageDevices">查看登录设备</button>
          </div>
        </div>
      </div>

      <!-- 通知设置 -->
      <div v-if="currentTab === 'notification'" class="setting-panel">
        <h3 class="panel-title">通知设置</h3>

        <div class="setting-item">
          <div class="item-label">通知渠道</div>
          <div class="item-content">
            <div class="channel-options">
              <label>
                <input v-model="notificationSettings.channels.web" type="checkbox">
                网页内通知
              </label>
              <label>
                <input v-model="notificationSettings.channels.email" type="checkbox">
                邮件通知
              </label>
              <label>
                <input v-model="notificationSettings.channels.sms" type="checkbox">
                短信通知
              </label>
            </div>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-label">通知类型</div>
          <div class="item-content">
            <div class="notification-options">
              <label>
                <input v-model="notificationSettings.types.system" type="checkbox">
                系统通知
              </label>
              <label>
                <input v-model="notificationSettings.types.business" type="checkbox">
                业务通知
              </label>
              <label>
                <input v-model="notificationSettings.types.social" type="checkbox">
                社交互动
              </label>
              <label>
                <input v-model="notificationSettings.types.promotion" type="checkbox">
                推广信息
              </label>
            </div>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-label">消息提醒方式</div>
          <div class="item-content">
            <div class="reminder-options">
              <label>
                <input v-model="notificationSettings.reminder" type="radio" name="reminder" value="sound">
                声音+震动
              </label>
              <label>
                <input v-model="notificationSettings.reminder" type="radio" name="reminder" value="soundOnly">
                仅声音
              </label>
              <label>
                <input v-model="notificationSettings.reminder" type="radio" name="reminder" value="vibrateOnly">
                仅震动
              </label>
              <label>
                <input v-model="notificationSettings.reminder" type="radio" name="reminder" value="none">
                静音
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 界面设置 -->
      <div v-if="currentTab === 'interface'" class="setting-panel">
        <h3 class="panel-title">界面设置</h3>

        <div class="setting-item">
          <div class="item-label">主题模式</div>
          <div class="item-content">
            <select v-model="interfaceSettings.theme">
              <option value="light">浅色模式</option>
              <option value="dark">深色模式</option>
              <option value="auto">跟随系统</option>
            </select>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-label">语言</div>
          <div class="item-content">
            <select v-model="interfaceSettings.language">
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English</option>
              <option value="ja-JP">日本語</option>
            </select>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-label">字体大小</div>
          <div class="item-content">
            <div class="font-size-slider">
              <input v-model.number="interfaceSettings.fontSize" type="range" min="12" max="20" step="1">
              <span>{{ interfaceSettings.fontSize }}px</span>
            </div>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-label">布局选项</div>
          <div class="item-content">
            <div class="layout-options">
              <label>
                <input v-model="interfaceSettings.options.sidebar" type="checkbox">
                显示侧边栏
              </label>
              <label>
                <input v-model="interfaceSettings.options.header" type="checkbox">
                固定顶部导航
              </label>
              <label>
                <input v-model="interfaceSettings.options.animation" type="checkbox">
                启用动画效果
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 隐私设置 -->
      <div v-if="currentTab === 'privacy'" class="setting-panel">
        <h3 class="panel-title">隐私设置</h3>

        <div class="setting-item">
          <div class="item-label">个人信息可见性</div>
          <div class="item-content">
            <div class="privacy-options">
              <label>
                <span>用户名：</span>
                <select v-model="privacySettings.usernameVisibility">
                  <option value="everyone">所有人可见</option>
                  <option value="followers">仅关注者可见</option>
                  <option value="nobody">仅自己可见</option>
                </select>
              </label>
              <label>
                <span>头像：</span>
                <select v-model="privacySettings.avatarVisibility">
                  <option value="everyone">所有人可见</option>
                  <option value="followers">仅关注者可见</option>
                </select>
              </label>
              <label>
                <span>个人简介：</span>
                <select v-model="privacySettings.bioVisibility">
                  <option value="everyone">所有人可见</option>
                  <option value="followers">仅关注者可见</option>
                  <option value="nobody">仅自己可见</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-label">数据共享</div>
          <div class="item-content">
            <div class="data-sharing-options">
              <label>
                <input v-model="privacySettings.shareUsageData" type="checkbox">
                分享使用数据以改善服务
              </label>
              <label>
                <input v-model="privacySettings.shareLocation" type="checkbox">
                允许位置追踪
              </label>
              <label>
                <input v-model="privacySettings.shareWithThirdParty" type="checkbox">
                允许第三方获取基本信息
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="settings-footer">
      <button class="save-btn" @click="saveSettings">保存设置</button>
      <button class="cancel-btn" @click="resetSettings">取消</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      tabs: [
        { id: 'account', title: '账户与安全' },
        { id: 'notification', title: '通知设置' },
        { id: 'interface', title: '界面设置' },
        { id: 'privacy', title: '隐私设置' }
      ],
      currentTab: 'account',
      userInfo: {
        username: 'user',
        avatar: 'https://picsum.photos/100/100?random=1',
        email: 'example@domain.com',
        phone: '138****1234'
      },
      notificationSettings: {
        channels: {
          web: true,
          email: true,
          sms: false
        },
        types: {
          system: true,
          business: true,
          social: true,
          promotion: false
        },
        reminder: 'sound'
      },
      interfaceSettings: {
        theme: 'light',
        language: 'zh-CN',
        fontSize: 16,
        options: {
          sidebar: true,
          header: true,
          animation: true
        }
      },
      privacySettings: {
        usernameVisibility: 'everyone',
        avatarVisibility: 'everyone',
        bioVisibility: 'followers',
        shareUsageData: true,
        shareLocation: false,
        shareWithThirdParty: false
      },
      // 保存初始设置，用于取消重置
      initialSettings: {}
    }
  },
  created() {
    // 保存初始设置
    this.initialSettings = JSON.parse(JSON.stringify({
      notificationSettings: this.notificationSettings,
      interfaceSettings: this.interfaceSettings,
      privacySettings: this.privacySettings
    }))
  },
  methods: {
    saveSettings() {
      // 这里可以添加API调用，将设置保存到服务器
      console.log('保存设置:', {
        notificationSettings: this.notificationSettings,
        interfaceSettings: this.interfaceSettings,
        privacySettings: this.privacySettings
      })

      // 模拟保存成功的提示
      alert('设置已保存')
    },
    resetSettings() {
      // 重置为初始设置
      this.notificationSettings = JSON.parse(JSON.stringify(this.initialSettings.notificationSettings))
      this.interfaceSettings = JSON.parse(JSON.stringify(this.initialSettings.interfaceSettings))
      this.privacySettings = JSON.parse(JSON.stringify(this.initialSettings.privacySettings))
    },
    // 账户设置相关方法
    editUsername() {
      const newUsername = prompt('请输入新的用户名:', this.userInfo.username)
      if (newUsername && newUsername.trim() !== '') {
        this.userInfo.username = newUsername.trim()
      }
    },
    changeAvatar() {
      // 打开文件选择对话框
      alert('打开头像上传对话框')
    },
    bindEmail() {
      alert(this.userInfo.email ? '打开更换邮箱对话框' : '打开绑定邮箱对话框')
    },
    bindPhone() {
      alert(this.userInfo.phone ? '打开更换手机对话框' : '打开绑定手机对话框')
    },
    changePassword() {
      alert('打开修改密码对话框')
    },
    manageDevices() {
      alert('打开登录设备管理页面')
    }
  }
}
</script>

<style scoped>
.settings-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.settings-header {
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.settings-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.settings-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.tab-item {
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.tab-item.active {
  color: #1e88e5;
  border-bottom-color: #1e88e5;
  font-weight: 500;
}

.setting-panel {
  padding: 10px 0;
}

.panel-title {
  font-size: 20px;
  color: #333;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.item-label {
  width: 150px;
  font-size: 16px;
  color: #555;
  flex-shrink: 0;
}

.item-content {
  flex-grow: 1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.item-content span {
  margin-right: 15px;
  color: #333;
}

.item-content button {
  background-color: #f0f0f0;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #555;
  transition: background-color 0.3s;
}

.item-content button:hover {
  background-color: #e0e0e0;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}

.channel-options, .notification-options, .reminder-options, .layout-options, .privacy-options, .data-sharing-options {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.channel-options label, .notification-options label, .reminder-options label, .layout-options label, .privacy-options label, .data-sharing-options label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}

.channel-options input, .notification-options input, .reminder-options input, .layout-options input, .data-sharing-options input {
  margin-right: 8px;
}

.privacy-options select {
  margin-left: 10px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  font-size: 14px;
  color: #555;
}

.item-content select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  font-size: 14px;
  color: #555;
}

.font-size-slider {
  display: flex;
  align-items: center;
  width: 250px;
}

.font-size-slider input {
  flex-grow: 1;
  margin-right: 15px;
}

.settings-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.save-btn {
  background-color: #1e88e5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.save-btn:hover {
  background-color: #0d47a1;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #555;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}
</style>
