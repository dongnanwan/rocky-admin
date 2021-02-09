<template>
  <div class="">
    <div class="top-info flex">
      <div class="mr10">
        <img src="../../assets/img/qiye-3.png" alt="" width="60" height="60">
        <p style="color: #B4B4B4;width: 80px;">企业开发者</p>
      </div>
      <div class="p10 ml10 flex flex-col flex-justify-around">
        <div class="info-line flex">
          <div class="info-item">
            <label> 服务商ID：</label>
            <span>{{userInfo.providerId}}</span>
          </div>
          <div class="info-item">
            <label>企业名称：</label>
            <span>{{userInfo.enterpriseName}}</span>
          </div>
          <div class="info-item">
            <label> 绑定邮箱：</label>
            <span>{{userInfo.email?userInfo.email: '【未填写】'}}</span>
          </div>
        </div>
        <div class="info-line flex flex-wrap">
          <div class="info-item">
            <label> 注册手机：</label>
            <span>{{userInfo.mobile}}</span>
          </div>
          <div class="info-item">
            <label> 注册时间：</label>
            <span>{{userInfo.createdTime}}</span>
          </div>
          <div class="info-item">
            <label>实名认证：</label>
            <a @click="handleAuthInfo">{{$getters.providerAuthStatus(userInfo.status)}}</a>
          </div>
          <div class="info-item">
          </div>
        </div>
      </div>
    </div>
    <div class="main-info">
      <a-tabs defaultActiveKey="1" @change="callback">
        <a-tab-pane tab="应用信息" key="1">
          <a-table
            rowKey="id"
            :dataSource="appData"
            :columns="appColumns"
            :pagination="appPage"
            @change="(pagination) => {
              this.appPage.current = pagination.current;this.getAppData();}">
              <span slot="type" slot-scope="data">
                {{data.productTypeLabel +'>'+data.applicationTypeLabel}}</span>
              <span slot="status" slot-scope="data">{{$getters.appAuditStatus(data)}}</span>
              <span slot="profitRatio" slot-scope="data">{{data?data+'%': ''}}</span>
              <span slot="operation" slot-scope="data">
                <span @click="appDetail(data.id)" class="mr10"><a>查看</a></span>
                <span @click="handleProfitSet(data)" class="mr10"><a>分润设置</a></span>
              </span>
          </a-table>
        </a-tab-pane>
        <a-tab-pane tab="账户信息" key="2">
          <div class="gutter">
            <a-row :gutter="16">
              <a-col :span="6">
                <div class="gutter-box cwbj_1">
                  <div class="num">{{accountInfo.incomeAmount}}</div>
                  累计收入
                </div>
              </a-col>
              <a-col :span="6">
                <div class="gutter-box cwbj_2">
                  <div class="num">{{accountInfo.balanceAmount}}</div>
                  账户余额
                </div>
              </a-col>
              <a-col :span="6">
                <div class="gutter-box cwbj_3">
                  <div class="num">{{accountInfo.freezeAmount}}</div>
                  冻结金额
                </div>
              </a-col>
              <a-col :span="6">
                <div class="gutter-box cwbj_4">
                  <div class="num">{{accountInfo.availableAmount}}</div>
                  可提现金额
                </div>
              </a-col>
           </a-row>
          </div>
          <a-table rowKey="withdrawNo" :dataSource="withdrawData" :columns="withdrawColumns"
          :pagination="withdrawPage"
            @change="(pagination) => {
              this.withdrawPage.current = pagination.current;this.getAccountData();}">
              <span slot="status" slot-scope="data">{{$getters.withdrawStatus(data)}}</span>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </div>
    <a-modal
      width="60vw"
      :visible="visible1"
      @cancel="visible1 = false"
      title="实名认证"
      :footer="null">
      <div class="info-wrap">
        <div class="info-title">企业基本信息</div>
        <div class="info-line line-wrap flex flex-wrap">
          <div class="info-item">
            <label>行业类别：</label>
            <span>{{industryName}}</span>
          </div>
          <div class="info-item">
            <label>企业名称：</label>
            <span>{{authInfo.enterpriseName}}</span>
          </div>
          <div class="info-item">
            <label>企业地址：</label>
            <span>{{provinceName+ cityName + authInfo.enterpriseAddress}}</span>
          </div>
          <div class="info-item">
            <label>纳税人识别号：</label>
            <span>{{authInfo.taxNumber}}</span>
          </div>
           <div class="info-item">
            <label>营业执照：</label>
            <img-preview :imgPath="authInfo.licence"></img-preview>
          </div>
        </div>
      </div>
      <div class="info-wrap">
        <div class="info-title">企业法人信息</div>
        <div class="info-line line-wrap flex">
          <div class="info-item">
            <label>法人姓名：</label>
            <span>{{authInfo.corporationName}}</span>
          </div>
          <div class="info-item">
            <label>法人身份证号：</label>
            <span>{{authInfo.corporationIdentityId}}</span>
          </div>
        </div>
        <div class="info-line line-wrap flex">
          <div class="info-item" style="width: 500px;">
            <label>身份证正反面：</label>
            <div class="flex">
              <div class="mr10">
                <img-preview :imgPath="authInfo.identityFrontSide"></img-preview>
              </div>
              <img-preview :imgPath="authInfo.identityReverseSide"></img-preview>
            </div>
          </div>
        </div>
      </div>
      <div class="info-wrap">
        <div class="info-title">企业对公账户信息</div>
        <div class="info-line line-wrap flex">
          <div class="info-item">
            <label>账号名称：</label>
            <span>{{authInfo.accountName}}</span>
          </div>
          <div class="info-item">
            <label>开户行名称：</label>
            <span>{{authInfo.bankName}}</span>
          </div>
           <div class="info-item">
            <label>开户账号：</label>
            <span>{{authInfo.bankAccount}}</span>
          </div>
        </div>
        <div class="info-line line-wrap flex">
          <div class="info-item">
            <label>开户许可证：</label>
            <img-preview :imgPath="authInfo.permission"></img-preview>
          </div>
        </div>
      </div>
      <div v-if="phoneData.length>0">
        <div class="divide red">最近提交时间：{{phoneData.length>0?phoneData[0].createdTime: ''}}</div>
        <div class="table">
          <div class="flex flex-justify-between" v-for="(item, i) in phoneData" :key="i">
            <div>绑定账号：{{item.mobile}}</div>
            <div>绑定时间：{{item.createdTime}}</div>
          </div>
        </div>
        <div class="flex flex-justify-end p10">
          <a-pagination
            size="small"
            v-model="phonePage.current"
            :total="phonePage.total"
            :pageSize="phonePage.pageSize"
            @change="(current) => {this.phonePage.current = current;this.getPhoneHistory()}"/>
        </div>
      </div>
    </a-modal>
    <a-modal
      title="分润设置"
      :visible="visible2"
      @cancel="visible2 = false"
      :footer="null"
      >
      <div class="info-line">
        <div class="info-item p10">
          <label>服务商名称：</label>
          <span>{{userInfo.enterpriseName}}</span>
        </div>
        <div class="info-item p10">
          <label>应用名称：</label>
          <span>{{application.name}}</span>
        </div>
      </div>
      <a-form
        :form="form"
        @submit="handleOk"
      >
        <a-form-item
          label="服务商比例"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 8 }"
        >
          <a-input
            type="number" addonAfter="%" min="1" max="100"
            v-decorator="[
              'profitRatio',
              {rules:$mixRule.execute($mixRule.rules.required, $mixRule.message.requiredInput)}
            ]"
          />
        </a-form-item>
        <a-form-item
          :wrapper-col="{ span: 8, offset:16 }"
          style="margin: 0"
        >
          <a-row :gutter="4">
            <a-col :span="12">
              <a-button @click="visible2 = false">取消</a-button>
            </a-col>
            <a-col :span="12">
              <a-button
                type="primary"
                html-type="submit"
              >
                确定
              </a-button>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import ImgPreview from '../../components/ImgPreview.vue';

