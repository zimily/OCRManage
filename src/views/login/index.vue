<template>
  <div class="container">
    <div class="login-box">
      <!-- 登录方式切换选项卡 -->
      <div class="login-tabs">
        <button 
          :class="{ active: currentTab === 'account' }"
          @click="currentTab = 'account'"
        >
          账号登录
        </button>
        <button 
          :class="{ active: currentTab === 'phone' }"
          @click="currentTab = 'phone'"
        >
          手机登录
        </button>
      </div>

      <!-- 登录组件容器 -->
      <div class="login-content">
        <account v-if="currentTab === 'account'"/>
        <phone v-else/>
      </div>
    </div>
  </div>
</template>

<script>
import Account from './components/account.vue'
import Phone from './components/phone.vue';

export default {
  name: "Login",
  components: {
    Account,
    Phone,
  },
  data() {
    return {
      currentTab: 'account' // 当前选中的登录方式
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  width: 100%;
  background: url("~@/assets/login.png") no-repeat center center fixed;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-box {
    background: rgba(255, 255, 255, 0.95);
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    width: 400px;
    max-width: 90%;

    .login-tabs {
      display: flex;
      margin-bottom: 1.5rem;
      border-radius: 8px;
      overflow: hidden;
      background: #f5f5f5;

      button {
        flex: 1;
        padding: 12px 20px;
        border: none;
        background: transparent;
        cursor: pointer;
        font-size: 16px;
        color: #666;
        transition: all 0.3s ease;

        &.active {
          background: #fff;
          color: #2d8cf0;
          font-weight: 500;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        &:hover:not(.active) {
          background: rgba(255, 255, 255, 0.7);
        }
      }
    }

    .login-content {
      min-height: 300px; // 保持切换时高度一致
    }
  }
}
</style>