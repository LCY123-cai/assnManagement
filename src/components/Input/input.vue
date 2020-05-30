<template>
  <div class="x-input">
    <el-input v-model="inputValue" ref="input" v-bind="vBind" v-on="vOn()" v-if="!autocomplete"></el-input>
    <el-autocomplete v-model="inputValue" ref="autocomplete" v-bind="vBind" v-on="vOn()" v-else></el-autocomplete>
    <div class="x-input-extends" v-if="showIcon">
      <div
        class="x-input-word"
        v-if="isWordLimitVisible"
        :style="wordStyle"
      >{{ textLength }}/{{ upperLimit }}</div>
      <i class="el-icon-circle-close x-input-close" @click="clickIcon"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: "x-input",
  props: {
    value: [Object, Array, String, Number],
    // 校验等级,暂时无用
    rank: {
      Type: Number,
      default: 5
    },
    // 是否显示字数限制
    showWordLimit: {
      type: Boolean,
      default: true
    },
    // 字数
    maxlength: {
      type: [Number, String],
      default: 20
    },
    // 是否有清除功能
    clearable: {
      type: Boolean,
      default: true
    },
    // 输入建议
    autocomplete: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      wordOpacity: 0
    };
  },
  model: {
    prop: "value",
    event: "change"
  },
  computed: {
    inputValue: {
      get() {
        if (this.value) {
          // 过滤特殊字符
          return this.formatter(this.value);
        }
        return this.value;
      },
      set(val) {
        this.$emit("change", val);
      }
    },
    // input属性
    vBind() {
      return Object.assign(
        {
          clearable: this.clearable,
          "show-word-limit": this.showWordLimit,
          type: "text",
          maxlength: this.maxlength
        },
        this.$attrs
      );
    },
    // 字数显示样式
    wordStyle() {
      return {
        opacity: this.wordOpacity
      };
    },
    // 显示清除图标，字数限制
    showIcon() {
      // 是否显示密码
      let showPassword = this.$attrs["show-password"] || false;
      // 是否禁用
      let disabled = this.$attrs["disabled"] || false;
      // 是否只读
      let readonly = this.$attrs["readonly"] || false;
      if (showPassword || disabled || readonly) {
        return false;
      } else {
        return true;
      }
    },
    // 是否显示字数
    isWordLimitVisible() {
      return this.maxlength;
    },
    // 最大长度
    upperLimit() {
      return this.maxlength;
    },
    // 实际长度
    textLength() {
      if (typeof this.inputValue === "number") {
        return String(this.inputValue).length;
      }
      return (this.inputValue || "").length;
    }
  },
  methods: {
    formatter(val) {
      // 获取公共校验类型
      let re = this.$validate.validatorRank(this.rank);
      if (val) return val.replace(re, "");
    },
    // input事件
    vOn() {
      return {
        focus: () => {
          this.wordOpacity = 1;
        },
        blur: () => {
          // 重新过滤一次特殊字符，避免最后一位错误
          this.$emit("change", this.formatter(this.inputValue));
          this.$emit("blur", this.formatter(this.inputValue));
          this.wordOpacity = 0;
        },
        ...this.$listeners
      };
    },
    // 点击图标
    clickIcon() {
      if (this.$refs.input) {
        this.$refs.input.clear();
      } else {
        this.inputValue = ''
      }
    }
  }
};
</script>
<style lang='scss'>
.x-input {
  // display: inline-block;
  position: relative;
  // padding-bottom: 10px;
  .el-input--suffix {
    .el-input__count {
      display: none;
    }
    .el-input__clear {
      display: none;
    }
  }
  .x-input-extends {
    position: absolute;
    bottom: 0;
    right: 0;
    // background-color: #909399;
    height: 100%;
    width: 38px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      .x-input-word {
        display: none;
      }
      .x-input-close {
        display: inline-block;
      }
    }
  }
  .x-input-word {
    position: absolute;
    bottom: 0;
    left: 0;
    display: inline-block;
    line-height: initial;
    color: #909399;
    font-size: 12px;
    transform: scale(0.8);
  }
  .x-input-close {
    display: none;
    color: #909399;
    font-size: 14px;
  }
}
</style>
