<template>
  <div class="common_page_wapper">
    <div class="page_table">  
      <a-tabs v-model="currentTab">
        <a-tab-pane tab="应用简介" :key="1" :disabled="!activeTab">
          <one :applicationId="applicationId" :info="infoOne" @save="saveOne"></one>
        </a-tab-pane>
        <a-tab-pane tab="应用详情" :key="2" :disabled="!activeTab">
          <two :info="infoTwo" @save="saveTwo" @back="currentTab--"></two>
        </a-tab-pane>
        <a-tab-pane tab="套餐信息" :key="3" :disabled="!activeTab">
          <three :applicationId="applicationId" :info="infoThree" @save="saveThree"  @back="currentTab--"></three>
        </a-tab-pane>
        <a-tab-pane tab="售后服务" :key="4" :disabled="!activeTab">
          <four
          :applicationId="applicationId"
          :info="infoFour"
          @submit="handleSubmit"
          @preview="handlePreview"
          @back="currentTab--"></four>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import one from '../../components/product/one.vue';
import two from '../../components/product/two.vue';
import three from '../../components/product/three.vue';
import four from '../../components/product/four.vue';


export default {
  components: {
    one,
    two,
    three,
    four,
  },
  data() {
    return {
      applicationId: this.$route.params.id,
      paramsOne: {},
      paramsTwo: {},
      paramsThree: {},
      paramsFour: {},
      infoOne: {},
      infoTwo: {},
      infoThree: {},
      infoFour: {},
      activeTab: false,
      status: 1,
    };
  },
  mounted() {
    if (this.applicationId == '-1') {
      this.status = 5;
      this.$api.app.ifEditedApp().then((res) => {
        if (res.code === 10021028) {
          this.appInfoOne();
        }
      });
    } else {
      this.status = 10;
      switch (this.currentTab) {
        case 1:
          this.appInfoOne();
          break;
        case 2:
          this.appInfoTwo();
          break;
        case 3:
          this.appInfoThree();
          break;
        case 4:
          this.appInfoFour();
          break;
        default:
          break;
      }
    }
  },
  computed: {
    currentTab: {
      get() {
        return Number(this.$route.query.type);
      },
      set(val) {
        const { path } = this.$router.history.current;
        this.$router.push({ path, query: { type: val } });
        if (this.applicationId !== 0) {
          switch (this.currentTab) {
            case 1:
              this.appInfoOne();
              break;
            case 2:
              this.appInfoTwo();
              break;
            case 3:
              this.appInfoThree();
              break;
            case 4:
              this.appInfoFour();
              break;
            default:
              break;
          }
        }
      },
    },
  },
  methods: {
    appInfoOne() {  // 获取第一步信息
      this.$api.app.appInfoOne(this.applicationId).then((res) => {
        if (res.code === 200) {
          this.applicationId = res.result.applicationId;
          this.infoOne = res.result;
        }
      });
    },
    appInfoTwo() { // 获取第二步信息
      this.$api.app.appInfoTwo(this.applicationId).then((res) => {
        if (res.code === 200) {
          this.infoTwo = res.result;
        }
      });
    },
    appInfoThree() { // 获取第三步信息
      this.$api.app.appInfoThree(this.applicationId).then((res) => {
        if (res.code === 200) {
          this.infoThree = res.result;
        }
      });
    },
    appInfoFour() { // 获取第四步信息
      this.$api.app.appInfoFour(this.applicationId).then((res) => {
        if (res.code === 200) {
          this.infoFour = res.result;
        }
      });
    },
    saveOne(options) {  // 保存第一步信息
      this.paramsOne = {
        ...options,
        status: this.status,
      };
      this.$api.app.addAppFirst(this.paramsOne).then((res) => {
        if (res.code === 200) {
          this.applicationId = res.result;
          this.currentTab = 2;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    saveTwo(options) { // 保存第二步信息
      this.paramsTwo = {
        applicationId: this.applicationId,
        ...options,
      };
      this.$api.app.addAppSecond(this.paramsTwo).then((res) => {
        if (res.code === 200) {
          this.currentTab = 3;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    saveThree(options) { // 保存第三步信息
      this.paramsThree = options;
      this.$api.app.addAppThird(this.paramsThree).then((res) => {
        if (res.code === 200) {
          this.activeTab = true;
          this.currentTab = 4;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handleSubmit(options) { // 提交
      this.paramsFour = options;
      const params = {
        applicationId: this.applicationId,
        flag: 2,
        ...options,
      };
      this.$api.app.addAppFour(params).then((res) => {
        if (res.code === 200) {
          this.$router.push('/appManage/appHasPublish');
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handlePreview(options) { // 预览
      this.paramsFour = options;
      const params = {
        applicationId: this.applicationId,
        flag: 1,
        ...options,
      };
      this.$api.app.addAppFour(params).then((res) => {
        if (res.code === 200) {
          const routeUrl = this.$router.resolve({
            path: `/PreviewDetail/${this.applicationId}`,
          });
          window.open(routeUrl.href, '_blank');
        } else {
          this.$message.error(res.message);
        }
      });
    },
  },
};
</script>
<style>
</style>
