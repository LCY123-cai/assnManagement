<template>
  <div>
    <el-table :data="tableData" ref="grid" v-bind="tableConfig" v-on="events" v-loading="loading">
      <template v-for="col in columnConfig">
        <!-- 序号列 -->
        <el-table-column v-bind="col" v-if="col.type === `index`" :index="indexMethod"></el-table-column>
        <!-- 常规列 -->
        <tableColumn :col="col" v-else></tableColumn>
      </template>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="pageSizeOpts"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="pagination"
      v-show="pageShow"
    ></el-pagination>
  </div>
</template>

<script>
import tableColumn from "./table-column.vue";
import { getList } from "@/api/table";
export default {
  components: {
    tableColumn
  },
  name: "x-table",
  data() {
    return {
      loading: false,
      loadingTime: 0,
      // 缓存config
      realConfig: {},
      // 缓存参数,导出使用参数
      configParams: {},
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      pageSizeOpts: [10, 20, 30, 40],
      total: 0,
      pageShow: true
    };
  },
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  computed: {
    // 默认配置
    tableConfig() {
      // let tableHeight = String(Number(this.$store.state.app.contextHeight)*1.2)
      let tableHeight = parseInt(
        document.documentElement.clientHeight * 0.7
      ).toString();
      let tableConfig = {
        border: true,
        height: tableHeight
      };
      return Object.assign(
        tableConfig,
        this.config.attrs ? this.config.attrs : {}
      );
    },
    // 表格方法
    events() {
      return this.config.events ? this.config.events : {};
    },
    // 表格配置
    columnConfig() {
      let list = [];
      // 格式化列表
      this.config.columns.forEach(col => {
        // 表格默认居中(后续增加默认配置)
        let columnConfig = {
          align: "center",
          // 不可拖动
          resizable: false
        };
        list.push(Object.assign(columnConfig, col));
      });
      return list;
    }
  },
  methods: {
    /**
     * @desc 网络请求，查询数据，有数据(data)，则不执行网络请求
     * @param {Boolean} goBack 是否回到首页，默认不回
     * @return {Array} 表格数据
     */
    queryData(goBack = false) {
      if (this.config.hasOwnProperty("data")) {
        return (this.tableData = this.config.data);
      } else {
        // 点击检索或者重置时，回到第一页，表格回到顶部
        if (goBack) {
          this.pageNum = 1;
          if (this.config.pagination) {
            this.pageSize = this.config.pagination["page-size"];
          }
        }
        this.$refs.grid.bodyWrapper.scrollTop = 0;
        // 缓存请求的config
        // this.realConfig = JSON.parse(JSON.stringify(this.config));
        this.realConfig = this.config;
        this.configParams = this.realConfig.params;
        // config中默认请求为get
        let method = this.config.method || "get";
        this.ajaxRequest(method);
      }
    },
    // 请求数据，对表格赋值
    ajaxRequest(method, fn) {
      // 开启表格遮罩（吴朝鑫）
      this.loading = true;
      let { url, params } = this.realConfig;
      // 请求方式params,如果有分页，加入分页
      let pagination = {};
      if (this.config.pagination) {
        pagination = {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        };
      }
      params = Object.assign(params, pagination);
      getList(params, url)
        .then(res => {
          // 判断是否正常请求
          if (20000 == res.code) {
            // 关闭表格遮罩
            this.loading = false;
            // 如果有回调函数,深拷贝一个回去，防止错误
            let copy = JSON.parse(JSON.stringify(res));
            if (fn) fn(copy);
            // 是否需要对数据进行特殊化处理
            if (this.config.dataFormatter) {
              return (this.tableData = this.config.dataFormatter(res));
            }
            // --------------------------------------------------------------------------------------------
            // 有分页的情况
            if (this.config.pagination) {
              this.total = res.data.total;
              return (this.tableData = res.data.record);
            }
            // 无分页的情况
            this.tableData = res.data;
            this.pageShow = false;
            // --------------------------------------------------------------------------------------------
          } else {
            // 关闭表格遮罩（吴朝鑫）
            this.loading = false;
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          // 关闭表格遮罩（吴朝鑫）
          this.loading = false;
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.queryData(false);
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.queryData(false);
    },
    indexMethod(index) {
      let curpage = this.pageNum;
      let limitpage = this.pageSize;
      return index + 1 + (curpage - 1) * limitpage;
    }
  },
  watch: {
    loading(val) {
      // 遮罩4000毫秒自动关闭
      if (val === true) {
        if (this.loadingTime) clearTimeout(this.loadingTime);
        this.loadingTime = setTimeout(() => {
          this.loading = false;
        }, 4000);
      }
    },
    config: {
      handler: function(newVal, oldVal) {
        this.config = newVal;
      },
      deep: true
    }
  },
  mounted() {
    // 默认分页
    if (this.config.pagination) {
      this.pageSize = this.config.pagination["page-size"];
      this.pageSizeOpts = this.config.pagination["page-size-opts"];
    }
    // 网络请求
    this.queryData();
  }
};
</script>

<style scoped>
.pagination {
  margin-top: 6px;
  float: right;
}
</style>
