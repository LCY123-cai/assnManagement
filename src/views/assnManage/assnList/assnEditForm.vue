<template>
  <x-dialog ref="dialog" @submit="editAssn" title="修改社团信息" saveText="修改">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="社团名称" prop="assnName">
        <x-input v-model="ruleForm.assnName"></x-input>
      </el-form-item>
      <el-form-item label="社团负责人" prop="assnPrincipalId">
        <x-select
          v-model="ruleForm.assnPrincipalId"
          placeholder="请输入"
          filterable
          remote
          :remote-method="remoteMethod"
          :loading="loading"
          :options="memberName"
          :append="memberCode"
        ></x-select>
      </el-form-item>
      <el-form-item label="社团类别" prop="assnTypeId">
        <x-select
          v-model="ruleForm.assnTypeId"
          placeholder="请选择"
          :options="$store.state.assn.typeList"
        ></x-select>
      </el-form-item>
      <el-form-item label="是否纳新" prop="isHiring">
        <el-switch v-model="ruleForm.isHiring"></el-switch>
      </el-form-item>
      <el-form-item label="社团介绍">
        <x-input type="textarea" v-model="ruleForm.assnIntroduce" maxlength="100" rank="2"></x-input>
      </el-form-item>
    </el-form>
  </x-dialog>
</template>
<script>
import { editAssn } from "@/api/assn";
import { getInfo } from "@/api/user";
export default {
  props: {
    assnInfo: {
      type: [Object],
      required: true
    },
    typeList: {
      type: [Array],
      required: true
    }
  },
  data() {
    return {
      ruleForm: Object.assign({}, this.assnInfo),
      loading: false,
      memberName: [],
      memberCode: [],
      rules: {
        assnName: [
          { required: true, message: "请输入社团名称", trigger: "blur" }
        ],
        assnPrincipalId: [
          { required: true, message: "请选择社团负责人", trigger: "change" }
        ],
        assnTypeId: [
          { required: true, message: "请选择社团类别", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    open() {
      this.$refs.dialog.open();
      this.ruleForm = Object.assign({}, this.assnInfo);
      this.ruleForm.isHiring = Boolean(this.ruleForm.isHiring);
      getInfo(false).then(res => {
        const data = res.data;
        const memberName = [];
        const memberCode = [];
        for (const ele of data) {
          const nameTemp = {};
          if (ele.userId === this.ruleForm.assnPrincipalId) {
            nameTemp.value = ele.userId;
            nameTemp.label = ele.userName;
            memberName.push(nameTemp);
            memberCode.push(ele.userAccount);
          }
        }
        this.memberName = memberName;
        this.memberCode = memberCode;
      });
    },
    editAssn(again, close) {
      // 判断校验是否通过
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let data = Object.assign({}, this.ruleForm);
          this.$refs.dialog.openLoading();
          // 发送请求
          editAssn(data)
            .then(res => {
              this.$message({
                message: "修改社团信息成功",
                type: "success"
              });
              this.$parent.$refs.grid.queryData(true);
              close();
            })
            .catch(err => {
              again();
            });
        } else {
          return false;
        }
      });
    },
    remoteMethod(query) {
      if (query.length > 0) {
        this.loading = true;
        getInfo(false)
          .then(res => {
            this.loading = false;
            const data = res.data;
            const memberName = [];
            const memberCode = [];
            for (const ele of data) {
              const nameTemp = {};
              if (ele.userName.indexOf(query) !== -1) {
                nameTemp.value = ele.userId;
                nameTemp.label = ele.userName;
                memberName.push(nameTemp);
                memberCode.push(ele.userAccount);
              }
            }
            this.memberName = memberName;
            this.memberCode = memberCode;
          })
          .catch(err => {
            this.loading = false;
          });
      }
    }
  },
  created() {},
  watch: {
    assnInfo(newVal, oldVal) {
      this.ruleForm = Object.assign({}, newVal);
    }
  }
};
</script>
<style lang='scss'>
</style>