<template>
  <div class="container">
    <div class="title">
      <h1>{{articleInfo.articleTitle}}</h1>
      <span class="assn">{{articleInfo.assnName}}</span>
      <span class="time">{{$formatter.time(articleInfo.gmtCreate)}}</span>
    </div>
    <div v-html="richText" class="richText"></div>
  </div>
</template>

<script>
import { clickArticle } from "@/api/assnArticle";
export default {
  data() {
    return {
      richText: "",
      articleInfo: {}
    };
  },
  methods: {
    initPage() {
      if (Object.keys(this.$route.params).length) {
        this.richText = this.$route.params.richText;
        this.articleInfo = this.$route.params;
        clickArticle({ id: this.articleInfo.id });
      } else {
        this.$router.push({ path: "dashboard" });
      }
    }
  },
  mounted() {
    this.initPage();
  }
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #e2e2e5;
  padding: 10px;
  width: 1200px;
  border: 1px solid #ddd;
  margin: 0 auto;
  border-radius: 10px;
  .title {
    display: flex;
    align-items: center;
  }
  .assn {
    font-weight: 200;
    margin-left: auto;
  }
  .time {
    color: #999;
    font-size: 14px;
    margin-left: 10px;
  }
  .richText {
    word-break: break-all;
    overflow: hidden;
  }
}
</style>
