<template>
  <x-dialog ref="dialog" @submit="editDepartment" v-bind="dialogConfig">
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
      <el-form-item label="部门介绍">
        <x-input type="textarea" v-model="ruleForm.departmentIntroduce" maxlength="100" rank="2"></x-input>
      </el-form-item>
    </el-form>
  </x-dialog>
</template>
<script>
import { editDepartment } from "@/api/assnDepartment";
export default {
  props: {
    departmentInfo: {
      type: Object,
      required: true
    },
    assnInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialogConfig: {
        title: "修改部门信息",
        saveText: "修改",
        // "modal-append-to-body": false
        "append-to-body": true
      },
      ruleForm: Object.assign({}, this.assnInfo),
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
      this.ruleForm = Object.assign({}, this.departmentInfo);
    },
    editDepartment(again, close) {
      // 判断校验是否通过
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let data = Object.assign({}, this.ruleForm);
          data.departmentId = this.departmentInfo.departmentId;
          data.assnId = this.assnInfo.assnId;
          this.$refs.dialog.openLoading();
          // 发送请求
          editDepartment(data)
            .then(res => {
              this.$message({
                message: "修改部门信息成功",
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
  },
  watch: {
    departmentInfo(newVal, oldVal) {
      this.ruleForm = Object.assign({}, newVal);
    }
  }
};
</script>
<style lang='scss'>
</style>