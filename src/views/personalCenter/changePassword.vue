<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="我的密码" prop="userPassword">
        <el-input v-model="ruleForm.userPassword" rank="2" show-password></el-input>
      </el-form-item>
      <el-form-item label="新的密码" prop="newPassword">
        <el-input v-model="ruleForm.newPassword" rank="2" show-password></el-input>
      </el-form-item>
      <el-form-item label="再次确认" prop="confirmPassword">
        <el-input v-model="ruleForm.confirmPassword" rank="2" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <x-button type="primary" @click="submitForm('ruleForm')" text="立即修改" ref="xButton"></x-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { changePaswword } from "@/api/user";
export default {
  data() {
    const confirmPassword = (rule, value, callback) => {
      if (this.ruleForm.newPassword && this.ruleForm.confirmPassword) {
        if (
          value !== this.ruleForm.newPassword ||
          value !== this.ruleForm.confirmPassword
        ) {
          return callback(new Error("两次密码不一致，请检查"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      activeName: "userInfo",
      ruleForm: {},
      rules: {
        userPassword: [
          { required: true, message: "请输入你的密码", trigger: "blur" },
          { min: 6, max: 11, message: "长度在 6 到 11 个字符", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "请输入你的新密码", trigger: "blur" },
          {
            min: 6,
            max: 11,
            message: "长度在 6 到 11 个字符",
            trigger: "blur"
          },
          { validator: confirmPassword, trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: "请确认你的密码", trigger: "blur" },
          {
            min: 6,
            max: 11,
            message: "长度在 6 到 11 个字符",
            trigger: "blur"
          },
          { validator: confirmPassword, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs.xButton.openLoading();
      this.$refs[formName].validate(valid => {
        if (valid) {
          changePaswword(this.ruleForm)
            .then(res => {
              this.$message({
                message: "修改密码成功",
                type: "success"
              });
              this.$refs.xButton.closeLoading();
              this.$store.dispatch("user/logout");
              this.$router.push(`/login?redirect=${this.$route.fullPath}`);
            })
            .catch(err => {
              this.$refs.xButton.closeLoading();
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
</style>

