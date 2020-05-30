<template>
  <el-dialog v-bind="dialogConfig" :visible.sync="dialogVisible">
    <div>
      <slot></slot>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel" v-text="cancelText" v-if="cancelShow"></el-button>
      <x-button ref="button" type="primary" @click="submit" :text="saveText" v-if="saveShow"></x-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: "x-dialog",
  props: {
    title: {
      type: String,
      default: "提示"
    },
    cancelText: {
      type: String,
      default: "取消"
    },
    saveText: {
      type: String,
      default: "保存"
    },
    btn: {
      type: [Array, Object],
      default: function() {
        return ["save", "cancel"];
      }
    }
  },
  data() {
    return {
      defaultConfig: {
        title: this.title,
        "close-on-click-modal": false
      },
      dialogVisible: false
    };
  },
  methods: {
    open() {
      this.dialogVisible = true;
    },
    close() {
      this.dialogVisible = false;
    },
    submit() {
      this.$emit(
        "submit",
        // again
        () => {
          this.$refs.button.closeLoading();
        },
        // close
        () => {
          this.$refs.button.closeLoading();
          this.dialogVisible = false;
        }
      );
    },
    cancel() {
      this.dialogVisible = false;
      // this.$emit("cancel");
    },
    openLoading() {
      this.$refs.button.openLoading();
    },
    closeLoading() {
      this.$refs.button.closeLoading();
    }
  },
  computed: {
    dialogConfig() {
      return Object.assign(this.defaultConfig,this.$attrs)
    },
    saveShow() {
      return this.btn.some(function(item) {
        return item === "save";
      });
    },
    cancelShow() {
      return this.btn.some(function(item) {
        return item === "cancel";
      });
    }
  }
};
</script>

<style scoped>
</style>