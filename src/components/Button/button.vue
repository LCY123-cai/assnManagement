<template>
  <el-button v-bind="btnConfig" v-on="$listeners" :loading="btnLoading">{{btnText}}</el-button>
</template>

<script>
export default {
  name: "x-button",
  props: {
    text: {
      type: String,
      default: "默认"
    }
  },
  data() {
    return {
      btnText: this.text,
      btnLoading: false
    };
  },
  methods: {
    openLoading() {
      this.btnText = "加载中";
      this.btnLoading = true;
    },
    closeLoading() {
      this.btnText = this.text;
      this.btnLoading = false;
    }
  },
  computed: {
    btnConfig() {
      let btnConfig = {
        type: "primary"
      };
      return Object.assign(btnConfig, this.$attrs ? this.$attrs : {});
    }
  },
  watch: {
    text(newVal) {
      this.btnText = newVal;
    }
  }
};
</script>

<style scoped>
</style>
