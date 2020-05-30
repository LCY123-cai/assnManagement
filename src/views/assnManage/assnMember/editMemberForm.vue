<template>
  <x-dialog ref="dialog" @submit="editAssnMember" title="修改社员部门" saveText="修改">
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
      <el-form-item label="操作社员">
        <strong v-text="ruleForm.userName"></strong>
      </el-form-item>
    </el-form>
  </x-dialog>
</template>
<script>
import { departmentList } from "@/api/assnDepartment";
import { editAssnMember } from "@/api/assnMember";
export default {
  props: {
    memberInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      departmentBan: true,
      handleDepartment: [],
      loading: false,
      memberName: [],
      memberCode: [],
      ruleForm: {
        assnId: "",
        departmentId: ""
      },
      rules: {
        assnId: [
          { required: true, message: "请选择操作社团", trigger: "change" }
        ],
        departmentId: [
          { required: true, message: "请选择加入部门", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    open() {
      this.$refs.dialog.open();
      // this.$nextTick(() => {
      //   this.$refs.ruleForm.resetFields();
      // });
      this.ruleForm = Object.assign({}, this.memberInfo);
      this.assnChange(this.ruleForm.assnId);
    },
    editAssnMember(again, close) {
      // 判断校验是否通过
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const {
            assnId: oldAssnId,
            departmentId: oldDepartmentId,
            id
          } = this.memberInfo;
          const append = { oldAssnId, oldDepartmentId };
          let data = Object.assign({}, this.ruleForm, append);
          this.$refs.dialog.openLoading();
          // 发送请求
          editAssnMember(data)
            .then(res => {
              this.$message({
                message: "修改社团成员成功",
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
    },
    memberInfo(newVal, oldVal) {
      this.ruleForm = Object.assign({}, newVal);
    }
  }
};
</script>
<style lang='scss'>
</style>