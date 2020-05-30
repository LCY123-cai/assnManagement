<template>
  <x-dialog ref="dialog" title="社团类别" cancelText="关闭" :btn="btn">
    <div class="container">
      <div class="table">
        <x-table ref="grid" :config="config"></x-table>
      </div>
      <div class="btnGourp">
        <div>
          <el-button type="primary" @click="addType">新增类别</el-button>
        </div>
        <div>
          <el-button type="primary" @click="editType">修改类别</el-button>
        </div>
        <div>
          <el-button type="primary" @click="deleteType">删除类别</el-button>
        </div>
      </div>
    </div>
  </x-dialog>
</template>
<script>
import { typeList, addType, editType, deleteType } from "@/api/assn";
export default {
  props: {},
  data() {
    return {
      btn: ["cancel"],
      pitchType: {},
      config: {
        url: "/assn/typeList",
        // 请求参数（表单）
        params: {},
        // 表格配置信息
        attrs: {
          // 单选
          "highlight-current-row": true,
          height: "380"
        },
        // 事件
        events: {
          // 单选
          "current-change": val => {
            this.pitchType = val || {};
          }
        },
        columns: [
          {
            label: "序号",
            type: "index",
            width: 100
          },
          {
            label: "社团类别",
            prop: "assnTypeName"
          }
        ]
      }
    };
  },
  methods: {
    open() {
      this.$refs.dialog.open();
    },
    addType() {
      this.$prompt("请输入类别", "新增类别", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: this.$validate.namesReg,
        inputErrorMessage: "只能输入汉字、字母、数字、下划线",
        closeOnClickModal: false
      })
        .then(({ value }) => {
          const data = { assnTypeName: value };
          addType(data)
            .then(res => {
              this.$message({
                message: "添加社团类别成功",
                type: "success"
              });
              this.updateTypeList();
              this.$refs.grid.queryData(true);
              this.$parent.$refs.grid.queryData(true);
            })
            .catch(err => {});
        })
        .catch(() => {});
    },
    editType() {
      if (Object.keys(this.pitchType).length > 0) {
        this.$prompt(
          `请输入&nbsp;<strong style="color: #E6A23C;">${this.pitchType.assnTypeName}</strong>&nbsp;类别的新名称`,
          "修改类别",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputPattern: this.$validate.namesReg,
            inputErrorMessage: "只能输入汉字、字母、数字、下划线",
            dangerouslyUseHTMLString: true,
            closeOnClickModal: false
          }
        )
          .then(({ value }) => {
            const data = { assnTypeName: value };
            data.assnTypeId = this.pitchType.assnTypeId;
            editType(data)
              .then(res => {
                this.$message({
                  message: "修改社团类别成功",
                  type: "success"
                });
                this.updateTypeList();
                this.$refs.grid.queryData(true);
                this.$parent.$refs.grid.queryData(true);
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
    deleteType() {
      if (Object.keys(this.pitchType).length > 0) {
        this.$confirm(
          `你确定要删除&nbsp;<strong style="color: #F56C6C;">${this.pitchType.assnTypeName}</strong>&nbsp;这个类别吗？`,
          "删除类别",
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
              assnTypeId: this.pitchType.assnTypeId,
              deleted: 1
            };
            deleteType(data)
              .then(res => {
                this.$message({
                  message: "删除社团类别成功",
                  type: "success"
                });
                this.updateTypeList();
                this.$refs.grid.queryData(true);
                this.$parent.$refs.grid.queryData(true);
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
    updateTypeList() {
      typeList()
        .then(res => {
          const typeList = [];
          for (const ele of res.data) {
            let temp = {};
            temp.label = ele.assnTypeName;
            temp.value = ele.assnTypeId;
            typeList.push(temp);
          }
          this.$store.commit("assn/changeTypeList", typeList);
        })
        .catch(err => {});
    }
  }
};
</script>
<style lang='scss' scoped>
.container {
  display: flex;
  .table {
    flex: 1;
  }
  .btnGourp {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    > div {
      margin-top: 20px;
    }
  }
}
</style>