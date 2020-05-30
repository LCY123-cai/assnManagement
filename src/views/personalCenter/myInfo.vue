<template>
  <div>
    <el-image :src="avatar" fit="fit" class="avatar" @click="imagecropperShow=true"></el-image>
    <image-cropper
      v-show="imagecropperShow"
      :key="imagecropperKey"
      :width="400"
      :height="300"
      :url="imageUrl"
      :withCredentials="true"
      @close="imageClose"
      @crop-upload-success="cropSuccess"
      :params="imageParams"
    />
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="我的姓名">
        <div class="formShow">{{ruleForm.userName}}</div>
      </el-form-item>
      <el-form-item label="我的账号">
        <div class="formShow">{{ruleForm.userAccount}}</div>
      </el-form-item>
      <el-form-item label="我的性别">
        <el-radio :label="ruleForm.userGender" v-model="ruleForm.userGender"></el-radio>
      </el-form-item>
      <el-form-item label="我的电话" prop="userPhone">
        <x-input v-model="ruleForm.userPhone" rank="4"></x-input>
      </el-form-item>
      <el-form-item label="我的邮箱" prop="userEmail">
        <x-input v-model="ruleForm.userEmail" rank="6"></x-input>
      </el-form-item>
      <el-form-item label="个人介绍">
        <x-input
          type="textarea"
          v-model="ruleForm.userIntroduction"
          :rows="4"
          maxlength="100"
          rank="2"
        ></x-input>
      </el-form-item>
      <el-form-item>
        <x-button type="primary" @click="submitForm('ruleForm')" text="立即修改" ref="xButton"></x-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getInfo, editInfo } from "@/api/user";
import ImageCropper from "@/components/ImageCropper";
export default {
  components: {
    ImageCropper
  },
  data() {
    return {
      imageUrl: "/user/image",
      imagecropperShow: false,
      imagecropperKey: 0,
      imageParams: {},
      image: "",
      ruleForm: {},
      temporary: {},
      rules: {
        userPhone: [{ validator: this.$validate.mobile, trigger: "blur" }],
        userEmail: [
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    avatar() {
      if (this.$store.state.user.avatar) {
        return this.$imgUrl + this.$store.state.user.avatar;
      } else {
        return this.$imgExample;
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs.xButton.openLoading();
      this.$refs[formName].validate(valid => {
        if (valid) {
          editInfo(this.ruleForm)
            .then(res => {
              this.$message({
                message: "修改个人信息成功",
                type: "success"
              });
              this.$refs.xButton.closeLoading();
            })
            .catch(err => {
              this.$refs.xButton.closeLoading();
            });
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.ruleForm = Object.assign({}, this.temporary);
      this.$refs.ruleForm.clearValidate();
    },
    getUserInfo() {
      getInfo().then(res => {
        this.ruleForm = res.data[0];
        this.ruleForm.userGender = this.$formatter.selects(
          this.ruleForm.userGender,
          "sex"
        );
        this.temporary = Object.assign({}, this.ruleForm);
      });
    },
    cropSuccess(resData) {
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
      this.$message({
        message: "修改图片成功",
        type: "success"
      });
      this.$store.dispatch('user/getInfo')
    },
    imageClose() {
      this.imagecropperShow = false;
    }
  },
  created() {
    this.getUserInfo();
  }
};
</script>

<style lang="scss" scoped>
.formShow {
  font-weight: 340;
  font-size: 22px;
  color: #606266;
}
.avatar {
  position: absolute;
  right: 0;
  top: 0;
  width: 100px;
  height: 100px;
  border-radius: 10px;
  cursor: pointer;
  z-index: 100;
}
</style>

