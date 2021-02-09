<template>
  <div class="header">
    <div class="h-left">
      <a-icon type="left-circle" class="back-icon" @click="$router.go(-1)"/>
      <img id="logo" src="@/assets/img/logo.png" alt="">
      <div class="menu-name" v-if="!publish">
        <span>首页</span>

        <a-dropdown class="child" overlayClassName="main-01-drop-down">
          <a class="ant-dropdown-link mr60" style="margin-right: 60px;">解决方案</a>
          <a-menu slot="overlay" @click="onSolutionClick">
            <!-- <a-menu-item key="1">电商生态</a-menu-item>
            <a-menu-item key="2">零售门店</a-menu-item> -->
            <a-menu-item key="3">销售云服务</a-menu-item>
            <a-menu-item key="4">信用品牌</a-menu-item>
          </a-menu>
        </a-dropdown>

        <a-dropdown class="child" overlayClassName="main-01-drop-down">
          <a class="ant-dropdown-link mr60">云市场</a>
          <a-menu slot="overlay" @click="onMarketClick">
            <a-menu-item key="1">企业应用</a-menu-item>
            <a-menu-item key="2">小程序</a-menu-item>
            <a-menu-item key="3">网站建设</a-menu-item>
          </a-menu>
        </a-dropdown>

      </div>
    </div>
    <div class="h-right">
      <div class="search-bar-wapper" v-if="!publish">
        <input
          @keyup.enter="handleSearch()"
          v-model="searchValue"
          :placeholder="'大家都在搜 ' + defaultSearchValue +' '" type="text">
        <img @click="handleSearch()" src="@/assets/img/search_icon.png" alt="">
      </div>
      <div class="login-wapper">
        <div v-if="!publish">
        </div>
        <div v-else class="flex flex-justify-center flex-align-center">
          <span class="reg" v-waves @click="rejectVisible = true">驳回</span>
          <span class="reg" v-waves @click="handlePublish">正式发布</span>
        </div>
      </div>
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
  name: 'the-header',
  props: {
    id: {
      type: String,
      default: '',
    },
    publish: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchValue: '',
      username: '',

      defaultSearchValue: '微店',

      unreadMessageCount: 0,
      keyword: this.$route.query.keyword,
      rejectVisible: false,
      rejectReason: '',
      uploadUrl: global.config.uploadUrl,
      fileList: [],
      auditAttachId: '',
    };
  },
  inject: ['reload'],
  mounted() {
    this.username = sessionStorage.getItem('username');

    if (this.keyword) {
      this.searchValue = this.keyword;
    }
  },
  methods: {
    handleSearch() {
      // if (this.searchValue === '') {
      //   this.$router.push(`/apps?keyword=${this.defaultSearchValue}`);
      // } else {
      //   this.$router.push(`/apps?keyword=${this.searchValue}`);
      // }
      // this.reload();
    },
    onSolutionClick({ key }) {
      switch (key) {
        case '1':

          break;
        case '2':

          break;
        case '3':
          break;
        case '4':
          break;
        default:
          break;
      }
    },
    onMarketClick({ key }) {
      switch (key) {
        case '1':
          break;
        case '2':
          break;
        case '3':
          break;
        default:
          break;
      }
    },
    handlePublish() {
      const self = this;
      this.$confirm({
        title: '发布',
        content: '是否已确定完成API测试，发布后将会面向所有商城用户开放！',
        onOk() {
          const params = {
            applicationId: self.id,
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
      } else {
        return true;
      }
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
        applicationId: this.id,
        status: -5,
        rejectReason: this.rejectReason,
        auditAttachId: this.auditAttachId,
      };
      this.$api.myExamine.appPublish(params).then((res) => {
        if (res.code === 200) {
          this.$router.go(-1);
          this.$message.success('操作成功');
        }
      });
    },
  },
};
</script>

<style lang="stylus">
.main-02-drop-down
.main-01-drop-down
  .ant-dropdown-menu
    background-color #191C22
    margin-top 17px
    margin-left -50px
    .ant-dropdown-menu-item
      color white
      width 160px
      text-align center
      padding 10px 12px
      &:hover
        background-color #2b303b
    .ant-dropdown-menu-item-active
      background-color #2b303b
      color #3171FF
  .overlay-wapper
    background-color #2b303b
    color white
</style>

<style scoped lang="stylus">
.back-icon
  font-size 32px
  margin-left 20px
  color white
.notice-icon
  width 15px
  height 18px
  background-image url('../assets/img/notice_icon@2x.png')
  background-size contain
  background-repeat no-repeat
  margin-right 30px
  cursor not-allowed
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
