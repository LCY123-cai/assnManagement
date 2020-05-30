<template>
  <div class="assnListContainer">
    <el-form
      :inline="true"
      :model="articleForm"
      class="demo-form-inline baseFrom"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="社团名称">
        <x-input
          v-model="articleForm.assnName"
          :autocomplete="true"
          :fetch-suggestions="queryAssnAsync"
          value-key="assnName"
        ></x-input>
      </el-form-item>
      <el-form-item label="文章标题">
        <x-input v-model="articleForm.articleTitle"></x-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="reset" plain>重置</el-button>
      </el-form-item>
    </el-form>
    <div class="btnGroup">
      <el-button
        type="primary"
        @click="viewArticle(pitchArticle)"
      >查看文章</el-button>
      <el-button
        type="primary"
        @click="deleteArticle"
        :disabled="systemPermission?!systemPermission:!assnPermission"
      >删除文章</el-button>
      <el-button
        type="primary"
        @click="editArticle"
        :disabled="systemPermission?!systemPermission:!assnPermission"
      >修改文章</el-button>
    </div>
    <x-table ref="grid" :config="config"></x-table>
    <editArticle ref="editArticle" :articleInfo="pitchArticle"></editArticle>
  </div>
</template>

<script>
import tinymce from "@/components/Tinymce";
import editArticle from "./editArticle";
import { assnNameList } from "@/api/assn";
import { deleteArticle } from "@/api/assnArticle";
export default {
  components: {
    tinymce,
    editArticle
  },
  data() {
    return {
      articleForm: {},
      systemPermission: false,
      assnPermission: false,
      pitchArticle: {},
      config: {
        url: "/article/list",
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
            this.pitchArticle = val || {};
            this.assnPermission =
              this.$store.state.user.assnIds.indexOf(
                this.pitchArticle.assnId
              ) !== -1;
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
            label: "文章标题",
            prop: "articleTitle"
          },
          {
            label: "社团名称",
            prop: "assnName"
          },
          {
            label: "文章创建人",
            prop: "userName"
          },
          {
            label: "文章点击量",
            prop: "clicks"
          },
          {
            label: "创建时间",
            prop: "gmtCreate",
            format: "time"
          }
        ]
      }
    };
  },
  computed: {},
  methods: {
    search() {
      this.config.params = Object.assign({}, this.articleForm);
      this.$refs.grid.queryData(true);
    },
    reset() {
      this.articleForm = {};
      this.config.params = this.articleForm;
      this.$refs.grid.queryData(true);
    },
    deleteArticle() {
      if (Object.keys(this.pitchArticle).length > 0) {
        this.$confirm(
          `你确定要删除&nbsp;<strong style="color: #F56C6C;">${this.pitchArticle.articleTitle}</strong>&nbsp;这个文章吗？`,
          "删除文章",
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
              id: this.pitchArticle.id,
              deleted: 1
            };
            deleteArticle(data).then(res => {
              this.$message.success("删除文章成功");
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
    editArticle() {
      if (Object.keys(this.pitchArticle).length > 0) {
        this.$refs.editArticle.open();
      } else {
        this.$message({
          message: "请至少选择一条数据",
          type: "warning"
        });
      }
    },
    viewArticle(item){
      this.$router.push({ name: "文章展示", params: item });
    },
    queryAssnAsync(queryString, cb) {
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
    }
  },
  created() {
    this.systemPermission =
      this.$store.state.user.roles.indexOf("admin") !== -1;
    this.assnPermission =
      this.$store.state.user.assnIds.indexOf(this.pitchArticle.assnId) !== -1;
  }
};
</script>

<style lang="scss" scoped>
.btnGroup {
  margin-bottom: 10px;
}
</style>
