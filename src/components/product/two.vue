<template>
  <div class="wrap">
    <a-form
      :form="form"
      @submit="handleSubmit"
    >
      <a-form-item
        label="应用详情"
        :label-col="{ span: 2 }"
        :wrapper-col="{ span: 20 }"
        required
        :validate-status="infoValidate.status"
        :help="infoValidate.errorMsg"
      >
        <quill-editor
          v-model="content"
          ref="myQuillEditor"
          :options="editorOption">
        </quill-editor>
      </a-form-item>
      <a-form-item
        label="使用指南"
        :label-col="{ span: 2 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-upload
          accept=".doc,.docx,.pdf"
          name="file"
          :multiple="false"
          :headers="{'Authorization':$store.state.token}"
          :beforeUpload="(file)=>{return beforeUpload(file)}"
          @change="handleChange"
          :action="uploadUrl"
          :fileList="fileList"
        >
          <a-button>
            <a-icon type="upload" /> Click to upload
          </a-button>
        </a-upload>
        仅支持docx、pdf格式
      </a-form-item>
      <a-form-item
        label="演示视频"
        :label-col="{ span: 2 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          v-decorator="[
            'presentVideoUrl',
          ]"
          placeholder="请输入演示视频地址"
        />
        请将视频文件存放于服务器，填写视频文件在服务器的存放路径
      </a-form-item>
      <div class="flex flex-justify-end" style="padding-right:120px;">
        <a-button
          class="up-btn mt50"
          style="width:240px;height:50px"
          @click="handleBack"
        >
          <a>上一步</a>
        </a-button>
        <a-button
          class="mt50"
          style="width:240px;height:50px"
          type="primary"
          :loading="$store.state.spinning"
          html-type="submit"
        >
          下一步
        </a-button>
      </div>
    </a-form>
  </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor';
/* eslint-disable */
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import quillConfig from '../../assets/js/quill-config.js'
import ImageResize from 'quill-image-resize-module'
Quill.register('modules/ImageResize', ImageResize)

export default {
  components: {
    quillEditor,
  },
  props: {
    info: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      content: '<p>I am Example</p>',
      editorOption: quillConfig,
      uploadUrl: global.config.uploadUrl,
      guideFileAttachId: '',
      videoUrl: '',
      fileList: [],
      infoValidate: {},
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
          errorMsg: '请输入应用简介'
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
    fillFormDate(info){  // 填充应用详情表单
      this.content = info.detailInfo;
      if(info.guideFileAttachId !== '0'){
        this.guideFileAttachId = info.guideFileAttachId;
        this.fileList=[
          {
              uid: '-1',
              name: info.guideFileName,
              status: 'done',
              url: info.guideFilePath,
            },
        ]
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({
          presentVideoUrl: info.presentVideoUrl,
        })
      })
    },
    beforeUpload(file) {// 限制文件指南上传的类型和大小
      const FileExt = file.name.split('.').slice(-1);
      
      const isLimit = file.size / 1024 / 1024 < 10;
      const typeLimit = ['doc','docx','pdf'].indexOf(FileExt[0].toLowerCase())
      if(typeLimit === -1){
        this.$message.error('只能上传.docx, .pdf格式的文件!'); 
        return false ;
      } else if (!isLimit) {
        this.$message.error('上传的文件不得大于10MB!');
        return false ;
      }else {
        return true;
      }
    },
    handleChange(info) {  // 处理文件上传回调
      const {file} = info;
      const FileExt = file.name.split('.').slice(-1);
      
      const isLimit = file.size / 1024 / 1024 < 1;
      const typeLimit = ['doc','docx','pdf'].indexOf(FileExt[0].toLowerCase())
      if(typeLimit === -1) {
        return ;
      } else if (!isLimit) {
        return ;
      }
      let fileList = [...info.fileList];
      this.fileList = fileList.slice(-1);
      const { response } = info.file;
      if (response && response.code === 200) {
        
      //   this.fileList = fileList;
        this.guideFileAttachId = response.result.attachmentId;
      }
    },
    handleSubmit(e) {  // 提交应用详情表单
      e.preventDefault();
      if(this.content){
        this.form.validateFields((err, values) => {
          if (!err) {
            let params = {
              'detailInfo': this.content,
              guideFileAttachId: this.guideFileAttachId,
              ...values,
            }
            this.$emit('save', params)
          }
        })
      }else {
        this.infoValidate = {
          status: 'error',
          errorMsg: '请输入应用简介'
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
};
</script>
<style lang="scss" scoped>
.label{
  flex: 0 0 70px;
  text-align: right;
}
.up-btn {
  border: 1px solid #1890ff;
  margin-right: 60px;
  a{
    color: #1890ff!important;
  }
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

