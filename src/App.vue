<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// 写个注释
import { refreshToken } from '@/api/user'
import { getAccessToken } from './api/materialPlatform';
import { getToken, setToken, setMaterialPlatformToken } from '@/utils/auth'
import request from "@/utils/request"; // 引入自定义的 request 模块
export default {
  name: 'App',
  data() {
    return {
      refreshTimer: null, // 存储定时器ID
      refreshTimer2: null // 存储定时器ID
    }
  },
  mounted() {
    console.log('全局生命周期 挂载！！')
    this.startTokenRefresh()
  },

  beforeDestroy() {
    console.log('全局生命周期 销毁！！')
    this.stopTokenRefresh()
  },
  methods: {
    // 启动定时刷新（每7分钟）
    startTokenRefresh() {
      // 先立即检查一次Token是否需要刷新
      this.checkAndRefreshToken()
      this.getMaterialPlatformToken() // 获取物资平台token

      // 设置定时器，每7分钟执行一次
      this.refreshTimer = setInterval(() => {
        this.checkAndRefreshToken()
      }, 7 * 60 * 1000) // 7分钟
      console.log("refreshTimer", this.refreshTimer);
      //第二个定时器每1分钟执行一次
      this.refreshTimer2 = setInterval(() => {
        this.getMaterialPlatformToken()
      }, 60 * 60 * 1000) // 1分钟
      // console.log("refreshTimer2", this.refreshTimer2);
    },
    // 停止定时刷新
    stopTokenRefresh() {
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer)
        this.refreshTimer = null
      }
      if (this.refreshTimer2) {
        clearInterval(this.refreshTimer2)
        this.refreshTimer2 = null
      }
    },
    // 检查并刷新Token
    async checkAndRefreshToken() {
      const token = getToken()
      // console.log('app token',token)
      // token不存在就不管
      if (!token) return
      // 存在就进行刷新
      try {
        const res = await refreshToken() // 调用刷新接口
        // console.log("Token刷新成功",res.result);
        setToken(res.result)
      } catch (error) {
        console.error('Token刷新失败', error)
        this.stopTokenRefresh() // 失败时停止定时器
        // 可选：跳转到登录页
        this.$router.push('/login')
      }
    },
    //获取物资平台所需要的token，并定时刷新令牌
    async getMaterialPlatformToken() {
      try {
        const response= await getAccessToken();
        const token = response.data.access_token;
        setMaterialPlatformToken(token); // 存储到COOKIES中
        // console.log("物资平台Token获取成功", token);

        // 打开物资平台数据对话框
        this.dialogTableVisible = true;
      } catch (error) {
        // 打印详细错误信息
        console.error("完整错误信息:", error);
        this.$message.error("无法连接到物资平台，请稍后重试！");
      }

    }

  }
}
</script>
<style scoped></style>
