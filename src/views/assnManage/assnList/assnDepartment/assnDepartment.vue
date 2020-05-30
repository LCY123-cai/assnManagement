<template>
  <el-drawer
    :title="title"
    :visible.sync="drawer"
    :direction="direction"
    size="80%"
    @close="updateTable"
  >
    <div class="container">
      <div class="btnGroup" v-if="departmentPermission">
        <el-button type="primary" @click="creatDepartmentBtn">创建部门</el-button>
        <el-button type="primary" @click="editDepartmentBtn">修改部门信息</el-button>
        <el-button type="primary" @click="disbandDepartmentBtn">解散部门</el-button>
      </div>
      <x-table ref="grid" :config="config" v-if="assnInfo.assnId"></x-table>
      <departmentCreateForm ref="departmentCreateForm" :assnInfo="assnInfo"></departmentCreateForm>
      <departmentEditForm
        ref="departmentEditForm"
        :departmentInfo="pitchDepartment"
        :assnInfo="assnInfo"
      ></departmentEditForm>
    </div>
  </el-drawer>
</template>
<script>
import departmentCreateForm from "./departmentCreateForm";
import departmentEditForm from "./departmentEditForm";
import { disbandDepartment } from "@/api/assnDepartment";
export default {
  components: {
    departmentCreateForm,
    departmentEditForm
  },
  props: {
    assnInfo: {
      type: Object,
      required: true
    },
    assnPermission: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      drawer: false,
      direction: "btt",
      departmentForm: {},
      pitchDepartment: {},
      departmentPermission: false,
      config: {
        url: "/department/list",
        // 请求参数（表单）
        params: {
          assnId: this.assnInfo.assnId
        },
        // 表格配置信息
        attrs: {
          // 单选
          "highlight-current-row": true
        },
        // 事件
        events: {
          // 单选
          "current-change": val => {
            this.pitchDepartment = val || {};
          }
        },
        columns: [
          {
            label: "序号",
            type: "index",
            width: 70
          },
          {
            label: "部门名称",
            prop: "departmentName"
          },
          {
            label: "部门人数",
            prop: "departmentPeopleTotal"
          },
          {
            label: "部门介绍",
            prop: "departmentIntroduce"
          }
        ]
      }
    };
  },
  computed: {
    title() {
      return this.assnInfo.assnName + "\xa0部门详细信息";
    }
  },
  methods: {
    open() {
      this.drawer = true;
      if (this.$refs.grid) {
        this.$refs.grid.queryData(true);
      }
      this.departmentPermission = this.assnPermission;
    },
    creatDepartmentBtn() {
      this.$refs.departmentCreateForm.open();
    },
    editDepartmentBtn() {
      if (Object.keys(this.pitchDepartment).length > 0) {
        this.$refs.departmentEditForm.open();
      } else {
        this.$message({
          message: "请至少选择一条数据",
          type: "warning"
        });
      }
    },
    disbandDepartmentBtn() {
      if (Object.keys(this.pitchDepartment).length > 0) {
        this.$confirm(
          `你确定要解散&nbsp;<strong style="color: #F56C6C;">${this.pitchDepartment.departmentName}</strong>&nbsp;这个部门吗？`,
          "解散部门",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "error",
            closeOnClickModal: false,
            dangerouslyUseHTMLString: true
          }
        )
          .then(() => {
            const data = {
              departmentId: this.pitchDepartment.departmentId,
              deleted: 1
            };
            disbandDepartment(data).then(res => {
              this.$message({
                message: `解散${this.pitchDepartment.departmentName}成功`,
                type: "success"
              });
              this.$refs.grid.queryData(true);
            });
          })
          .catch(() => {});
      } else {
        this.$message({
          message: "请至少选择一条数据",
          type: "warning"
        });
      }
    },
    updateTable() {
      this.$parent.$refs.grid.queryData(false);
    }
  },
  watch: {
    assnInfo(newVal, oldVal) {
      this.config.params.assnId = newVal.assnId;
    },
    assnPermission(newVal, oldVal) {
      this.departmentPermission = newVal;
    }
  }
};
</script>
<style lang='scss' scoped>
.container {
  width: 100%;
  padding: 0 20px 20px 20px;
  overflow: auto;
  height: 90%;
  .btnGroup {
    margin-bottom: 10px;
  }
}
</style>