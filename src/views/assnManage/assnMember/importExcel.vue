<template>
  <x-dialog ref="dialog" @submit="importExcel" title="导入社团成员" saveText="上传">
    <div class="importExcel">
      <div class="download">
        <el-button type="primary" @click="templateDownload">下载模版</el-button>
      </div>
      <div>
        <el-upload
          class="upload-demo"
          drag
          :auto-upload="false"
          :limit="1"
          :action="url"
          accept=".xlsx, .xls"
          ref="upload"
          :data="userId"
          :on-success="handle"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击选取文件</em>
          </div>
          <div class="el-upload__tip" slot="tip">只能上传xlsx/xls文件，请尽量使用模版进行上传</div>
        </el-upload>
      </div>
    </div>
  </x-dialog>
</template>
<script>
import { excelExport } from "@/api/export";
export default {
  props: {},
  data() {
    return {
      url: process.env.VUE_APP_BASE_API + "/assnMember/import",
      userId: {
        userId: this.$store.state.user.userId
      }
    };
  },
  methods: {
    open() {
      this.$refs.dialog.open();
      this.$nextTick(function() {
        this.$refs.upload.clearFiles();
      });
    },
    templateDownload() {
      this.$shade();
      excelExport({}, "/assnMember/template")
        .then(res => {
          this.$shade.close();
          this.$excel(res, "社团成员");
        })
        .catch(err => {
          this.$shade.close();
        });
    },
    importExcel(again, close) {
      this.$refs.upload.submit();
      this.$refs.dialog.openLoading();
    },
    handle(response, file, fileList) {
      this.$refs.dialog.closeLoading();
      if (response.code !== '20000') {
        this.$message.error(response.msg);
        this.$refs.upload.clearFiles();
      } else {
        this.$message({
          message: "上传成功",
          type: "success"
        });
        this.$refs.dialog.close();
        this.$parent.$refs.grid.queryData(true);
      }
    }
  },
  computed: {}
};
</script>
<style lang='scss' scope>
.importExcel {
  display: flex;
  flex-direction: column;
  align-items: center;
  .download {
    margin-bottom: 10px;
  }
}
</style>