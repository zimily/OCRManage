<template>
  <div class="account-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">账号登录</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <!-- 随机验证码 -->
      <el-form-item prop="verifycode">
        <div class="verifycode-wrapper">
          <span class="svg-container">
            <svg-icon icon-class="verify" />
          </span>
          <el-input
            v-model="loginForm.verifycode"
            ref="verifycode"
            placeholder="请输入验证码"
            class="identifyinput"
          ></el-input>
          <span class="identifybox" @click="refreshCode">
            <sidentify :identifyCode="identifyCode"></sidentify>
          </span>
        </div>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
        >Login</el-button
      >
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import sidentify from "@/views/login/components/sidentify";
export default {
  name: "Account",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("请输入正确的账户名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码的额长度不能小于6位！"));
      } else {
        callback();
      }
    };
    // 验证码自定义验证规则
    const validateVerifycode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (value !== this.identifyCode) {
        console.log("验证码:", value);
        callback(new Error("验证码不正确!"));
      } else {
        callback();
      }
    };

    return {
      loginForm: {
        username: "admin",
        password: "123456",
        verifycode: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
        verifycode: [
          { required: true, trigger: "blur", validator: validateVerifycode },
        ],
      },
      loading: false, //
      passwordType: "password",
      identifyCodes: "1234567890", //验证码的数字库
      identifyCode: "", // 验证码组件传值
    };
  },
  components: {
    sidentify,
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.refreshCode(); //验证码初始化
  },
  mounted() {
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              // this.$router.push({ path: this.redirect || "/" });
              this.$router.push({ path: "/" }); // 强制跳首页

            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //验证码----start
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode +=
          this.identifyCodes[this.randomNum(0, this.identifyCodes.length)];
      }
      // console.log("this.identifyCode:", this.identifyCode);
    },
    //验证码----end
  },
};
</script>

<style lang="scss">
$primary-color: #2d8cf0; // 主色调
$hover-color: #57a3f3; // 悬停色调
$border-color: #dcdfe6; // 边框颜色
$focus-color: #c6e2ff; // 聚焦光晕

/* 重写Element组件样式 */
.account-container {
  .el-form-item {
    border: 1px solid $border-color;
    background: #ffffff;
    border-radius: 6px;
    transition: border-color 0.3s;

    &:hover {
      border-color: #c0c4cc;
    }

    &.is-focused {
      border-color: $primary-color;
      box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
    }
  }

  .el-input {
    input {
      color: #606266;
      caret-color: $primary-color;
      border: none; /* 移除输入框边框 */
      &::placeholder {
        color: #c0c4cc;
      }

      &:focus {
        + .el-input__prefix {
          .svg-container {
            color: $primary-color;
          }
        }
      }
    }
  }

  .el-button--primary {
    background: $primary-color;
    border-color: $primary-color;
    transition: all 0.3s;

    &:hover {
      background: $hover-color;
      border-color: $hover-color;
    }

    &:active {
      opacity: 0.8;
    }
  }
}
</style>

<style lang="scss" scoped>
$primary-color: #2d8cf0; // 主色调
$hover-color: #57a3f3; // 悬停色调
$border-color: #dcdfe6; // 边框颜色
$focus-color: #c6e2ff; // 聚焦光晕
$text-dark: #303133; // 主要文字颜色
$text-light: #909399; // 次要文字颜色

.account-container {
  width: 100%;

  .login-form {
    background: transparent;
    padding: 0;
  }

  .title-container {
    margin-bottom: 30px;

    .title {
      color: $text-dark;
      font-size: 24px;
      letter-spacing: 1px;
      text-align: center;
      position: relative;

      &::after {
        // 伪元素装饰线
        content: "";
        display: block;
        width: 40px;
        height: 3px;
        background: $primary-color;
        margin: 12px auto 0;
        border-radius: 2px;
      }
    }
  }

  .svg-container {
    padding-top: 10px;
    color: $text-light;
    transition: color 0.3s;
  }

  .show-pwd {
    right: 15px;
    padding-top: 10px;
    color: $text-light;
    transition: color 0.3s;

    &:hover {
      color: $text-dark;
    }
  }

  /* 验证码容器调整 */
  .verifycode-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 8px; // 元素间距

    .identifyinput {
      flex: 1;
      min-width: 120px;
    }

    .identifybox {
      flex-shrink: 0;
      margin-left: 10px;
    }
  }
  /* 密码输入框容器 */
  .el-form-item--password {
    ::v-deep .el-input {
      flex: 1;
    }

    .show-pwd {
      margin-left: auto;
    }
  }

  /* 图标对齐调整 */
  .svg-container {
    flex-shrink: 0;
  }
  /* 修改表单项布局 */
  ::v-deep .el-form-item__content {
    display: flex;
    align-items: center;
    gap: 8px; // 元素间距
  }
}
</style>
