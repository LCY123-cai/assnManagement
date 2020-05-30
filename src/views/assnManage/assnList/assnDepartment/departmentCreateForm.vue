<template>
  <x-dialog ref="dialog" @submit="creatDepartment" v-bind="dialogConfig">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="部门名称" prop="departmentName">
        <x-input v-model="ruleForm.departmentName"></x-input>
      </el-form-item>
      <el-form-item label="部门介绍" prop="departmentIntroduce">
        <x-input type="textarea" v-model="ruleForm.departmentIntroduce" maxlength="100" rank="2"></x-input>
      </el-form-item>
    </el-form>
  </x-dialog>
</template>
<script>
import { creatDepartment } from "@/api/assnDepartment";
export default {
  props: {
    assnInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialogConfig: {
        title: "创建部门",
        saveText: "创建",
        // "modal-append-to-body": false
        "append-to-body": true
      },
      ruleForm: {
        departmentName: "",
        departmentIntroduce: ""
      },
      rules: {
        departmentName: [
          { required: true, message: "请输入部门名称", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    open() {
      this.$refs.dialog.open();
      if(this.$refs.ruleForm){
        this.$refs.ruleForm.resetFields();
      }
    },
    creatDepartment(again, close) {
      // 判断校验是否通过
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let data = Object.assign({}, this.ruleForm);
          data.assnId = this.assnInfo.assnId;
          this.$refs.dialog.openLoading();
          // 发送请求
          creatDepartment(data)
            .then(res => {
              this.$message({
                message: "创建部门成功",
                type: "success"
              });
              this.$parent.$parent.$refs.grid.queryData();
              // this.$parent.$parent.$parent.$refs.grid.queryData(false);
              close();
            })
            .catch(err => {
              again();
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang='scss'>
</style>