<template>
  <div class="container">
    <countTo
      ref="countTo"
      :startVal="startVal"
      :endVal="endVal"
      :duration="duration"
      :suffix="suffix"
    ></countTo>
  </div>
</template>

<script>
import countTo from "vue-count-to";
export default {
  components: {
    countTo
  },
  props: {
    // 开始数值
    startVal: {
      type: Number,
      default: 0
    },
    // 结束数值
    endVal: {
      type: [Number,String],
      required: true
    },
    // 持续时间
    duration: {
      type: Number,
      default: 3000
    },
    // 后缀
    suffix: {
      type: String,
      default: ""
    }
    /**
     * 还有更多参数，插件vue-cout-to。这里不再列举，也不统一做处理
     */
  },
  data() {
    return {};
  },
  methods: {
    start() {
      this.$refs.countTo.start();
    }
    /**
     * 还有更多方法，插件vue-cout-to。这里不再列举，也不统一做处理
     */
  }
};
</script>

<style lang="scss" scoped>
.container{
  display: inline-block;
}
</style>
