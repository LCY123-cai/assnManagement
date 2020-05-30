<!-- 默认表格组件 -->
<template>
  <span>{{text}}</span>
</template>
<script>
export default {
  props: ["row", "column", "col"],
  inject: {
    gridTable: {
      default: ""
    }
  },
  computed: {
    text() {
      let text = this.row[this.column.property];
      // 判断表格中是否有值，无值回传 -
      if (text === null || text === "") {
        text = this.$formatter.nullValue;
      } else {
        // 是否格式化数据
        if (this.col.format) {
          return this.$formatter[this.col.format](text, this.col.formatConfig);
        }
        // 代码表
        if (this.col.selects) {
          return this.$formatter.selects(
            text,
            this.col.selects,
            this.col.selectsExtend
          );
        }
      }
      return text;
    }
  }
};
</script>