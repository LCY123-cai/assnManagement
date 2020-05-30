
<template>
  <!-- 多级表头但是暂时未使用 -->
  <el-table-column v-if="col.columns && col.columns.length >= 1" v-bind="col">
    <table-column v-for="item in (col.columns)" :key="item.prop" :col="item"></table-column>
  </el-table-column>
  <el-table-column v-bind="col" v-else>
    <template slot-scope="scope">
      <component :is="renderColumns" v-bind="getCptBind(scope, col)"></component>
    </template>
  </el-table-column>
</template>
<script>
import operation from './components-operation.vue';
import defaultTemplate from './components-default';
export default {
  name: "table-column",
  components: {
    tableColumn: () => import("./table-column.vue")
  },
  props: {
    // 列基本属性
    col: {
      type: Object,
      required: true
    }
  },
  computed: {
    // 表格自定义组件配置
    renderColumns() {
      let col = this.col;
      // 定义一个默认的模板
      let component = defaultTemplate;
      if (col.component) {
        if (typeof col.component === "string") {
          // 定义几个标准的grid组件
          if (col.component == "operation") return operation;
          return component;
        } else {
          // 一般情况下，参数部位String，则传递component
          return col.component;
        }
      }
      return component;
    }
  },
  methods: {
    // 重新定义表格prop属性
    getCptBind({ row, column }, col) {
      const props = { row, column, col };
      return props;
    }
  }
};
</script>
