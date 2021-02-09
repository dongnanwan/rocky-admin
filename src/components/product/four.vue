<template>

  <div class="wrap relative">
     <a-button
      class="preview-btn"
        :disabled="!content"
        type="primary"
        size="large"
        icon="file-search"
        @click="preview">预览</a-button>
     <a-form>
      <a-form-item
        label="售后服务"
        :label-col="{ span: 2 }"
        :wrapper-col="{ span: 20 }"
        required
        :validate-status="infoValidate.status"
        :help="infoValidate.errorMsg"
      >
      <quill-editor v-model="content"
        ref="myQuillEditor"
        :options="editorOption">
      </quill-editor>
      </a-form-item>
     </a-form>
    <div class="flex flex-justify-end" style="padding-right:60px;">
      <a-button
        class="up-btn mt50"
        style="width:240px;height:50px"
        @click="handleBack"
      >
        <a >上一步</a>
      </a-button>
        <a-button
        class="up-btn  mt50"
        type="primary"
        :loading="$store.state.spinning"
        style="width:240px;height:50px"
        @click="submit">提交</a-button>

    </div>
  </div>
</template>
<script>
/* eslint-disable */
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import quillConfig from '../../assets/js/quill-config.js'

import {quillEditor, Quill} from 'vue-quill-editor'
// import {ImageExtend, QuillWatch} from 'quill-image-extend-module'
import ImageResize from 'quill-image-resize-module'

// Quill.register('modules/ImageExtend', ImageExtend)
Quill.register('modules/ImageResize', ImageResize)

export default {
  components: {
    quillEditor,
  },
  props: {
    applicationId: {
      type: String,
      default() {
        return 0;
      }
    },
    info: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      content: '<p>I am Example</p>',
      editorOption: quillConfig,
      infoValidate: {}
    };
  },
  watch: {
    info(val) {
      this.fillFormDate(val);
    },
    content(val) {
      if(!val) {
        this.infoValidate = {
          status: 'error',
          errorMsg: '请输入售后服务'
        }
      } else {
        this.infoValidate = {
          status: 'success',
          errorMsg: null
        }
      }
    }
  },
  methods: {
    fillFormDate(info) {  // 回显售后服务信息
      this.content = info.afterSaleInstruction
    },
    preview() {  // 预览
      let params ={
        afterSaleInstruction: this.content
      }
      this.$emit('preview', params)
    },
    submit() {  // 提交售后服务信息
      if(this.content){
        let params ={
          afterSaleInstruction: this.content
        }
        this.$emit('submit', params)
      } else {
        this.infoValidate = {
          status: 'success',
          errorMsg: null
        }
      }
    },
    handleBack() {
      this.$emit('back')
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
  },
}
</script>
<style lang="scss" scoped>
.label{
  flex: 0 0 120px;
  text-align: right;
}
.up-btn {
  border: 1px solid #1890ff;
  margin-right: 60px;
  a{
    color: #1890ff!important;
  }
}
.relative{
  position: relative;
}
.preview-btn{
  position:absolute;
  right: 30px;
  top: -60px;
  z-index: 99999;
}
</style>
<style>
.ql-editor{
  height:520px;
  overflow: scroll;
}
.quill-editor{
  height: 100%;
}
</style>
