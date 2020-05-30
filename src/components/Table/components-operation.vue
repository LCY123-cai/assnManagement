<template>
  <el-button type="text" @click="details">{{btnText}}</el-button>
</template>
<script>
export default {
  props: ["row", "column", "col"],
  data() {
    return {
      btnText: this.col.btnText || "查看详情"
    };
  },
  computed: {},
  methods: {
    details(){
      this.col.click(this.row)
    }
  },
  mounted() {}
};
</script>
<style lang="scss">
</style>
