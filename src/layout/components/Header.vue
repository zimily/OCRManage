<template>
  <div class="header" style=" background-color: #f8f8f8;">
    <!-- <img src="@/assets/zh_logol.jpg" style="height: 80" /> -->

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" /> -->
          <svg class="user-avatar">
            <use :xlink:href="`#icon-avatar`" />
          </svg>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
     <span class="title" >数字化验收系统</span>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import variables from '@/styles/variables.scss'
export default {
  computed: {
    ...mapGetters(["avatar"]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      window.location.reload();
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  width: calc(100% - $sideBarWidth);
  display: flex; /* 设置为 Flexbox 容器 */
  align-items: center; /* 垂直居中 */
  justify-content: space-between; /* 元素之间的间距，居中对齐 */
 
}
.header > img {
  margin-left: 10px;
  margin-top: 100px;
  height: 30px;
  width: 200px;
}
.title {
  flex: 1;
  text-align: center;
  font-size: 30px;
  letter-spacing: 15px;
  color: rgb(54, 54, 54);
}
.right-menu {
  float: right;
  height: 100%;
  line-height: 50%;
  background-color: #3875c5;
  width: 64px;

  &:focus {
    outline: none;
  }

  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }

  .avatar-container {
    margin-right: 30px;

    .avatar-wrapper {
      margin-top: 5px;
      margin-left: 5px;
      position: relative;

      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}

</style>