const appColumns = [
  {
    title: '应用ID',
    dataIndex: 'id',
    align: 'center',
  }, {
    title: '应用名称',
    dataIndex: 'name',
    align: 'center',
  }, {
    title: '应用分类',
    key: 'type',
    scopedSlots: { customRender: 'type' },
    align: 'center',
  }, {
    title: '最后更新时间',
    dataIndex: 'updateTime',
    align: 'center',
  }, {
    title: '应用状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    align: 'center',
  }, {
    title: '分润占比',
    dataIndex: 'profitRatio',
    align: 'center',
    scopedSlots: { customRender: 'profitRatio' },
  }, {
    title: '试用人数',
    dataIndex: 'trail',
    align: 'center',
  }, {
    title: '购买人数',
    dataIndex: 'buyer',
    align: 'center',
  }, {
    title: '操作',
    key: 'operation',
    scopedSlots: { customRender: 'operation' },
    align: 'center',
  },
];
const withdrawColumns = [
  {
    title: '提现编号',
    dataIndex: 'withdrawNo',
    align: 'center',
  }, {
    title: '提现金额',
    dataIndex: 'withdrawAmount',
    align: 'center',
  }, {
    title: '申请时间',
    dataIndex: 'createdTime',
    align: 'center',
  }, {
    title: '提现流水号',
    dataIndex: 'withdrawSerialNo',
    align: 'center',
  }, {
    title: '到账时间',
    dataIndex: 'arriveTime',
    align: 'center',
  }, {
    title: '提现状态',
    dataIndex: 'status',
    align: 'center',
    scopedSlots: { customRender: 'status' },
  },
];
export default {
  components: {
    ImgPreview,
  },
  data() {
    return {
      providerId: this.$route.params.id,
      userInfo: {},
      appData: [],
      appColumns,
      appPage: {
        current: 1,
        pageSize: global.config.pageSize,
        total: 0,
      },
      withdrawData: [],
      withdrawColumns,
      withdrawPage: {
        current: 1,
        pageSize: global.config.pageSize,
        total: 0,
      },
      visible1: false,
      visible2: false,
      application: '',
      form: this.$form.createForm(this),
      accountInfo: {},
      authInfo: {},
      provinceName: '',
      cityName: '',
      industryName: '',
      phoneData: [],
      phonePage: {
        current: 1,
        pageSize: 5,
        total: 0,
      },
    };
  },
  computed: {
    ...mapState(['allIndustryOptions']),
  },
  mounted() {
    this.getDetail();
    this.getAppData();
    this.getAccountData();
  },
  methods: {
    getDetail() {
      this.$api.user.serverUserDetail(this.providerId).then((res) => {
        if (res.code === 200) {
          this.userInfo = res.result;
        }
      });
    },
    getAuthInfo() {
      this.$api.user.providerAuthInfo(this.providerId).then((res) => {
        if (res.code === 200) {
          this.authInfo = res.result;
          const { enterpriseLocationProvince, enterpriseLocationCity, industry } = this.authInfo;
          this.getProvinceName(enterpriseLocationProvince, enterpriseLocationCity);
          this.allIndustryOptions.forEach((item) => {
            if (industry === item.value) {
              this.industryName = item.label;
            }
          });
        }
      });
    },
    getProvinceName(provinceCode, cityCode) {
      this.$api.common.getProviceCode(0).then((res) => {
        if (res.code === 200) {
          const { result } = res;
          result.forEach((item) => {
            if (provinceCode === item.id) {
              this.provinceName = item.name;
            }
          });
        }
      });
      this.$api.common.getProviceCode(provinceCode).then((res) => {
        if (res.code === 200) {
          const cityData = res.result;
          cityData.forEach((ele) => {
            if (cityCode === ele.id) {
              this.cityName = ele.name;
            }
          });
        }
      });
    },
    getPhoneHistory() {
      const params = {
        providerId: this.providerId,
        pageNum: this.phonePage.current,
        pageSize: this.phonePage.pageSize,
      };
      this.$api.user.getBindRecord(params).then((res) => {
        if (res.code === 200) {
          const { list } = res.result;
          this.phoneData = list;
          this.phonePage.total = Number(res.result.total);
        }
      });
    },
    getAppData() {
      const params = {
        providerId: this.providerId,
        pageNum: this.appPage.current,
        pageSize: this.appPage.pageSize,
      };
      this.$api.user.providerAppList(params).then((res) => {
        if (res.code === 200) {
          // const { list } = res.result;
          this.appData = res.result.list;
          this.appPage.total = Number(res.result.total);
        }
      });
    },
    getAccountData() {
      // const self = this;
      const params = {
        providerId: this.providerId,
        pageNum: this.withdrawPage.current,
        pageSize: this.withdrawPage.pageSize,
      };
      this.$api.user.providerAccountInfo(this.providerId).then((res) => {
        if (res.code === 200) {
          const { result } = res;
          this.accountInfo = {
            balanceAmount: result.balanceAmount || 0,
            freezeAmount: result.freezeAmount || 0,
            availableAmount: result.availableAmount || 0,
            incomeAmount: result.incomeAmount || 0,
          };
        }
      });
      this.$api.user.providerAccountList(params).then((res) => {
        if (res.code === 200) {
          // const { list } = res.result;
          this.withdrawData = res.result.list;
          this.withdrawPage.total = Number(res.result.total);
        }
      });
    },
    handleAuthInfo() {
      this.visible1 = true;
      this.getAuthInfo();
      this.getPhoneHistory();
    },
    callback() {},
    appDetail(id) {
      this.$router.push(`/AppManage/AppDetail/${id}`);
    },
    handleProfitSet(data) {
      this.application = data;
      this.visible2 = true;
      this.$nextTick(() => {
        if (data.profitRatio) {
          this.form.setFieldsValue({ profitRatio: data.profitRatio });
        } else {
          this.form.setFieldsValue({ profitRatio: 50 });
        }
      });
    },
    handleCancel() {
      this.visible2 = false;
    },
    handleOk(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          const params = {
            applicationId: this.application.id,
            profitRatio: values.profitRatio,
          };
          this.$api.user.profitSetting(params).then((res) => {
            if (res.code === 200) {
              this.visible2 = false;
              this.$message.success('操作成功！');
              this.getAppData();
            }
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.info-wrap{
  margin: 10px 5px;
  .info-title{
    border-left: 3px solid #1585FF;
    padding-left:  10px;
  }
  .line-wrap {
    line-height: 38px;
    color: #333;
  }
}
.top-info{
  padding: 25px 40px;
  background: #fff;
}

.info-item{
  width: 320px;
  // padding: 5px;
  display: flex;
  align-items: flex-start;
  color: #2B303B;
}
.main-info{
  margin-top: 30px;
  padding: 10px 30px;
  background: #fff;
}
.gutter{
  .gutter-box{
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    height: 112px;
    line-height:37px;
    margin: 10px 0 30px 0;
    padding: 15px 20px;
    color: #fff;
    font-size: 14px;
    border-radius: 5px;
    .num{
      font-size:28px;
      font-family:MicrosoftYaHei;
      color:rgba(255,255,255,1);
    }
  }
  .cwbj_1 {
    background-image: url('../../assets/img/cwbj_1.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 100%;
  }
  .cwbj_2 {
    background-image: url('../../assets/img/cwbj_2.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 100%;
  }
  .cwbj_3 {
    background-image: url('../../assets/img/cwgj_3.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 100%;
  }
  .cwbj_4 {
    background-image: url('../../assets/img/cwbj_4.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 100%;
  }
}
.divide{
  line-height: 38px;
  border-bottom: 1px solid #aaa;
}
.table>div{
  line-height: 38px;
  border-bottom: 1px dashed #eee;
}
</style>
<style>
  input:invalid+span:after {
    content: '✖';
    padding-left: 5px;
  }

  input:valid+span:after {
    content: '✓';
    padding-left: 5px;
  }
</style>
