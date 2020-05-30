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
        ></x-input>
      </el-form-item>
      <el-form-item label="社团类别">
        <x-select v-model="assnForm.assnTypeId" :options="$store.state.assn.typeList"></x-select>
      </el-form-item>
      <el-form-item label="是否纳新">
        <x-select v-model="assnForm.isHiring"></x-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="reset" plain>重置</el-button>
      </el-form-item>
    </el-form>
    <div class="btnGroup">
      <el-button type="primary" @click="creatAssnBtn" v-if="systemPermission">创建社团</el-button>
      <el-button
        type="primary"
        @click="editAssnBtn"
        :disabled="systemPermission?!systemPermission:!assnPermission"
      >修改社团信息</el-button>
      <el-button type="primary" @click="imagecropperShow=true" :disabled="!assnPermission">修改社团图片</el-button>
      <el-button type="primary" @click="assnType" v-if="systemPermission">社团类别</el-button>
      <el-button type="primary" @click="exportExcel">导出</el-button>
      <el-button type="primary" @click="changeHiring" v-if="systemPermission">更改纳新</el-button>
      <el-button type="primary" @click="disbandAssnBtn" v-if="systemPermission">解散社团</el-button>
    </div>
    <assnCreateForm ref="assnCreateForm" :typeList="typeList"></assnCreateForm>
    <assnEditForm
      ref="assnEditForm"
      :assnInfo="pitchAssn"
      :typeList="typeList"
      v-if="Object.keys(pitchAssn).length"
    ></assnEditForm>
    <x-table ref="grid" :config="config"></x-table>
    <assnType ref="assnType"></assnType>
    <assnDepartment
      ref="drawer"
      :assnInfo="assnInfo"
      :assnPermission="systemPermission||assnPermission"
    ></assnDepartment>
    <image-cropper
      v-show="imagecropperShow"
      :key="imagecropperKey"
      :width="1200"
      :height="800"
      :url="imageUrl"
      :withCredentials="true"
      @close="imageClose"
      @crop-upload-success="cropSuccess"
      :params="imageParams"
    />
  </div>
</template>

<script>
import assnCreateForm from "./assnCreateForm.vue";
import assnEditForm from "./assnEditForm.vue";
import assnType from "./assnType.vue";
import assnDepartment from "./assnDepartment/assnDepartment.vue";
import ImageCropper from "@/components/ImageCropper";
import { disbandAssn, changeHiring, typeList, assnNameList } from "@/api/assn";
import { excelExport } from "@/api/export";
export default {
  components: {
    assnCreateForm,
    assnEditForm,
    assnDepartment,
    assnType,
    ImageCropper
  },
  data() {
    return {
      imageUrl: "/assn/image",
      imagecropperShow: false,
      imagecropperKey: 0,
      imageParams: {},
      image: "",
      assnForm: {},
      pitchAssn: {},
      assnInfo: {},
      typeList: [],
      systemPermission: false,
      assnPermission: false,
      config: {
        url: "/assn/list",
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
            this.pitchAssn = val || {};
            this.imageParams = { assnId: val.assnId };
            this.assnPermission =
              this.$store.state.user.assnIds.indexOf(this.pitchAssn.assnId) !==
              -1;
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
            label: "社团负责人",
            prop: "userName"
          },
          {
            label: "社团总人数",
            prop: "assnPeopleTotal"
          },
          {
            label: "社团部门数",
            prop: "departmentTotal"
          },
          {
            label: "社团类别",
            prop: "assnTypeName"
          },
          {
            label: "是否纳新",
            prop: "isHiring",
            selects: "is"
          },
          {
            label: "社团介绍",
            prop: "assnIntroduce",
            width: 300,
            "show-overflow-tooltip": true
          },
          {
            label: "操作",
            component: "operation",
            click: this.assnDetails,
            btnText: "查看部门"
          }
        ]
      }
    };
  },
  methods: {
    search() {
      this.config.params = Object.assign({}, this.assnForm);
      if (this.config.params.isHiring) {
        this.config.params.isHiring = Number(this.config.params.isHiring);
      }
      this.$refs.grid.queryData(true);
    },
    reset() {
      this.assnForm = {};
      this.config.params = this.assnForm;
      this.$refs.grid.queryData(true);
    },
    creatAssnBtn() {
      this.$refs.assnCreateForm.open();
    },
    editAssnBtn() {
      if (Object.keys(this.pitchAssn).length > 0) {
        this.$refs.assnEditForm.open();
      } else {
        this.$message({
          message: "请至少选择一条数据",
          type: "warning"
        });
      }
    },
    disbandAssnBtn() {
      if (Object.keys(this.pitchAssn).length > 0) {
        this.$confirm(
          `你确定要解散&nbsp;<strong style="color: #F56C6C;">${this.pitchAssn.assnName}</strong>&nbsp;这个社团吗？`,
          "解散社团",
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
              assnId: this.pitchAssn.assnId,
              deleted: 1
            };
            disbandAssn(data).then(res => {
              this.$message({
                message: `解散${this.pitchAssn.assnName}成功`,
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
    changeHiring() {
      if (Object.keys(this.pitchAssn).length > 0) {
        this.$confirm(
          `你确定要将&nbsp;<strong style="color: #E6A23C;">${
            this.pitchAssn.assnName
          }</strong>&nbsp;置为<strong style="color: #E6A23C;">${
            this.pitchAssn.isHiring == 1 ? "不可" : "可"
          }纳新</strong>吗？`,
          "更改纳新状态",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            closeOnClickModal: false,
            dangerouslyUseHTMLString: true
          }
        )
          .then(() => {
            const data = {
              assnId: this.pitchAssn.assnId,
              isHiring: Number(!this.pitchAssn.isHiring)
            };
            changeHiring(data).then(res => {
              this.$message({
                message: `更改${this.pitchAssn.assnName}纳新状态成功`,
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
    assnDetails(row) {
      this.assnInfo = row;
      this.$refs.drawer.open();
    },
    assnType() {
      this.$refs.assnType.open();
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
    exportExcel() {
      this.$shade();
      excelExport({ ...this.$refs.grid.config.params }, "/assn/export")
        .then(res => {
          this.$excel(res, "社团列表");
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
    cropSuccess(resData) {
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
      this.$message({
        message: "修改社团图片成功",
        type: "success"
      });
    },
    imageClose() {
      this.imagecropperShow = false;
    }
  },
  created() {
    typeList().then(res => {
      for (const ele of res.data) {
        let temp = {};
        temp.label = ele.assnTypeName;
        temp.value = ele.assnTypeId;
        this.typeList.push(temp);
      }
    });
    this.$store.commit("assn/changeTypeList", this.typeList);
    this.systemPermission =
      this.$store.state.user.roles.indexOf("admin") !== -1;
    this.assnPermission =
      this.$store.state.user.assnIds.indexOf(this.pitchAssn.assnId) !== -1;
  }
};
</script>

<style lang="scss" scoped>
.btnGroup {
  margin-bottom: 10px;
}
</style>
