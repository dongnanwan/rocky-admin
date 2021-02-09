<template>
  <div class="">
    <div class="top-info ">
      <div v-if="userInfo.type === 1" class="flex">
        <div class="mr10">
          <img src="../../assets/img/custom-avatar.png" alt="" width="60" height="60">
          <p style="color: #B4B4B4">个人用户</p>
        </div>
        <div class="p10 ml10 flex flex-col flex-justify-around">
          <div class="info-line flex">
            <div class="info-item">
              <label> 用户ID：</label>
              <span>{{userInfo.accountId}}</span>
            </div>
            <div class="info-item">
              <label> 注册手机号：</label>
              <span>{{userInfo.mobileNo}}</span>
            </div>
          </div>
          <div class="info-line flex flex-wrap">
            <div class="info-item">
              <label> 注册时间：</label>
              <span>{{userInfo.regTime}}</span>
            </div>
            <div class="info-item">
              <label> 真实姓名：</label>
              <span>{{userInfo.name?userInfo.name: '【未填写】'}}</span>
            </div>
            <div class="info-item">
              <label> 绑定邮箱：</label>
              <span>{{userInfo.email?userInfo.email: '【未填写】'}}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-align-center">
        <div class="mr10" v-if="userInfo.type === 2">
          <img src="../../assets/img/qiye-avatar.png" alt="" width="60" height="60">
          <p style="color: #B4B4B4">企业用户</p>
        </div>
        <div class="p10 ml10 flex flex-col flex-justify-around">
          <div class="info-line flex flex-wrap">
            <div class="info-item">
              <label> 用户ID：</label>
              <span>{{userInfo.accountId}}</span>
            </div>
            <div class="info-item">
              <label> 注册时间：</label>
              <span>{{userInfo.regTime}}</span>
            </div>
            <div class="info-item">
              <label> 注册手机号：</label>
              <span>{{userInfo.mobileNo}}</span>
            </div>
            <div class="info-item">
              <label> 绑定邮箱：</label>
              <span>{{userInfo.email?userInfo.email: '【未填写】'}}</span>
            </div>
            <div class="info-item">
              <label> 企业名称：</label>
              <span>{{userInfo.enterpriseName?userInfo.enterpriseName: '【未填写】'}}</span>
            </div>
            <div class="info-item">
              <label> 企业税号：</label>
              <span>{{userInfo.taxNumber?userInfo.taxNumber: '【未填写】'}}</span>
            </div>
            <div class="info-item">
              <label> 所属行业：</label>
              <span>{{userInfo.industry?userInfo.industry: '【未填写】'}}</span>
            </div>
            <div class="info-item">
              <label> 企业注册地址：</label>
              <span>{{userInfo.enterpriseAddress?userInfo.enterpriseAddress: '【未填写】'}}</span>
            </div>
            <div class="info-item">
              <label> 开户行名称：</label>
              <span>{{userInfo.bankName?userInfo.bankName: '【未填写】'}}</span>
            </div>
            <div class="info-item">
              <label> 开户行账号：</label>
              <span>{{userInfo.bankAccount?userInfo.bankAccount: '【未填写】'}}</span>
            </div>
            <div class="info-item flex flex-align-start">
              <label> 营业执照：</label>
              <!-- <span>{{userInfo.licenceAttach?userInfo.licenceAttach: '【未填写】'}}</span> -->
              <a class="pt10" @click="previewImg(userInfo.licenceAttach)">
                <img :src="userInfo.licenceAttach" alt="营业执照" width="127" height="70">
              </a>

            </div>
          </div>
          <!-- <div class="info-line flex flex-wrap">

          </div> -->
        </div>
      </div>
    </div>
    <div class="main-info">
      <a-tabs defaultActiveKey="1" @change="callback">
        <a-tab-pane tab="浏览应用" key="1">
          <a-table
            rowKey="applicationId"
            :dataSource="viewData"
            :columns="viewColumns"
            :pagination="viewPage"
            @change="(pagination) => {
              this.viewPage.current = pagination.current;this.getViewData();}">
              <span slot="type" slot-scope="data">
                {{data.productTypeLabel +'>'+data.applicationTypeLabel}}</span>
              <span slot="viewDuration" slot-scope="data">{{transformTime(data)}}</span>
              <span slot="operation" slot-scope="data">
                <span @click="appDetail(data.applicationId)" class="mr10"><a>查看应用</a></span>
                <span @click="viewDetail(data.applicationId)" class="mr10"><a>浏览明细</a></span>
              </span>
          </a-table>
        </a-tab-pane>
        <a-tab-pane tab="试用应用" key="2">
          <a-table rowKey="index" :dataSource="trialData" :columns="trialColumns"
          :pagination="trialPage"
            @change="(pagination) => {
              this.trialPage.current = pagination.current;this.getTrialData();}">
              <span slot="viewDuration" slot-scope="data">{{transformTime(data)}}</span>
              <span slot="operation" slot-scope="data">
                <span @click="appDetail(data.applicationId)" class="mr10"><a>查看应用</a></span>
              </span>
          </a-table>
        </a-tab-pane>
        <a-tab-pane tab="付费应用" key="3">
          <a-table rowKey="index" :dataSource="chargeData" :columns="chargeColumns"
            @change="(pagination) => {
              this.chargePage.current = pagination.current;this.getChargeData();}">
              <span slot="applicationPackage" slot-scope="data">
                {{data.packageVersion}}  <br>
                {{data.packageTime===-1?'无上限'
                  :data.packageTime+$getters.timeUnit(Number(detail.packageTimeUnit))}}
                  /{{data.packageInvokeMax == -1?'无上限':'限用'+data.packageInvokeMax + '次'}}
                  /{{data.packageUserMax == -1?'无上限':data.packageUserMax + '人'}}
              </span>
              <span slot="mark" slot-scope="data">
                <a-rate v-model="data" />
              </span>
              <span slot="operation" slot-scope="data">
                <span @click="appDetail(data.applicationId)" class="mr10"><a>查看应用</a></span>
              </span>
          </a-table>
        </a-tab-pane>
        <a-tab-pane tab="收藏应用" key="4">
          <a-table rowKey="index" :dataSource="favouriteData" :columns="favouriteColumns"
          :pagination="favouritePage"
            @change="(pagination) => {
              this.favouritePage.current = pagination.current;this.getFavouriteData();}">
            <span slot="operation" slot-scope="data">
              <span @click="appDetail(data.applicationId)" class="mr10"><a>查看应用</a></span>
            </span>
          </a-table>
        </a-tab-pane>
        <a-tab-pane tab="优惠券" key="5">
          <a-table rowKey="id" :dataSource="couponData" :columns="couponDataColumns"
          :pagination="couponDataPage"
            @change="(pagination) => {
              this.couponDataPage.current = pagination.current;this.getCouponData();}">
            <span slot="bonusType" slot-scope="data">{{$getters.bonusType(data)}}</span>
            <span slot="validTime" slot-scope="data">
              {{data.validStartTime?data.validStartTime +'~'+ data.validEndTime:''}}</span>
            <span slot="status" slot-scope="data">{{$getters.authStatus(data)}}</span>
            <span slot="operation" slot-scope="data">
              <span v-if="data.activityLink">
                <a :href="data.activityLink" target="blank">查看活动</a>
              </span>
            </span>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </div>
    <a-modal
      title="浏览明细"
      :visible="visible"
      :footer="null"
      @cancel="visible=false"
    >
      <a-table
        rowKey="id"
        :dataSource="viewDetailData"
        :columns="viewDetailColumns"
        :pagination="viewDetailPage"
        @change="(pagination) => {
          this.viewDetailPage.current = pagination.current;this.viewDetail();}">
        <span slot="viewDuration" slot-scope="data">{{transformTime(data)}}</span>
      </a-table>
    </a-modal>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
const viewColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    align: 'center',
  }, {
    title: '应用名称',
    dataIndex: 'applicationName',
    align: 'center',
  }, {
    title: '应用分类',
    key: 'type',
    scopedSlots: { customRender: 'type' },
    align: 'center',
  }, {
    title: '最近浏览时长',
    dataIndex: 'viewDuration',
    align: 'center',
    scopedSlots: { customRender: 'viewDuration' },
  }, {
    title: '浏览次数',
    dataIndex: 'times',
    align: 'center',
  }, {
    title: '最近浏览时间',
    dataIndex: 'viewTime',
    align: 'center',
  }, {
    title: '操作',
    key: 'operation',
    scopedSlots: { customRender: 'operation' },
    align: 'center',
  },
];
const trialColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    align: 'center',
  }, {
    title: '应用名称',
    dataIndex: 'applicationName',
    align: 'center',
  }, {
    title: '应用分类',
    dataIndex: 'applicationTypeLabel',
    align: 'center',
  }, {
    title: '最近浏览时长',
    dataIndex: 'viewDuration',
    align: 'center',
    scopedSlots: { customRender: 'viewDuration' },
  }, {
    title: '浏览次数',
    dataIndex: 'times',
    align: 'center',
  }, {
    title: '最近浏览时间',
    dataIndex: 'viewTime',
    align: 'center',
  }, {
    title: '购买方式',
    dataIndex: 'trailType',
    align: 'center',
  }, {
    title: '操作',
    key: 'operation',
    scopedSlots: { customRender: 'operation' },
    align: 'center',
  },
];
const chargeColumns = [{
  title: '序号',
  dataIndex: 'index',
  align: 'center',
}, {
  title: '应用名称',
  dataIndex: 'applicationName',
  align: 'center',
}, {
  title: '应用分类',
  dataIndex: 'applicationTypeLabel',
  align: 'center',
}, {
  title: '套餐详情',
  dataIndex: 'applicationPackage',
  scopedSlots: { customRender: 'applicationPackage' },
  align: 'center',
}, {
  title: '应用评分',
  dataIndex: 'mark',
  scopedSlots: { customRender: 'mark' },
  align: 'center',
}, {
  title: '操作',
  key: 'operation',
  scopedSlots: { customRender: 'operation' },
  align: 'center',
}];
const favouriteColumns = [{
  title: '序号',
  dataIndex: 'index',
  align: 'center',
}, {
  title: '应用名称',
  dataIndex: 'applicationName',
  align: 'center',
}, {
  title: '应用分类',
  dataIndex: 'applicationTypeLabel',
  align: 'center',
}, {
  title: '收藏时间',
  dataIndex: 'addTime',
  align: 'center',
}, {
  title: '操作',
  key: 'operation',
  scopedSlots: { customRender: 'operation' },
  align: 'center',
}];
const viewDetailColumns = [
  {
    title: '序号',
    dataIndex: 'id',
    align: 'center',
  }, {
    title: '浏览时间',
    dataIndex: 'viewTime',
    align: 'center',
  }, {
    title: '浏览时长',
    dataIndex: 'viewDuration',
    align: 'center',
    scopedSlots: { customRender: 'viewDuration' },
  },
];
const couponDataColumns = [{
  title: '活动ID',
  dataIndex: 'activityId',
  align: 'center',
}, {
  title: '活动名称',
  dataIndex: 'activityName',
  align: 'center',
}, {
  title: '优惠内容',
  dataIndex: 'bonusType',
  scopedSlots: { customRender: 'bonusType' },
  align: 'center',
}, {
  title: '有效时间',
  key: 'validTime',
  scopedSlots: { customRender: 'validTime' },
  align: 'center',
}, {
  title: '指定服务商',
  dataIndex: 'targetProviderName',
  align: 'center',
}, {
  title: '指定产品',
  dataIndex: 'targetApplicationName',
  align: 'center',
}, {
  title: '领取时间',
  dataIndex: 'receiveTime',
  align: 'center',
}, {
  title: '状态',
  dataIndex: 'status',
  scopedSlots: { customRender: 'status' },
  align: 'center',
}, {
  title: '操作',
  key: 'operation',
  scopedSlots: { customRender: 'operation' },
  align: 'center',
}];
export default {
  components: {
  },
  data() {
    return {
      accountId: this.$route.params.id,
      userInfo: {},
      viewData: [],
      viewColumns,
      viewPage: {
        current: 1,
        pageSize: global.config.pageSize,
        total: 0,
      },
      trialData: [],
      trialColumns,
      trialPage: {
        current: 1,
        pageSize: global.config.pageSize,
        total: 0,
      },
      chargeData: [],
      chargeColumns,
      chargePage: {
        current: 1,
        pageSize: global.config.pageSize,
        total: 0,
      },
      favouriteData: [],
      favouriteColumns,
      favouritePage: {
        current: 1,
        pageSize: global.config.pageSize,
        total: 0,
      },
      visible: false,
      viewDetailData: [],
      viewDetailColumns,
      viewDetailPage: {
        current: 1,
        pageSize: global.config.pageSize,
        total: 0,
      },
      couponData: [],
      couponDataColumns,
      couponDataPage: {
        current: 1,
        pageSize: global.config.pageSize,
        total: 0,
      },
      previewVisible: false,
      previewImage: '',
    };
  },
  mounted() {
    this.getDetail();
    this.getViewData();
    this.getTrialData();
    this.getChargeData();
    this.getFavouriteData();
    this.getCouponData();
  },
  methods: {
    transformTime(data) {
      /* eslint-disable */
      return data > 3600
        ? `${parseInt(data / 3600)}h${parseInt((data % 3600) / 60)}min${data % 60}s`
        : data > 60
          ? `${parseInt(data / 60)}min${data % 60}s`
          : `${data}s`;
    },
    getDetail() {
      this.$api.user.customUserDetail(this.accountId).then((res) => {
        if (res.code === 200) {
          this.userInfo = res.result;
        }
      });
    },
    getViewData() {
      const params = {
        userId: this.accountId,
        pageNum: this.viewPage.current,
        pageSize: this.viewPage.pageSize,
      };
      this.$api.user.getViewData(params).then((res) => {
        if (res.code === 200) {
          const { list } = res.result;
          list.forEach((item, index) => {
            item.index = (Number(this.viewPage.current) - 1) * this.viewPage.pageSize + index + 1;
          });
          this.viewData = res.result.list;
          this.viewPage.total = Number(res.result.total);
        }
      });
    },
    getTrialData() {
      const self = this;
      const params = {
        userId: this.accountId,
        pageNum: this.trialPage.current,
        pageSize: this.trialPage.pageSize,
      };
      this.$api.user.getTrialData(params).then((res) => {
        if (res.code === 200) {
          const { list } = res.result;
          list.forEach((item, index) => {
            item.index = (Number(self.trialPage.current) - 1) * self.trialPage.pageSize + index + 1;
          });
          this.trialData = res.result.list;
          this.trialPage.total = Number(res.result.total);
        }
      });
    },
    getChargeData() {
      const params = {
        userId: this.accountId,
        pageNum: this.chargePage.current,
        pageSize: this.chargePage.pageSize,
      };
      this.$api.user.getChargeData(params).then((res) => {
        if (res.code === 200) {
          const { list } = res.result;
          list.forEach((item, index) => {
            item.index = (Number(this.chargePage.current) - 1) * this.chargePage.pageSize + index + 1;
          });
          this.chargeData = res.result.list;
          this.chargePage.total = Number(res.result.total);
        }
      });
    },
    getFavouriteData() {
      const params = {
        userId: this.accountId,
        pageNum: this.favouritePage.current,
        pageSize: this.favouritePage.pageSize,
      };
      this.$api.user.getFavourate(params).then((res) => {
        if (res.code === 200) {
          const { list } = res.result;
          list.forEach((item, index) => {
            item.index = (Number(this.favouritePage.current) - 1) * this.favouritePage.pageSize + index + 1;
          });
          this.favouriteData = res.result.list;
          this.favouritePage.total = Number(res.result.total);
        }
      });
    },
    getCouponData() {
      const params = {
        userId: this.accountId,
        // bonusType: 2,
        pageNum: this.couponDataPage.current,
        pageSize: this.couponDataPage.pageSize,
      };
      this.$api.operation.couponList(params).then((res) => {
        if (res.code === 200) {
          const { list } = res.result;
          list.forEach((item, index) => {
            item.index = (Number(this.couponDataPage.current) - 1) * this.couponDataPage.pageSize + index + 1;
          });
          this.couponData = res.result.list;
          this.couponDataPage.total = Number(res.result.total);
        }
      });
    },
    // openUrl() {
    //   window.open
    // },
    callback() {},
    appDetail(id) {
      this.$router.push(`/AppManage/AppDetail/${id}`);
    },
    viewDetail(id) {
      const params = {
        userId: this.accountId,
        pageNum: this.viewDetailPage.current,
        pageSize: this.viewDetailPage.pageSize,
      };
      this.$api.user.viewDetail(id, params).then((res) => {
        if (res.code === 200) {
          this.visible = true;
          this.viewDetailData = res.result.list;
          this.viewDetailPage.total = Number(res.result.total);
        }
      });
    },
    previewImg(url) {
      this.previewImage = url;
      this.previewVisible = true;
    },
    handleCancel() {
      this.previewVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.top-info{
  padding: 25px 40px;
  background: #fff;
  .info-line{
    .info-item{
      width: 370px;
      line-height: 30px;
      color: #2B303B;
    }
  }
}
.main-info{
  margin-top: 30px;
  padding: 10px 30px;
  background: #fff;
}

</style>
