<template>
  <el-drawer
    :title="title"
    :visible.sync="drawer"
    :direction="direction"
    size="80%"
  >
    <div class="container">
      <tinymce :height="300" :value="articleInfo.richText" ref="tinymce"></tinymce>
      <div class="btnGourp">
        <el-button type="primary" @click="updateArticle">修改</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import tinymce from "@/components/Tinymce";
import { updateArticle } from "@/api/assnArticle";
export default {
  components: {
    tinymce
  },
  props: {
    articleInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      drawer: false,
      direction: "btt"
    };
  },
  computed: {
    title(){
      return "修改文章"+`（${this.articleInfo.articleTitle}-${this.articleInfo.assnName}）`
    }
  },
  methods: {
    open() {
      this.drawer = true;
    },
    updateArticle() {
      const richText = this.$refs.tinymce.getContent();
      const data = { id: this.articleInfo.id, richText };
      updateArticle(data).then(res => {
        this.drawer = false;
        this.$message.success("更新文章成功");
        this.$parent.$refs.grid.queryData(true);
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.container {
  padding: 0 10px;
  .btnGourp {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>