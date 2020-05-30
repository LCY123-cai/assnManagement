<template>
  <x-dialog ref="dialog" @submit="createAssnMember" title="添加社员" saveText="添加">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="可操作社团" prop="assnId">
        <x-select
          v-model="ruleForm.assnId"
          placeholder="请选择"
          :options="handleAssns"
          @change="assnChange"
        ></x-select>
      </el-form-item>
      <el-form-item label="社团部门" prop="departmentId">
        <x-select
          v-model="ruleForm.departmentId"
          placeholder="请选择"
          :disabled="departmentBan"
          :options="handleDepartment"
        ></x-select>
      </el-form-item>
      <el-form-item label="预添加社员" prop="userId">
        <x-select
          v-model="ruleForm.userId"
          placeholder="请输入"
          filterable
          remote
          :remote-method="remoteMethod"
          :loading="loading"
          :options="memberName"
          :append="memberCode"
        ></x-select>
      </el-form-item>
    </el-form>
  </x-dialog>
</template>
<script>
import { departmentList } from "@/api/assnDepartment";
import { getInfo } from "@/api/user";
import { createAssnMember } from "@/api/assnMember";
export default {
  props: {},
  data() {
    return {
      departmentBan: true,
      handleDepartment: [],
      loading: false,
      memberName: [],
      memberCode: [],
      ruleForm: {
        assnId: "",
        departmentId: "",
        userId: ""
      },
      rules: {
        assnId: [
          { required: true, message: "请选择操作社团", trigger: "change" }
        ],
        departmentId: [
          { required: true, message: "请选择加入部门", trigger: "change" }
        ],
        userId: [{ required: true, message: "请选择人员", trigger: "change" }]
      }
    };
  },
  methods: {
    open() {
      this.$refs.dialog.open();
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields();
      });
    },
    createAssnMember(again, close) {
      // 判断校验是否通过
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let data = Object.assign({}, this.ruleForm);
          this.$refs.dialog.openLoading();
          // 发送请求
          createAssnMember(data)
            .then(res => {
              this.$message({
                message: "创建社团成员成功",
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
    assnChange(val) {
      if (val) {
        this.departmentBan = false;
        const params = { assnId: val };
        departmentList(params).then(res => {
          const data = res.data;
          const handleDepartment = [];
          for (const el of data) {
            const temp = {};
            temp.value = el.departmentId;
            temp.label = el.departmentName;
            handleDepartment.push(temp);
          }
          this.handleDepartment = handleDepartment;
        });
      }
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
  computed: {
    handleAssns() {
      const values = this.$store.state.user.assnIds;
      const labels = this.$store.state.user.assnNames;
      const handleAssns = [];
      values.forEach(function(item, index, array) {
        const temp = {};
        temp.value = item;
        temp.label = labels[index];
        handleAssns.push(temp);
      });
      return handleAssns;
    }
  },
  watch: {
    "ruleForm.assnId"(newVal, oldVal) {
      if (!newVal) {
        this.departmentBan = true;
        this.ruleForm.departmentId = "";
      } else {
        this.ruleForm.departmentId = "";
      }
    }
  }
};
</script>
<style lang='scss'>
</style>