<template>
  <div>
    <noData v-if="!recordList.length"></noData>
    <el-timeline>
      <el-timeline-item
        v-for="(item,index) in recordList"
        :key="index"
        :timestamp="gmtModified(item)"
        v-bind="timelineConfig(item)"
      >
        <el-card>
          <h4>{{handleType(item)}} {{item.assnName}} 社团</h4>
          <p>{{item.handleName}} 操作于 {{gmtModified(item)}}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import noData from "@/components/Nodata";
import { recordList } from "@/api/assnRecord";
export default {
  components: {
    noData
  },
  data() {
    return {
      recordList: {}
    };
  },
  computed: {},
  methods: {
    handleType(item) {
      return Boolean(item.handleType) ? "加入" : "退出";
    },
    gmtModified(item) {
      return this.$formatter.time(item.gmtModified, "YYYY/MM/DD HH:mm:ss");
    },
    timelineConfig(item) {
      const defaultConfig = { placement: "top" };
      if (Boolean(item.handleType)) {
        return Object.assign(defaultConfig, {
          type: "primary",
          icon: "el-icon-success"
        });
      } else {
        return Object.assign(defaultConfig, {
          type: "warning",
          icon: "el-icon-warning"
        });
      }
    },
    getUserRecords() {
      recordList().then(res => {
        this.recordList = res.data;
      });
    }
  },
  created() {
    this.getUserRecords();
  }
};
</script>

<style scoped>
</style>

