<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="个人基本信息" name="myInfo">
        <myInfo></myInfo>
      </el-tab-pane>
      <el-tab-pane label="我的社团" name="myAssn">
        <myAssn></myAssn>
      </el-tab-pane>
      <el-tab-pane label="社团记录" name="myAssnRecord">
        <myAssnRecord></myAssnRecord>
      </el-tab-pane>
      <el-tab-pane label="申请列表" name="myMessageList">
        <myMessageList></myMessageList>
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="changePassword">
        <changePassword></changePassword>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import myInfo from "./myInfo";
import myAssn from "./myAssn";
import myAssnRecord from "./myAssnRecord";
import myMessageList from "./myMessageList";
import changePassword from "./changePassword";
export default {
  components: { myInfo, myAssn, myAssnRecord, myMessageList, changePassword },
  data() {
    return {
      activeName: "myInfo"
    };
  },
  methods: {},
  created(){
    if(this.$route.query.activeName){
      this.activeName = this.$route.query.activeName;
    }else{
      this.activeName = "myInfo";
    }
  }
};
</script>

<style scoped>
</style>

