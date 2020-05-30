<template>
  <div class="x-shade" :style="style" v-if="show">
    <div class="text">{{message}}</div>
    <div class="x-loading-icon">
      <computed :is="loading"></computed>
    </div>
    <el-button
      class="button"
      v-if="button.buttonShow"
      :type="button.buttonType"
      @click="close(button)"
    >{{button.buttonText}}</el-button>
  </div>
</template>
<script>
import Loading1 from "./loadingComponents/x-loading-1";
import Loading2 from "./loadingComponents/x-loading-2";
import Loading3 from "./loadingComponents/x-loading-3";
import Loading4 from "./loadingComponents/x-loading-4";
import Loading5 from "./loadingComponents/x-loading-5";
import Loading6 from "./loadingComponents/x-loading-6";
export default {
  data() {
    return {
      // 消息
      message: "拼命加载中, 请稍后。",
      // 动画类型
      type: 2,
      // 显示隐藏
      show: true,
      style: "",
      // 按钮样式
      button: {
        buttonShow: true,
        buttonType: "info",
        buttonText: "关闭",
        click: ""
      }
    };
  },
  computed: {
    loading() {
      if (this.type == 1) {
        return require("./loadingComponents/x-loading-1.vue").default;
      } else if (this.type == 2) {
        return require("./loadingComponents/x-loading-2.vue").default;
      } else if (this.type == 3) {
        return require("./loadingComponents/x-loading-3.vue").default;
      } else if (this.type == 4) {
        return require("./loadingComponents/x-loading-4.vue").default;
      } else if (this.type == 5) {
        return require("./loadingComponents/x-loading-5.vue").default;
      } else {
        return require("./loadingComponents/x-loading-6.vue").default;
      }
    }
  },
  methods: {
    // close方法
    close(button) {
      // 判断button属性中是否传隐藏方法
      if (!button) {
        // 关闭遮罩
        this.show = false;
      } else if (typeof button.click === Function || button.click !== "") {
        button.click(() => {
          this.show = false;
        });
      } else {
        // 关闭遮罩
        this.show = false;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
@import "@/css/common.scss";
.x-shade {
  opacity: 0;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: #020202b8;
  z-index: 999999;
  transition: all 0.4s ease-out;
  .text {
    line-height: 25px;
    color: $color-primary;
    position: absolute;
    left: 50%;
    top: 50%;
    width: 500px;
    margin-top: 10px;
    margin-left: -250px;
    text-align: center;
    font-size: 16px;
  }
  .x-loading-icon {
    position: absolute;
    top: 0;
    height: 50vh;
    width: 100%;
  }
  .button {
    position: absolute;
    right: 1%;
    top: 2%;
    font-size: 16px;
  }
}
</style>
