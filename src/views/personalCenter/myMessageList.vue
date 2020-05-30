<template>
  <div class="myMessageList">
    <noData v-if="!messageList.length"></noData>
    <el-card class="box-card" shadow="hover" v-if="messageList.length">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item v-for="(item,index) in messageList" :name="index">
          <template slot="title">
            <div :class="[Boolean(item.isHandle)?'successHint':'warningHint']">
              <i :class="[Boolean(item.isHandle)?'el-icon-success':'el-icon-more']"></i>
              <span>{{item.userName}} {{handleDescribe(item)}} {{item.assnName}} 社团 {{item.departmentName}} 部门</span>
            </div>
            <div class="btnGroup">
              <el-popconfirm
                title="你确定要取消社团申请吗？"
                @onConfirm="cancelApply(item)"
                v-if="isSelf(item)&&!item.isHandle"
              >
                <el-button type="text" slot="reference" @click.stop>取消申请</el-button>
              </el-popconfirm>
              <el-popconfirm
                title="你确定要同意本条社团申请吗？"
                @onConfirm="agreeApply(item)"
                v-if="permission(item)&&!item.isHandle"
              >
                <el-button type="text" slot="reference" @click.stop>同意</el-button>
              </el-popconfirm>
              <el-popconfirm
                title="你确定要拒绝本条社团申请吗？"
                @onConfirm="refuseApply(item)"
                v-if="permission(item)&&!item.isHandle"
              >
                <el-button type="text" slot="reference" @click.stop>拒绝</el-button>
              </el-popconfirm>
            </div>
          </template>
          <div v-if="isSelf(item)">
            <el-steps :active="handleStatus(item)" align-center>
              <el-step title="用户申请" icon="el-icon-edit"></el-step>
              <el-step title="社团维护者审核" icon="el-icon-upload"></el-step>
              <el-step title="成功加入" icon="el-icon-success"></el-step>
            </el-steps>
            <div class="describeText">{{handleResult(item)}}</div>
          </div>
          <div v-else>
            <div class="userInfo">
              <div>
                用户信息：
                <span>{{item.userAccount}}</span>
                <span>{{item.userName}}</span>
                <span>{{item.userGender?"男":"女"}}</span>
              </div>
              <div>个人介绍：{{item.userIntroduction}}</div>
              <div>申请理由：{{item.remark}}</div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
import {
  applicationList,
  deleteApplication,
  handleApplication
} from "@/api/assnApplication";
import noData from "@/components/Nodata";
export default {
  components: {
    noData
  },
  data() {
    return {
      activeName: "",
      assnIds: [],
      messageList: []
    };
  },
  methods: {
    cancelApply(item) {
      const id = item.id;
      deleteApplication({ id, deleted: 1 }).then(res => {
        this.$message({
          message: "取消申请成功",
          type: "success"
        });
        this.getApplicationList();
      });
    },
    agreeApply(item) {
      const id = item.id;
      const params = { isHandle: 1, isAgree: 1, id, applicationInfo: item };
      handleApplication(params).then(res => {
        this.$message({
          message: `已让${item.userName}加入${item.assnName} 社团 ${item.departmentName} 部门`,
          type: "success"
        });
        this.getApplicationList();
      });
    },
    refuseApply(item) {
      const id = item.id;
      const params = { isHandle: 1, isAgree: 0, id };
      handleApplication(params).then(res => {
        this.$message({
          message: `已拒绝让${item.userName}加入${item.assnName} 社团 ${item.departmentName} 部门`,
          type: "success"
        });
        this.getApplicationList();
      });
    },
    getApplicationList() {
      const assnIds = this.$store.state.user.assnIds;
      this.assnIds = assnIds;
      const params = { assnIds };
      applicationList(params).then(res => {
        const data = res.data;
        this.messageList = data;
      });
    },
    permission(item) {
      return this.assnIds.indexOf(item.assnId) !== -1;
    },
    isSelf(item) {
      return item.userId === this.$store.state.user.userId;
    },
    handleDescribe(item) {
      if (item.isHandle) {
        if (item.isAgree) {
          return "已被同意加入";
        } else {
          return "已被拒绝加入";
        }
      } else {
        return "申请加入";
      }
    },
    handleStatus(item) {
      if (item.isHandle) {
        if (item.isAgree) {
          return 3;
        } else {
          return 1;
        }
      } else {
        return 2;
      }
    },
    handleResult(item) {
      if (item.isHandle) {
        if (item.isAgree) {
          return "你已成功加入该社团，为你的社团贡献自己的一份力吧！";
        } else {
          return "不好意思，你本次申请被拒绝了:(";
        }
      } else {
        return "社团维护者正在审核当中，请稍后";
      }
    }
  },
  created() {
    this.getApplicationList();
  }
};
</script>

<style lang="scss">
@import "@/css/common.scss";
.myMessageList {
  .successHint {
    color: $color-success;
    font-size: 16px;
  }
  .warningHint {
    color: $color-warning;
    font-size: 16px;
  }
  .userInfo{
    font-size: 14px;
    color: $ordinary-font-color;
    font-weight: 340;
  }
  .btnGroup {
    margin-left: auto;
  }
  .describeText {
    margin-top: 10px;
    text-align: center;
  }
  .el-icon-arrow-right {
    margin: 0 0 0 10px;
  }
}
</style>

