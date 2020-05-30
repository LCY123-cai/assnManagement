<template>
  <div>
    <el-form
      :inline="true"
      :model="browseAssn"
      class="demo-form-inline"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="社团名称">
        <x-input
          v-model="browseAssn.assnName"
          :autocomplete="true"
          :fetch-suggestions="querySearchAsync"
          value-key="assnName"
        ></x-input>
      </el-form-item>
      <el-form-item label="社团类别">
        <x-select v-model="browseAssn.assnTypeId" :options="typeList"></x-select>
      </el-form-item>
      <el-form-item label="是否纳新">
        <x-select v-model="browseAssn.isHiring"></x-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="reset" plain>重置</el-button>
      </el-form-item>
    </el-form>
    <transition-group class="cardContainer" tag="div" appear name="list">
      <card
        :data-image="imgUrl(item)"
        v-for="(item,index) in assnList"
        :key="item.assnId"
        class="card"
        @click.native="showDetails(item)"
      >
        <h1 slot="header" v-text="item.assnName"></h1>
        <p slot="content" v-text="item.assnIntroduce || '暂无介绍哦～'"></p>
      </card>
      <card
        :data-image="imgUrl(item)"
        v-for="(item,index) in replenish"
        :key="index+'key'"
        class="replenish"
      >
        <h1 slot="header"></h1>
        <p slot="content"></p>
      </card>
    </transition-group>
  </div>
</template>

<script>
import card from "@/components/CardShow";
import { typeList, assnNameList, assnList } from "@/api/assn";
export default {
  components: {
    card
  },
  data() {
    return {
      browseAssn: {},
      typeList: [],
      assnList: [],
      // 布局使用flex，补充组件，防止错乱
      replenish: 0,
      //总共多少页
      pageTotal: 0,
      // 计数
      pageCount: 0
    };
  },
  computed: {},
  methods: {
    search() {
      this.getAssnList(1, 12, this.browseAssn, true);
    },
    reset() {
      this.browseAssn = {};
      this.getAssnList(1, 12, this.browseAssn, true);
    },
    imgUrl(item) {
      if (item.assnImg) {
        return this.$imgUrl + item.assnImg;
      } else {
        return this.$imgExample;
      }
    },
    querySearchAsync(queryString, cb) {
      if (queryString) {
        assnNameList().then(res => {
          const restaurants = res.data;
          const results = restaurants.filter(function(item, index, array) {
            return (
              item.assnName.toLowerCase().indexOf(queryString.toLowerCase()) !==
              -1
            );
          });
          cb(results);
        });
      } else {
        cb([]);
      }
    },
    getAssnList(pageNum = 1, pageSize = 12, data, reset = false) {
      const params = { pageNum, pageSize, ...data };
      assnList(params).then(res => {
        const data = res.data.record;
        const total = res.data.total;
        if (reset) {
          this.pageCount = 0;
          this.assnList = data;
        } else {
          this.assnList.push(...data);
        }
        if (this.pageCount === 0) {
          this.pageTotal = Math.ceil(total / 12);
        }
        this.pageCount++;
        if (data.length < 12) {
          this.replenish = 12 - data.length;
        }
      });
    },
    windowScroll() {
      if (this.pageCount < this.pageTotal) {
        this.getAssnList(this.pageCount);
      }
    },
    showDetails(assnInfo) {
      this.$router.push({
        path: "assnDetails",
        query: { assnId: assnInfo.assnId }
      });
    },
    quickSearch() {
      if (this.$route.params.assnName) {
        this.$set(this.browseAssn, "assnName", this.$route.params.assnName);
        this.search();
      }
    }
  },
  created() {
    typeList().then(res => {
      const typeList = [];
      for (const ele of res.data) {
        let temp = {};
        temp.label = ele.assnTypeName;
        temp.value = ele.assnTypeId;
        typeList.push(temp);
      }
      this.typeList = typeList;
    });
    this.getAssnList();
    window.addEventListener("scroll", this.windowScroll);
    this.quickSearch();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.windowScroll);
  }
};
</script>

<style lang="scss" scoped>
.list-enter,
.list-leave-to {
  opacity: 0;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-move {
  transition: all 1s ease;
}
.list-leave-active {
  position: absolute;
}

.cardContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.card {
  margin-bottom: 20px;
}
.replenish {
  visibility: hidden;
}
</style>
