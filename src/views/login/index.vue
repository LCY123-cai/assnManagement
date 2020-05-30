<template>
  <div class="login-container">
    <transition name="fade" mode="out-in">
      <div v-if="isLogin" key="login">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
        >
          <div class="title-container">
            <h3 class="title">东软社团管理网站</h3>
          </div>

          <el-form-item prop="account">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="account"
              v-model="loginForm.account"
              placeholder="账号"
              name="account"
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
              placeholder="密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>

          <el-button
            :loading="loading"
            type="primary"
            style="width:100%;margin-bottom:30px;"
            @click.native.prevent="handleLogin"
          >登录</el-button>

          <div class="tips">
            <span @click="switchForm">还没有账号？(测试注册)</span>
          </div>
        </el-form>
      </div>
      <div v-else key="register">
        <el-form
          ref="registerForm"
          :model="registerForm"
          :rules="registerRules"
          class="login-form"
          label-position="left"
        >
          <div class="title-container">
            <h3 class="title">请仔细填写以下信息以注册</h3>
          </div>

          <el-form-item prop="userAccount">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input v-model="registerForm.userAccount" placeholder="账号" type="text" tabindex="1" />
          </el-form-item>

          <el-form-item prop="userName">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input v-model="registerForm.userName" placeholder="用户姓名" type="text" tabindex="2" />
          </el-form-item>

          <el-form-item prop="userPassword">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="registerForm.userPassword"
              :type="passwordType"
              placeholder="密码"
              tabindex="3"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="registerForm.confirmPassword"
              :type="passwordType"
              placeholder="确认密码"
              tabindex="4"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
          <el-form-item prop="userGender">
            <span class="svg-container">
              <svg-icon icon-class="gender" />
            </span>
            <el-radio-group v-model="registerForm.userGender" tabindex="5">
              <el-radio label="1">男</el-radio>
              <el-radio label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="userEmail">
            <span class="svg-container">
              <svg-icon icon-class="email" />
            </span>
            <el-input v-model="registerForm.userEmail" placeholder="邮箱地址" type="text" tabindex="6" />
          </el-form-item>
          <el-form-item prop="userPhone">
            <span class="svg-container">
              <svg-icon icon-class="phone" />
            </span>
            <el-input v-model="registerForm.userPhone" placeholder="移动电话" type="text" tabindex="7" />
          </el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            style="width:100%;margin-bottom:30px;"
            @click.native.prevent="handleRegister"
          >注册</el-button>

          <div class="tips">
            <span @click="switchForm">返回登录</span>
          </div>
        </el-form>
      </div>
    </transition>
    <div class="bottomText">
      <span>备案号：</span>
      <a href="http://www.beian.miit.gov.cn">辽ICP备19019381号</a>
    </div>
  </div>
</template>

<script>
import { register } from "@/api/user";
export default {
  name: "Login",
  data() {
    const validateAccount = (rule, value, callback) => {
      const accountReg = /^[1-9]\d{10}$/;
      if (!accountReg.test(value)) {
        callback(new Error("你的账户应为11位数字"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (this.registerForm.userPassword && this.registerForm.confirmPassword) {
        if (
          this.registerForm.userPassword !== this.registerForm.confirmPassword
        ) {
          callback(new Error("两次密码输入不一致"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      isLogin: true,
      loginForm: {
        account: "16110100907",
        password: "1234567"
      },
      registerForm: {
        userAccount: "",
        userName: "",
        userPassword: "",
        confirmPassword: "",
        userGender: "",
        userEmail: "",
        userPhone: ""
      },
      loginRules: {
        account: [
          { required: true, trigger: "blur", message: "请输入账号" },
          { validator: validateAccount, trigger: "blur" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入密码" },
          { min: 6, max: 11, message: "长度在 6 到 11 个字符", trigger: "blur" }
        ]
      },
      registerRules: {
        userAccount: [
          { required: true, trigger: "blur", message: "请输入账号" },
          { validator: validateAccount, trigger: "blur" }
        ],
        userPassword: [
          { required: true, trigger: "blur", message: "请输入密码" },
          {
            min: 6,
            max: 11,
            message: "长度在 6 到 11 个字符",
            trigger: "blur"
          },
          { validator: validatePassword, trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, trigger: "blur", message: "请输入密码" },
          {
            min: 6,
            max: 11,
            message: "长度在 6 到 11 个字符",
            trigger: "blur"
          },
          { validator: validatePassword, trigger: "blur" }
        ],
        userGender: [
          { required: true, trigger: "blur", message: "请选择性别" }
        ],
        userEmail: [
          { required: true, trigger: "blur", message: "请输入邮箱" },
          { validator: this.$validate.Email, trigger: "blur" }
        ],
        userPhone: [
          { required: true, trigger: "blur", message: "请输入手机" },
          { validator: this.$validate.mobile, trigger: "blur" }
        ]
      },
      loading: false,
      passwordType: "password",
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    switchForm() {
      this.isLogin = !this.isLogin;
      this.passwordType = "password";
      if (this.$refs.loginForm !== undefined) {
        this.$refs.loginForm.resetFields();
      }
      if (this.$refs.registerForm !== undefined) {
        this.$refs.registerForm.resetFields();
      }
    },
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
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true;
          register(this.registerForm)
            .then(res => {
              this.loading = false;
              this.$message.success("注册成功");
              this.switchForm();
            })
            .catch(err => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .bottomText {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    color: ivory;
    padding: 8px 0;
    font-size: 14px;
    a:hover {
      text-decoration: underline;
    }
  }
}
</style>
