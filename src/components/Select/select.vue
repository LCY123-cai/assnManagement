<template>
  <el-select v-model="selectValue" v-bind="attrs" v-on="$listeners">
    <el-option v-for="(item,index) in options" :key="index" :label="item.label" :value="item.value">
      <span style="float: left" v-if="customShow">{{ item.label }}</span>
      <span
        style="float: right; color: #8492a6; font-size: 13px"
        v-if="customShow"
      >{{ append[index] }}</span>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "x-select",
  props: {
    value: [Object, Array, String, Number],
    options: {
      type: [Array],
      default() {
        return [
          { label: "是", value: 1 },
          {
            label: "否",
            value: 0
          }
        ];
      }
    },
    append: {
      type: [Array],
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      customShow: false
    };
  },
  model: {
    prop: "value",
    event: "change"
  },
  methods: {},
  computed: {
    selectValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("change", val);
      }
    },
    attrs() {
      return Object.assign(
        {
          // 占位符
          placeholder: "全部",
          // 可搜索
          filterable: true,
          // 清空
          clearable: true
        },
        this.$attrs
      );
    }
  },
  watch: {
    append(newVal, oldVal) {
      if (newVal.length > 0) {
        this.customShow = true;
      }
    }
  },
  created() {
    if (this.append.length > 0) {
      this.customShow = true;
    }
  }
};
</script>

<style scoped>
</style>
