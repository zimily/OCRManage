<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { refreshToken } from "@/api/user";
import { getToken,setToken, } from "@/utils/auth";
export default {
  name: "App",
  data() {
    return {
      refreshTimer: null, // 存储定时器ID
    };
  },
  mounted() {
    console.log("全局生命周期 挂载！！");
    this.startTokenRefresh();
  },

  beforeDestroy() {
    console.log("全局生命周期 销毁！！");
    this.stopTokenRefresh();
  },
  methods: {
    // 启动定时刷新（每7分钟）
    startTokenRefresh() {
      // 先立即检查一次Token是否需要刷新
      this.checkAndRefreshToken();

      // 设置定时器，每7分钟执行一次
      this.refreshTimer = setInterval(() => {
        this.checkAndRefreshToken();
      }, 7*60*1000); // 7分钟
      // console.log("refreshTimer", this.refreshTimer);
    },
    // 停止定时刷新
    stopTokenRefresh() {
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer);
        this.refreshTimer = null;
      }
    },
    // 检查并刷新Token
    async checkAndRefreshToken() {
      const token = getToken();
      // console.log('app token',token)
      //token不存在就不管
      if (!token) return;
      //存在就进行刷新
      try {
        let res=await refreshToken(); // 调用刷新接口
        // console.log("Token刷新成功",res.result);
        setToken(res.result)
      } catch (error) {
        console.error("Token刷新失败", error);
        this.stopTokenRefresh(); // 失败时停止定时器
        // 可选：跳转到登录页
        this.$router.push("/login");
      }
    },
  },
};
</script>
