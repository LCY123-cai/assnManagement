<template>
  <div class="assnListContainer">
    <el-form
      :inline="true"
      :model="assnForm"
      class="demo-form-inline baseFrom"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="社团名称">
        <x-input
          v-model="assnForm.assnName"
          :autocomplete="true"
          :fetch-suggestions="querySearchAsync"
          value-key="assnName"
          @select="assnChange"
          @input="assnInput"
        ></x-input>
      </el-form-item>
      <el-form-item label="社团部门">
        <x-select
          v-model="assnForm.assnDeparment"
          :disabled="departmentBan"
          :options="handleDepartment"
          @change="change"
        ></x-select>
      </el-form-item>
      <el-form-item label="社员名称">
        <x-input v-model="assnForm.userName"></x-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="reset" plain>重置</el-button>
      </el-form-item>
    </el-form>
    <div class="btnGroup">
      <el-button type="primary" @click="addMemberBtn">添加社员</el-button>
      <el-button type="primary" @click="editMemberBtn" :disabled="!assnPermission">修改社员</el-button>
      <el-button
        type="primary"
        @click="disbandMemberBtn"
        :disabled="!systemPermission && !assnPermission"
      >开除社员</el-button>
      <el-button type="primary" @click="importExcelBtn">导入</el-button>
      <el-button type="primary" @click="exportExcel">导出</el-button>
    </div>
    <x-table ref="grid" :config="config"></x-table>
    <createMemberForm ref="addMemberForm"></createMemberForm>
    <editMemberForm ref="editMemberForm" :memberInfo="pitchMember"></editMemberForm>
    <importExcel ref="importExcel"></importExcel>
  </div>
</template>

<script>
import createMemberForm from "./createMemberForm.vue";
import editMemberForm from "./editMemberForm.vue";
import importExcel from "./importExcel.vue";
import { assnNameList } from "@/api/assn";
import { departmentList } from "@/api/assnDepartment";
import { disbandAssnMember } from "@/api/assnMember";
import { excelExport } from "@/api/export";
export default {
  components: {
    createMemberForm,
    editMemberForm,
    importExcel
  },
  data() {
    return {
      assnForm: {},
      departmentBan: true,
      handleDepartment: [],
      pitchMember: {},
      memberInfo: {},
      config: {
        url: "/assnMember/list",
        // 请求参数（表单）
        params: {},
        // 表格配置信息
        attrs: {
          // 单选
          "highlight-current-row": true
        },
        // 事件
        events: {
          // 单选
          "current-change": val => {
            this.pitchMember = val || {};
          }
        },
        pagination: {
          "page-size": 10,
          "page-size-opts": [10, 20, 30, 40]
        },
        columns: [
          {
            label: "序号",
            type: "index",
            width: 70
          },
          {
            label: "社团名称",
            prop: "assnName"
          },
          {
            label: "部门名称",
            prop: "departmentName"
          },
          {
            label: "社员名称",
            prop: "userName"
          },
          {
            label: "社员性别",
            prop: "userGender",
            selects: "sex"
          },
          {
            label: "社员电话",
            prop: "userPhone"
          },
          {
            label: "社员邮箱",
            prop: "userEmail",
            "min-width": "100"
          },
          {
            label: "加入时间",
            prop: "gmtCreate",
            format: "time"
          }
        ]
      }
    };
  },
  methods: {
    search() {
      this.config.params = Object.assign({}, this.assnForm);
      this.$refs.grid.queryData(true);
    },
    reset() {
      this.assnForm = {};
      this.config.params = this.assnForm;
      this.$refs.grid.queryData(true);
    },
    addMemberBtn() {
      this.$refs.addMemberForm.open();
    },
    editMemberBtn() {
      if (Object.keys(this.pitchMember).length > 0) {
        this.$refs.editMemberForm.open();
      } else {
        this.$message({
          message: "请至少选择一条数据",
          type: "warning"
        });
      }
    },
    disbandMemberBtn() {
      if (Object.keys(this.pitchMember).length > 0) {
        this.$confirm(
          `你确定要开除&nbsp;<strong style="color: #F56C6C;">${this.pitchMember.userName}</strong>&nbsp;这个社员吗？`,
          "开除社员",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "error",
            closeOnClickModal: false,
            dangerouslyUseHTMLString: true
          }
        )
          .then(() => {
            const data = this.pitchMember;
            disbandAssnMember(data)
              .then(res => {
                this.$message({
                  message: "删除社团成员成功",
                  type: "success"
                });
                this.$refs.grid.queryData(true);
              })
              .catch(err => {});
          })
          .catch(() => {});
      } else {
        this.$message({
          message: "请至少选择一条数据",
          type: "warning"
        });
      }
    },
    querySearchAsync(queryString, cb) {
      if (queryString) {
        assnNameList().then(res => {
          const restaurants = res.data;
          const results = queryString
            ? restaurants.filter(function(item, index, array) {
                return (
                  item.assnName
                    .toLowerCase()
                    .indexOf(queryString.toLowerCase()) !== -1
                );
              })
            : restaurants;
          cb(results);
        });
      } else {
        cb([]);
      }
    },
    assnChange(val) {
      this.departmentBan = false;
      const params = { assnId: val.assnId };
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
    },
    assnInput() {
      this.departmentBan = true;
      this.assnForm.assnDeparment = "";
    },
    change() {
      this.$forceUpdate();
    },
    exportExcel() {
      this.$shade();
      excelExport({ ...this.$refs.grid.config.params }, "/assnMember/export")
        .then(res => {
          this.$excel(res, "社团成员");
          this.$shade.close();
          this.$message({
            type: "success",
            message: "导出成功！"
          });
        })
        .catch(err => {
          this.$shade.close();
        });
    },
    importExcelBtn() {
      this.$refs.importExcel.open();
    }
  },
  computed: {
    systemPermission() {
      return this.$store.state.user.roles.indexOf("admin") !== -1;
    },
    assnPermission() {
      return (
        this.$store.state.user.assnIds.indexOf(this.pitchMember.assnId) !== -1
      );
    }
  },
  watch: {
    "assnForm.assnName"(newVal, oldVal) {
      if (!newVal) {
        this.departmentBan = true;
        this.assnForm.assnDeparment = "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.btnGroup {
  margin-bottom: 10px;
}
</style>
