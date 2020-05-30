<template>
  <div class="dashboard-container">
    <div id="wrap">
      <form>
        <input type="text" placeholder="想要查询什么社团？" v-model="quickAssn" @keyup.enter="goAssn" />
        <input type="button" />
      </form>
    </div>
    <div class="dashboard-text">
      <span class="username">{{ name }}</span>,欢迎您使用本系统
    </div>
    <p class="dashboard-text indentSpan">
      您的权限为:
      <span>{{ role }}</span>
    </p>
    <div class="pageMain">
      <div class="article">
        <el-card class="box-card">
          <div slot="header">
            <div class="articleHeader">
              <husky class="husky"></husky>
              <div class="boxName">
                社团宣传
                <span v-html="textShowSpan"></span>
              </div>
            </div>
          </div>
          <div class="articleMain">
            <div v-if="!articleList.length" class="hintText">哎呀，暂无数据:(。等待发布吧～</div>
            <div v-for="(item,index) in articleList" :key="index" class="text item" @click="articleShow(item)">
              <el-badge
                :value="item.clicks"
                class="badge"
                type="primary"
              >
                <div>
                  {{item.articleTitle}}
                  <span>{{item.assnName}}&nbsp;{{$formatter.time(item.gmtCreate)}}</span>
                </div>
              </el-badge>
            </div>
          </div>
        </el-card>
      </div>
      <el-card class="box-card" shadow="always">
        <div slot="header" class="clearfix">
          <p>快速导航</p>
          <div class="imgContainer" @click="goPersonalCenter()">
            <img :src="avatar" class="image" />
          </div>
        </div>
        <div class="item" @click="goPersonalCenter()">我的个人信息</div>
        <div class="item" @click="goPersonalCenter('myAssn')">
          我加入了
          <span class="brandHint">{{assnCount}}</span> 个社团
        </div>
        <div class="item" @click="goPersonalCenter('myMessageList')">
          我有
          <span class="warnHint">{{applicationCount}}</span> 个申请消息未读
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import card from "@/components/CardShow";
import husky from "@/components/Husky";
import { applicationCount } from "@/api/assnApplication";
import { myAssn } from "@/api/assnMember";
import { articleList } from "@/api/assnArticle";
export default {
  components: {
    card,
    husky
  },
  name: "Dashboard",
  data() {
    return {
      quickAssn: "",
      applicationCount: 0,
      assnCount: 0,
      textShowSpan:
        "<span  class='animated fadeInDown' style='color:#8e44ad'>快去参加有趣社团吧！</span>",
      articleList: []
    };
  },
  computed: {
    // ...mapGetters(["name", "roles"]),
    name() {
      return this.$store.state.user.name;
    },
    role() {
      const roleCodeList = {
        admin: "管理员",
        editor: "社团维护者",
        visitor: "游客"
      };
      const role = this.$store.state.user.roles[0];
      for (const [key, value] of Object.entries(roleCodeList)) {
        if (key === role) {
          return value;
        }
      }
    },
    avatar() {
      if (this.$store.state.user.avatar) {
        return this.$imgUrl + this.$store.state.user.avatar;
      } else {
        return this.$imgExample;
      }
    }
  },
  methods: {
    goAssn() {
      this.$router.push({
        name: "浏览社团",
        params: { assnName: this.quickAssn }
      });
    },
    goPersonalCenter(activeName) {
      this.$router.push({
        name: "个人中心",
        query: { activeName: activeName }
      });
    },
    getApplicationCount() {
      const assnIds = this.$store.state.user.assnIds;
      applicationCount({ assnIds }).then(res => {
        this.applicationCount = res.data.count;
        if (this.applicationCount > 0) {
          this.$notify.info({
            title: "提示",
            message: "你有新的消息，请注意查收哦",
            onClick: () => {
              this.$router.push({
                name: "个人中心",
                query: { activeName: "myMessageList" }
              });
            }
          });
        }
      });
    },
    getAssnCount() {
      myAssn().then(res => {
        this.assnCount = res.data.length;
      });
    },
    textShowLoop() {
      let count = -1;
      const timer = setInterval(() => {
        count++;
        const colors = ["#2C3E50", "#16a085", "#c0392b", "#2980b9", "#8e44ad"];
        const texts = [
          "快来看看社团文章吧！",
          "哪个社团最适合你呢？",
          "新的大陆等你发掘呢。",
          "试一试点击下面文章？",
          "快去参加有趣社团吧！"
        ];
        if (count > 4) {
          count = 0;
        }
        this.textShowSpan = `<span class="animated fadeInDown" style='color:${colors[count]}'>${texts[count]}</span>`;
      }, 3000);
    },
    getArticleList() {
      articleList().then(res => {
        this.articleList = res.data;
      });
    },
    articleShow(item) {
      this.$router.push({ name: "文章展示", params: item });
    }
  },
  created() {
    this.getApplicationCount();
    this.getAssnCount();
    this.textShowLoop();
    this.getArticleList();
  }
};
</script>

<style lang="scss">
.dashboard {
  &-container {
    margin: 30px;
    .indentSpan {
      margin: 0;
      text-indent: 1em;
    }
    .dashboard-text {
      font: 100 3.5em "Helvetica Neue", "Open Sans", sans-serif;
      color: #aeaeae;
      line-height: 0.82;
    }
    .username {
      color: #259dff;
    }
    .pageMain {
      overflow: hidden;
      margin-top: 10px;
      display: flex;
      justify-content: space-around;
    }
    .article {
      width: 100%;
      .articleHeader {
        display: flex;
        align-items: center;
        justify-content: space-around;
        .boxName {
          font-size: 30px;
        }
      }
      .hintText {
        font-size: 30px;
        text-align: center;
        font-weight: 350;
      }
    }
    .box-card {
      .articleMain {
        overflow-y: auto;
        overflow-x: hidden;
        height: 350px;
        span {
          float: right;
        }
        .badge {
          display: block;
          width: 97%;
          > div {
            width: 98%;
          }
        }
      }
      height: 550px;
      width: 90%;
      border-radius: 10px;
      .item {
        padding: 10px;
        cursor: pointer;
        transition: 0.4s ease;
      }
      .item:hover {
        background-color: #c0c4cc;
        transform: scale(1.009, 1.009);
      }
      .imgContainer {
        display: flex;
        justify-content: center;
        cursor: pointer;
        img {
          max-width: 450px;
          max-height: 400px;
        }
      }
      img {
        transition: 0.5s ease;
      }
      img:hover {
        transform: scale(1.05, 1.05);
      }
    }
    .brandHint {
      color: #409eff;
    }
    .warnHint {
      color: #e6a23c;
    }
    // 搜索栏css
    #wrap {
      // margin: 50px 100px;
      // display: inline-block;
      position: relative;
      height: 60px;
      float: right;
      padding: 0;
      // overflow: hidden;
      input[type="text"] {
        height: 60px;
        font-size: 55px;
        display: inline-block;
        font-family: "Lato";
        font-weight: 100;
        border: none;
        outline: none;
        color: #555;
        padding: 3px;
        padding-right: 60px;
        width: 0px;
        position: absolute;
        top: 0;
        right: 0;
        background: none;
        z-index: 3;
        transition: width 0.4s cubic-bezier(0, 0.795, 0, 1);
        cursor: pointer;
      }

      input[type="text"]:focus:hover {
        border-bottom: 1px solid #bbb;
      }

      input[type="text"]:focus {
        width: 540px;
        z-index: 1;
        border-bottom: 1px solid #bbb;
        cursor: text;
      }
      input[type="button"] {
        height: 67px;
        width: 63px;
        display: inline-block;
        color: red;
        float: right;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADNQTFRFU1NT9fX1lJSUXl5e1dXVfn5+c3Nz6urqv7+/tLS0iYmJqampn5+fysrK39/faWlp////Vi4ZywAAABF0Uk5T/////////////////////wAlrZliAAABLklEQVR42rSWWRbDIAhFHeOUtN3/ags1zaA4cHrKZ8JFRHwoXkwTvwGP1Qo0bYObAPwiLmbNAHBWFBZlD9j0JxflDViIObNHG/Do8PRHTJk0TezAhv7qloK0JJEBh+F8+U/hopIELOWfiZUCDOZD1RADOQKA75oq4cvVkcT+OdHnqqpQCITWAjnWVgGQUWz12lJuGwGoaWgBKzRVBcCypgUkOAoWgBX/L0CmxN40u6xwcIJ1cOzWYDffp3axsQOyvdkXiH9FKRFwPRHYZUaXMgPLeiW7QhbDRciyLXJaKheCuLbiVoqx1DVRyH26yb0hsuoOFEPsoz+BVE0MRlZNjGZcRQyHYkmMp2hBTIzdkzCTc/pLqOnBrk7/yZdAOq/q5NPBH1f7x7fGP4C3AAMAQrhzX9zhcGsAAAAASUVORK5CYII=)
          center center no-repeat;
        text-indent: -10000px;
        border: none;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 2;
        opacity: 0.4;
        cursor: pointer;
        transition: opacity 0.4s ease;
      }

      input[type="button"]:hover {
        opacity: 0.8;
      }
    }
    // 搜索栏css结束
  }
}
</style>
