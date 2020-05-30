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
      <el-button type="primary" @click="exportExcel">导出</el-button>
    </div>
    <x-table ref="grid" :config="config"></x-table>
  </div>
</template>

<script>
import { assnNameList } from "@/api/assn";
import { departmentList } from "@/api/assnDepartment";
import { excelExport } from "@/api/export";
export default {
  components: {},
  data() {
    return {
      assnForm: {},
      handleDepartment: [],
      departmentBan: true,
      config: {
        url: "/assnRecord/list",
        // 请求参数（表单）
        params: {},
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
            label: "操作类型",
            prop: "handleType",
            selects: "handleType"
          },
          {
            label: "操作时间",
            prop: "gmtModified",
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
    querySearchAsync(queryString, cb) {
      if (queryString) {
        assnNameList().then(res => {
          const restaurants = res.data;
          const results = restaurants.filter(function(item, index, array) {
            return (
              item.assnName.toLowerCase().indexOf(queryString.toLowerCase()) !==
              -1
            );
          });
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
      this.assnForm.assnDeparment = null;
    },
    change() {
      this.$forceUpdate();
    },
    exportExcel() {
      this.$shade();
      excelExport({ ...this.$refs.grid.config.params }, "/assnRecord/export")
        .then(res => {
          this.$excel(res, "社团记录");
          this.$shade.close();
          this.$message({
            type: "success",
            message: "导出成功！"
          });
        })
        .catch(err => {
          this.$shade.close();
        });
    }
  },
  computed: {},
  watch: {
    "assnForm.assnName"(newVal, oldVal) {
      if (!newVal) {
        this.departmentBan = true;
        this.assnForm.assnDeparment = null;
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
