<template>
  <div>
    <div class="assnContainer">
      <div class="assnImg">
        <div>
          <el-image
            :src="imgUrl(assnInfo)"
            :fit="showType"
            :preview-src-list="imgArrayUrl(assnInfo)"
            class="img"
          >
            <div slot="placeholder" class="image-slot">
              加载中
              <span class="dot">...</span>
            </div>
          </el-image>
        </div>
      </div>
      <div class="assnInfo">
        <div class="name">{{assnInfo.assnName}}</div>
        <div class="type">社团类别：{{assnInfo.assnTypeName}}</div>
        <div class="assnCount">
          <span>
            社团部门数：
            <count :endVal="departmentTotal" class="count"></count>
          </span>
          <span>
            社团人数：
            <count :endVal="assnPeopleTotal" class="count"></count>
          </span>
        </div>
        <div class="introduce">{{assnInfo.assnIntroduce}}</div>
        <div class="btnForm">
          <btnForm @submit="applyAssn" @reset="resetForm" ref="btnForm">
            <el-form label-width="110px" :model="applyForm" :rules="rules" ref="ruleForm">
              <el-form-item label="想加入的部门" prop="departmentId">
                <x-select v-model="applyForm.departmentId" :options="departmentList"></x-select>
              </el-form-item>
              <el-form-item label="申请理由" prop="remark">
                <x-input
                  type="textarea"
                  v-model="applyForm.remark"
                  maxlength="100"
                  rank="2"
                  :rows="4"
                ></x-input>
              </el-form-item>
            </el-form>
          </btnForm>
        </div>
      </div>
    </div>
    <div class="eCharts">
      <div class="pieChart" ref="pieChart"></div>
      <div class="categoryChart" ref="categoryChart"></div>
    </div>
  </div>
</template>

<script>
import { assnList } from "@/api/assn";
import { departmentList } from "@/api/assnDepartment";
import { apply } from "@/api/assnApplication";
import { memberSex, memberCount } from "@/api/assnMember";
import count from "@/components/CountTo";
import btnForm from "@/components/BtnForm";
export default {
  components: {
    count,
    btnForm
  },
  data() {
    return {
      suffix: 12,
      showType: "fill",
      assnInfo: {},
      departmentList: [],
      applyForm: {
        departmentId: "",
        remark: ""
      },
      rules: {
        departmentId: [
          { required: true, message: "请选择社团部门", trigger: "change" }
        ],
        remark: [{ required: true, message: "请输入申请理由", trigger: "blur" }]
      }
    };
  },
  computed: {
    departmentTotal() {
      if (this.assnInfo.departmentTotal) {
        return this.assnInfo.departmentTotal;
      } else {
        return 0;
      }
    },
    assnPeopleTotal() {
      if (this.assnInfo.assnPeopleTotal) {
        return this.assnInfo.assnPeopleTotal;
      } else {
        return 0;
      }
    }
  },
  methods: {
    imgUrl(item) {
      if (item.assnImg) {
        return this.$imgUrl + item.assnImg;
      } else {
        return this.$imgExample;
      }
    },
    imgArrayUrl(item) {
      if (item.assnImg) {
        const list = [];
        list.push(this.$imgUrl + item.assnImg);
        return list;
      } else {
        const list = [];
        list.push(this.$imgExample);
        return list;
      }
    },
    getAssnInfo() {
      const assnId = this.$route.query.assnId;
      const params = { assnId };
      assnList(params).then(res => {
        const data = res.data.record;
        this.assnInfo = data[0];
      });
    },
    applyAssn() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$refs.btnForm.openLoading();
          const params = Object.assign({}, this.applyForm);
          params.assnId = this.$route.query.assnId;
          apply(params)
            .then(res => {
              this.$refs.btnForm.closeLoading();
              this.$refs.btnForm.cancel();
              this.$message({
                message: "申请已提交",
                type: "success"
              });
            })
            .catch(err => {
              this.$refs.btnForm.closeLoading();
            });
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    getDepartmentList() {
      const assnId = this.$route.query.assnId;
      const params = { assnId };
      departmentList(params).then(res => {
        const data = res.data;
        const departmentList = [];
        for (const el of data) {
          const temp = {};
          temp.value = el.departmentId;
          temp.label = el.departmentName;
          departmentList.push(temp);
        }
        this.departmentList = departmentList;
      });
    },
    initCharts() {
      this.getMemberSex();
      this.getMemberCount();
    },
    getMemberSex() {
      const assnId = this.$route.query.assnId;
      const params = { assnId };
      memberSex(params).then(res => {
        let manTotal = 0;
        let womenTotal = 0;
        for (const el of res.data) {
          if (el.userGender === 1) {
            manTotal = el.total;
          } else if (el.userGender === 0) {
            womenTotal = el.total;
          }
        }
        const pieChart = this.$echarts.init(this.$refs.pieChart);
        this.setPieOptions(pieChart, { manTotal, womenTotal });
      });
    },
    getMemberCount() {
      const assnId = this.$route.query.assnId;
      const params = { assnId };
      memberCount(params).then(res => {
        const categoryChart = this.$echarts.init(this.$refs.categoryChart);
        const year1 = new Date().getFullYear();
        const year2 = new Date().getFullYear() - 1;
        const year3 = new Date().getFullYear() - 2;
        const year = { year1, year2, year3 };
        this.setCategoryOptions(categoryChart, year, res.data);
      });
    },
    setPieOptions(chart, total) {
      chart.setOption({
        title: {
          text: "男女人数比例",
          subtext: "你是GG还是MM？",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["男", "女"]
        },
        series: [
          {
            name: "数值比例",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: total.manTotal, name: "男" },
              { value: total.womenTotal, name: "女" }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    setCategoryOptions(
      chart,
      { year1, year2, year3 },
      { total1, total2, total3 }
    ) {
      chart.setOption({
        title: {
          text: "社团每年增加人数",
          subtext: "近三年增长人数",
          left: "center"
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          type: "category",
          data: [`${year3}`, `${year2}`, `${year1}`]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [total3, total2, total1],
            type: "line"
          }
        ]
      });
    }
  },
  created() {
    this.getAssnInfo();
    this.getDepartmentList();
  },
  mounted() {
    this.initCharts();
  }
};
</script>

<style lang="scss">
.eCharts {
  display: flex;
  .pieChart {
    height: 400px;
    flex: 1;
  }
  .categoryChart {
    flex: 1;
    height: 400px;
  }
}
.assnContainer {
  display: flex;
  font-size: 21px;
  font-weight: 200;
  color: #606266;
  height: 400px;
  margin-bottom: 20px;
  .assnImg {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-right: 10px;
    .img {
      border-radius: 10px;
      img {
        max-width: 550px;
        max-height: 400px;
      }
    }
  }
  .assnInfo {
    flex: 1;
    height: 100%;
    position: relative;
    .name {
      font-weight: 400;
      font-size: 40px;
      color: #303133;
    }
    .assnCount {
      span {
        margin-right: 20px;
      }
      .count {
        color: #67c23a;
        font-size: 30px;
      }
    }
    .name,
    .type,
    .assnCount,
    .introduce {
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
    }
    .btnForm {
      display: flex;
      justify-content: center;
      position: relative;
      z-index: 999;
      top: 30%;
      transform: translateY(-50%);
    }
  }
}
</style>
