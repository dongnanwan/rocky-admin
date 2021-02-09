<template>
  <div>
    <div class="header">
      <div class="h-left">
        <a-icon
          type="left-circle"
          class="back-icon"
          @click="$router.push('/MyExamine/MyAppExamine')"/>
        <img id="logo" src="@/assets/img/logo.png" alt="">
      </div>
      <div class="h-right">
        <div class="login-wapper">
          <div class="flex flex-justify-center flex-align-center">
            <span class="reg" v-waves @click="rejectVisible = true">驳回</span>
            <span class="reg" v-waves @click="handlePublish">正式发布</span>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <iframe
        ref="frame_full"
        allow="fullscreen"
        width="100%"
        frameborder="0" scrolling="auto"
        :src="domain+'/appDetail?id='+appId+'&token='+ token"
        ></iframe>
    </div>
    <a-modal
      title="驳回"
      v-model="rejectVisible"
      @ok="handleReject"
      okText="确认"
      :okButtonProps="{ props: {disabled: !rejectReason} }"
      cancelText="取消">
      <a-form>
        <a-form-item
          label="驳回原因"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 19 }"
        >
          <a-textarea v-model="rejectReason" maxlength="512" rows="3"></a-textarea>
          <div class="">
            <a-upload
              name="file"
              :multiple="false"
              :headers="{'Authorization':$store.state.token}"
              :beforeUpload="(file)=>{return beforeUpload(file)}"
              @change="handleChange"
              :action="uploadUrl"
              :fileList="fileList"
            >
              <a-button icon="plus">上传附件</a-button>
            </a-upload>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      appId: this.$route.params.id,
      token: this.$route.query.token,
      rejectVisible: false,
      rejectReason: '',
      uploadUrl: global.config.uploadUrl,
      fileList: [],
      auditAttachId: '',
    };
  },
  mounted() {
    this.$nextTick(() => {
      /* eslint-disable */
      this.$refs.frame_full.style.height = document.body.clientHeight -70 + 'px';
    });
  },
  computed: {
    domain() {
      const fullCurrentDomain = window.location.href;
      const res = fullCurrentDomain.indexOf('http://admin.store.rockysaas.com')>-1?
      'http://store.rockysaas.com':
      fullCurrentDomain.indexOf('http://test.admin.store.rockysaas.com')>-1?'http://test.mall.store.rockysaas.com':
      'http://test.mall.store.rockysaas.com';
      return res;
    }
  },
  methods: {
    handlePublish() {
      const self = this;
      this.$confirm({
        title: '发布',
        content: '是否已确定完成API测试，发布后将会面向所有商城用户开放！',
        onOk() {
          const params = {
            applicationId: self.appId,
            status: 5,
          };
          self.$api.myExamine.appPublish(params).then((res) => {
            if (res.code === 200) {
              self.$router.go(-1);
              self.$message.success('操作成功');
            }
          });
        },
        onCancel() {},
      });
    },
    beforeUpload(file) { // 限制文件指南上传的类型和大小
      const isLimit = file.size / 1024 / 1024 < 1;
      if (!isLimit) {
        this.$message.error('上传的文件不得大于1MB!');
        return false;
      }
      return true;
    },
    handleChange(info) { // 处理文件上传回调
      const fileList = [...info.fileList];
      this.fileList = fileList.slice(-1);
      const { response } = info.file;
      if (response && response.code === 200) {
        this.auditAttachId = response.result.attachmentId;
      }
    },
    handleReject() {
      const params = {
        applicationId: this.appId,
        status: -5,
        rejectReason: this.rejectReason,
        auditAttachId: this.auditAttachId,
      };
      this.$api.myExamine.appPublish(params).then((res) => {
        if (res.code === 200) {
          this.rejectVisible = false;
          this.$router.go(-1);
          this.$message.success('操作成功');
        }
      });
    },
  },
};
</script>
<style scoped lang="stylus">
.back-icon
  font-size 32px
  margin-left 20px
  color white
.header
  height 70px
  background-color #191C22
  display flex
  flex-direction row
  justify-content space-between
  align-items center
  .h-right
    display flex
    flex-direction row
    justify-content space-between
    align-items center
    color white
    .login-wapper
      font-size 14px
      display flex
      flex-direction row
      justify-content space-between
      align-items center
      .username
        margin-left 40px
        margin-right 20px
      a
       color white
      b
        margin-left 40px
        margin-right 30px
        height 20px
        width 1px
        background-color rgba(255,255,255,.3)
        display inline-block
      .login
        margin-right 25px
        cursor not-allowed
        &:hover
          opacity .95
      .reg
        width 94px
        height 36px
        background rgba(49,113,255,1)
        border-radius 4px
        margin-right 43px
        text-align center
        line-height 36px
        cursor pointer
        &:hover
          opacity .95
    .back
        width 94px
        height 36px
        background #cecece;
        color red
        border-radius 4px
        margin-right 43px
        display flex
        flex-direction row
        justify-content center
        align-items center
        user-select none
        &:hover
          opacity .95

    .search-bar-wapper
      width 20vw
      min-width 200px
      max-width 400px
      height 40px
      border-radius 4px
      background #404655
      display flex
      flex-direction row
      justify-content space-between
      align-items center
      img
        cursor not-allowed
        padding-right 15px
        margin-left 15px
        &:hover
          opacity .95
      input
        height 100%
        background-color transparent
        border none
        flex 1
        outline none
        color #D4D6DB
        padding-left 15px
        font-size 14px
  .h-left
    display flex
    flex-direction row
    justify-content space-between
    align-items center
    img
      margin-left 25px
      cursor not-allowed
    .menu-name
      color white
      margin-left 60px
      display flex
      flex-direction row
      justify-content flex-start
      align-items center
      span
        margin-right 60px
        font-size 16px
        cursor not-allowed
        &:hover
          opacity .95
      .child
        color white
        font-size 16px

</style>
