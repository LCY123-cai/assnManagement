<template>
  <div class="myAssn">
    <noData v-if="!handleAssnList.length&&!myAssnList.length"></noData>
    <el-card class="box-card" v-for="(item,index) of handleAssnList" :key="item.assnId" shadow="hover">
      <div slot="header" class="clearfix">
        <span>{{item.assnName}}</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="goAssnDetails(item)">查看社团</el-button>
      </div>
      <div class="text item">社团负责人</div>
      <div class="text item">上任时间：{{gmtModified(item)}}</div>
    </el-card>
    <el-card class="box-card" v-for="(item,index) of myAssnList" :key="index" shadow="hover">
      <div slot="header" class="clearfix">
        <span>{{item.assnName}}</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="goAssnDetails(item)">查看社团</el-button>
      </div>
      <div class="text item">部门名称：{{item.departmentName}}</div>
      <div class="text item">加入时间：{{gmtModified(item)}}</div>
    </el-card>
  </div>
</template>

<script>
import noData from "@/components/Nodata";
import { myHandleAssn } from "@/api/assn";
import { myAssn } from "@/api/assnMember";
export default {
  components: {
    noData
  },
  data() {
    return {
      handleAssnList: [],
      myAssnList: []
    };
  },
  methods: {
    getMyAssn() {
      myAssn().then(res => {
        this.myAssnList = res.data;
      });
    },
    getMyHandleAssn() {
      myHandleAssn().then(res => {
        this.handleAssnList = res.data;
      });
    },
    gmtModified(item) {
      return this.$formatter.time(item.gmtModified, "YYYY/MM/DD HH:mm:ss");
    },
    goAssnDetails(item){
      this.$router.push({
        name: "社团详情",
        query: { assnId: item.assnId }
      });
    }
  },
  created() {
    this.getMyAssn();
    this.getMyHandleAssn();
  }
};
</script>

<style lang="scss" scoped>
.myAssn {
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }

  .box-card {
    width: 460px;
    display: inline-block;
    margin-left: 40px;
  }
}
</style>

