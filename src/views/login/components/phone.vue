<template>
  <div class="phone-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">手机号登录</h3>
      </div>

      <el-form-item prop="userphone">
        <span class="svg-container">
          <svg-icon icon-class="phone" />
        </span>
        <el-input
          ref="userphone"
          v-model="loginForm.userphone"
          placeholder="Userphone"
          name="userphone"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <!-- 手机号验证码 -->
      <el-form-item prop="verifycode">
        <div class="verifycode-wrapper">
          <span class="svg-container">
            <svg-icon icon-class="verify" />
          </span>
          <el-input
            v-model="loginForm.verifycode"
            class="identifyinput"
            placeholder="请输入验证码"
          >
            <el-button
              slot="suffix"
              :disabled="disabled"
              @click="getCode"
              class="identifybox"
            >
              <span class="Time">{{ btnTxt }}</span>
            </el-button>
          </el-input>
        </div>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
        >登录</el-button
      >
    </el-form>
  </div>
</template>

<script>
import { sendCode } from "@/api/user";
export default {
  name: "Phone",
  data() {
    const validatePhone = (rule, value, callback) => {
      // 判断输入框中是否输入手机号
      if (!value) {
        callback(new Error("手机号不能为空"));
      }
      //正则表达式进行验证手机号，从1开始，第二位是35789中的任意一位，以9数字结尾
      if (!/^1[35789]\d{9}$/.test(value)) {
        callback(new Error("手机号格式不正确"));
      }
      callback();
    };

    return {
      loginForm: {
        userphone: "18836870772",
        verifycode: "",
      },
      loginRules: {
        userphone: [
          { required: true, trigger: "blur", message: "请输入11位手机号" },
          {
            required: true,
            trigger: "blur",
            min: 11,
            max: 11,
            message: "长度不符合",
          },
          { required: true, trigger: "blur", validator: validatePhone },
        ],
        verifycode: [
          { required: true, trigger: "blur", message: "请输入4位验证码" },
          {
            required: true,
            trigger: "blur",
            min: 6,
            max: 6,
            message: "验证码错误",
          },
        ],
      },
      loading: false, //
      btnTxt: "获取验证码",
      // 是否禁用  即点击之后一段时间内无法再点击
      disabled: false,
      time: 0,
    };
  },
  components: {},
  watch: {
    // $route: {
    //   handler: function (route) {
    //     this.redirect = route.query && route.query.redirect;
    //   },
    //   immediate: true,
    // },
  },
  created() {},
  mounted() {},
  methods: {
    async getCode() {
      // 校验手机号码
      if (!this.loginForm.userphone) {
        //号码校验不通过
        this.$message({
          message: "请输入手机号",
          type: "warning",
        });
        //正则判断 从1开始，第二位是35789中的任意一位，以9数字结尾
      } else if (!/1[35789]\d{9}/.test(this.loginForm.userphone)) {
        // 失去焦点后自动触发校验手机号规则
      } else {
        //发送请求  告诉后发送验证码
        try {
          let res = await sendCode(this.loginForm.userphone);
          if (res.code == 200) {
            this.$message({
              message: "验证成功",
              type: "success",
            });
            //开启倒计时
            this.time = 60;
            this.disabled = true;
            this.timer();
          } else {
            this.$message({
              message: "发送失败",
              type: "warning",
            });
            throw new Error(res.message || "发送验证码失败");
          }
        } catch (error) {
          console.log(error);
          this.$message.error("出错啦，请稍后重试！");
        }
      }
    },
    // 倒计时方法
    timer() {
      if (this.time > 0) {
        this.time--;
        // console.log(this.time);
        this.btnTxt = this.time + "s后重新获取验证码";
        setTimeout(this.timer, 1000);
      } else {
        this.time = 0;
        this.btnTxt = "获取验证码";
        this.disabled = false;
      }
    },
    handleLogin() {
      //把手机号和验证码发送给后端，后端进行检查
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/loginByPhone", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
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
  },
};
</script>

<style lang="scss">
$primary-color: #2d8cf0; // 主色调
$hover-color: #57a3f3; // 悬停色调
$border-color: #dcdfe6; // 边框颜色
$focus-color: #c6e2ff; // 聚焦光晕

/* 重写Element组件样式 */
.phone-container {
  .el-form-item {
    border: 1px solid $border-color;
    background: #ffffff; //
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
  //登录按钮
  .el-button--primary {
    background: $primary-color; //$primary-color
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

.phone-container {
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
    padding: 0 12px;
    color: $text-light;
    transition: color 0.3s;
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
