<template>
  <div>
    <div class="searchBlock">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        :inline="true"
      >
        <el-form-item label="可操作社团" prop="assnId">
          <x-select v-model="ruleForm.assnId" placeholder="请选择" :options="handleAssns"></x-select>
        </el-form-item>
        <el-form-item label="文章标题" prop="articleTitle">
          <x-input v-model="ruleForm.articleTitle"></x-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="operateBlock">
      <tinymce ref="tinymce"></tinymce>
      <el-button type="primary" @click="issue" class="issueBtn">发布内容</el-button>
    </div>
  </div>
</template>

<script>
import tinymce from "@/components/Tinymce";
import { issueArticle } from "@/api/assnArticle";
export default {
  components: {
    tinymce
  },
  data() {
    return {
      ruleForm: {
        assnId: ""
      },
      rules: {
        assnId: [
          { required: true, message: "请选择操作社团", trigger: "change" }
        ],
        articleTitle: [
          { required: true, message: "请选择文章标题", trigger: "blur" }
        ]
      }
    };
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
  methods: {
    issue() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let data = Object.assign({}, this.ruleForm);
          const params = {
            ...data,
            richText: this.$refs.tinymce.getContent()
          };
          issueArticle(params)
            .then(res => {
              this.$message.success("文章已发布");
              this.$router.push({ path: "articleList" });
            })
            .catch(err => {
              this.$message.error("发布失败，请联系管理员");
            });
        } else {
          return false;
        }
      });
    }
  },
  created() {}
};
</script>

<style lang="scss" scoped>
.issueBtn {
  float: right;
  margin-top: 15px;
}
</style>
