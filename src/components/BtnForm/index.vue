<template>
  <div class="container">
    <div class="add-product" :class="{'open': formOpen}">
      <div class="button-copy" v-show="!formOpen" @click="open">申请加入</div>
      <div class="form">
        <slot></slot>
      </div>
      <div class="btnGroup">
        <div class="submit">
          <x-button ref="btn" @click="apply" text="申请加入" round></x-button>
        </div>
        <div class="cancel">
          <span @click="cancel()">取消</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formOpen: false
    };
  },
  methods: {
    open() {
      this.formOpen = true;
      this.$emit("reset");
    },
    cancel: function() {
      this.formOpen = false;
      this.$emit("reset");
    },
    apply() {
      this.$emit("submit");
    },
    openLoading() {
      this.$refs.btn.openLoading();
    },
    closeLoading() {
      this.$refs.btn.closeLoading();
    }
  }
};
</script>

<style lang="scss" scoped>
.btnGroup {
  display: none;
  width: 90%;
}
.container {
  position: relative;
}
.add-product {
  &.open {
    background-color: #fafafa;
    padding: 18px 32px;
    border-radius: 5px;
    width: 420px;
    height: 398px;
    cursor: default;
    position: relative;
    .form {
      opacity: 1;
      transition: opacity 0.1s ease;
      transition-delay: 0.3s;
      height: auto;
      position: absolute;
      bottom: 40%;
    }
    .btnGroup {
      position: absolute;
      display: block;
      bottom: 10px;
    }
  }
  transition: all 0.3s ease;
  background-color: #3498db;
  height: 144px;
  width: 144px;
  border-radius: 72px;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.07);
  cursor: pointer;
  .button-copy {
    text-align: center;
    line-height: 144px;
    text-transform: uppercase;
    font-weight: bold;
    color: #f7f7f7;
  }
  .form {
    transition: none;
    opacity: 0;
    height: 0;
    overflow: hidden;
  }
  .cancel {
    font-size: 12px;
    text-align: center;
    margin-top: 1em;
    color: #606266;
    span {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.submit {
  text-align: center;
}
</style>
