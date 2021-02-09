<template>
  <div>
    <div class="top-info tab_info_wrap">
      <div class="flex flex-align-center">
        <div class="mr10">
          <img src="../../assets/img/qiye-3.png" alt="" width="60" height="60">
          <p style="color: #B4B4B4">企业用户</p>
        </div>
        <div class="p10 ml10 flex flex-col flex-justify-around">
          <div class="info-line flex flex-wrap flex-align-start">
            <div class="info-item">
              <label>服务商ID：</label>
              <span>{{detail.providerId}}</span>
            </div>
            <div class="info-item">
              <label> 绑定邮箱：</label>
              <span>{{detail.email?detail.email: '【未填写】'}}</span>
            </div>
            <div class="info-item">
              <label> 注册时间：</label>
              <span>{{detail.registerTime | whetherIsEmpty}}</span>
            </div>
            <div class="info-item">
              <label> 注册手机号：</label>
              <span>{{detail.mobile | whetherIsEmpty}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tab_info_wrap">
      <div class="tab_info_title">企业认证</div>
      <div class="tab_info_body">
        <div class="info_title flex flex-align-center">
          <img src="../../assets/img/jbxx.png" alt="">
          <div>基本信息</div>
        </div>
        <div class="p10 ml10 flex flex-col flex-justify-around flex-align-start">
          <div class="info-line flex flex-wrap">
            <div class="info-item">
              <label>企业名称：</label>
              <span>{{detail.enterpriseName}}</span>
            </div>
            <div class="info-item">
              <label> 纳税人识别号：</label>
              <span>{{detail.taxNumber | whetherIsEmpty}}</span>
            </div>
            <div class="info-item">
              <label> 经营有效期截止：</label>
              <span>{{detail.operateEndDate?detail.operateEndDate:'长期'}}</span>
            </div>
            <div class="info-item">
              <label> 企业行业：</label>
              <span>{{detail.industryName | whetherIsEmpty}}</span>
            </div>
            <div class="info-item">
              <label> 企业地址：</label>
              <span>
                {{companyProvinceName
                  + companyCityName
                  + detail.enterpriseAddress}}</span>
            </div>
            <div class="info-item">
              <label> 营业执照：</label>
              <img-preview :imgPath="detail.licenceAttachPath"></img-preview>
            </div>
          </div>
        </div>
      </div>
      <div class="tab_info_body">
        <div class="info_title flex flex-align-center">
          <img src="../../assets/img/fr.png" alt="">
          <div>法人信息</div>
        </div>
        <div class="p10 ml10 flex flex-col flex-justify-around">
          <div class="info-line flex flex-wrap">
            <div class="info-item">
              <label>法人姓名：</label>
              <span>{{detail.corporationName | whetherIsEmpty}}</span>
            </div>
            <div class="info-item">
              <label> 法人身份证号：</label>
              <span>{{detail.corporationIdentityId | whetherIsEmpty}}</span>
            </div>
            <div class="info-item">
              <label> 身份证有效期：</label>
              <span>{{detail.identityValidBegin+'~'+detail.identityValidEnd}}</span>
            </div>
            <div class="info-item">
              <label>身份证正反面：</label>
              <div class="flex">
                <div class="mr10">
                  <img-preview :imgPath="detail.identityFrontSideAttachPath"></img-preview>
                </div>
                <img-preview :imgPath="detail.identityReverseSideAttachPath"></img-preview>
              </div>
            </div>
            <div class="info-item">
              <label> 法人手机号：</label>
              <span>{{detail.contactMobile | whetherIsEmpty}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="tab_info_body">
        <div class="info_title flex flex-align-center">
          <img src="../../assets/img/zhxx.png" alt="">
          <div>对公帐户信息</div>
        </div>
        <div class="p10 ml10 flex flex-col flex-justify-around">
          <div class="info-line flex flex-wrap">
            <div class="info-item">
              <label>账户名称：</label>
              <span>{{detail.accountName | whetherIsEmpty}}</span>
            </div>
            <div class="info-item">
              <label> 开户银行：</label>
              <span>{{detail.bankName | whetherIsEmpty}}</span>
            </div>
            <div class="info-item">
              <label>开户行所在地：</label>
              <span>{{ bankProvinceName + bankCityName }}</span>
            </div>
            <div class="info-item">
              <label> 开户支行名称：</label>
              <span>{{detail.bankBranch | whetherIsEmpty}}</span>
            </div>
            <div class="info-item">
              <label> 开户账号：</label>
              <span>{{detail.bankAccount | whetherIsEmpty}}</span>
            </div>
            <div class="info-item">
              <label> 开户许可证：</label>
              <span>
                <img-preview :imgPath="detail.permissionAttachPath"></img-preview>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="tab_info_body">
        <div class="info_title flex flex-align-center">
          <img src="../../assets/img/lxr.png" alt="">
          <div>联系人信息</div>
        </div>
        <div class="p10 ml10 flex flex-col flex-justify-around">
          <div class="info-line flex flex-wrap">
            <div class="info-item">
              <label>企业联系人姓名：</label>
              <span>{{detail.contactName | whetherIsEmpty}}</span>
            </div>
            <div class="info-item">
              <label> 企业联系人手机号：</label>
              <span>{{detail.contactMobile | whetherIsEmpty}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tab_info_wrap">
      <a-tabs defaultActiveKey="1" class="">
        <a-tab-pane tab="历史平台审核" key="1">
          <collapse-table
            row-key="index"
            :columns="auditRecordColumns"
            :dataSource="auditRecord"
            :pagination="false">
            <span slot="auditStatus" slot-scope="{data}">
              {{$getters.providerAuthStatus(Number(data.auditStatus))}}
            </span>
            <div
              slot="expandedRowRender"
              slot-scope="{data}"
              style="margin: 0;line-height: 28px;color: #2B303B">
              <p><label >违反的规则类型：</label> {{data.rejectReason}}</p>
            </div>
          </collapse-table>
        </a-tab-pane>
        <a-tab-pane tab="历史三方审核" key="2">
          <collapse-table
            row-key="index"
            :columns="platformRecordColumns"
            :dataSource="platformAuditRecord"
            :pagination="false">
            <span slot="auditStatus" slot-scope="{data}">
              {{$getters.providerAuthStatus(Number(data.auditStatus))}}
            </span>
            <div
              slot="expandedRowRender"
              slot-scope="{data}"
              style="margin: 0;line-height: 28px;color: #2B303B"
              v-if="Number(data.auditStatus) !== 2">
              <p>
                <label >备注：</label> {{data.rejectReason | whetherIsEmpty}}
              </p>
            </div>
          </collapse-table>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div class="tab_info_wrap" v-if="examine">
      <div class="tab_info_title">认证审核</div>
      <div class="tab_info_form">
        <div class="form_line">
          <label>审核结果：</label>
          <s-select
            v-model="form.auditStatus"
            :options="$selectOptions.providerAuthStatus.slice(2,4)">
            </s-select>
        </div>
        <div>
          <div class="form_line">
            <rule-back
              :auditStatus="$getters.providerAuthStatus(Number(form.auditStatus))"
              :ruleData="ruleData1"
              @submit="textComfirm"
              v-if="Number(form.auditStatus) === -1"></rule-back>
            <rule-back
              :auditStatus="$getters.providerAuthStatus(Number(form.auditStatus))"
              :ruleData="ruleData2"
              @submit="textComfirm"
              v-if="Number(form.auditStatus) === -2"></rule-back>
          </div>
          <div class="form_line">
            <s-input
              v-model="form.rejectReason"
              type="area"
              width="auto"
              height="146"
              :maxlength="512"></s-input>
          </div>
        </div>
        <div class="form_line flex flex-justify-end">
          <a-button
            class="btn"
            type="primary"
            @click="handleSubmit"
            :disabled="!(form.auditStatus && form.rejectReason)">提交</a-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CollapseTable from '../../components/CollapseTable.vue';
import RuleBack from '../../components/RuleBack.vue';
import ImgPreview from '../../components/ImgPreview.vue';

export default {
  components: {
    CollapseTable,
    RuleBack,
    ImgPreview,
  },
  data() {
    const columns = [{
      title: '套餐版本',
      dataIndex: 'packageVersion',
    }, {
      title: '套餐配额',
      dataIndex: 'packageInvokeMax',
      scopedSlots: { customRender: 'packageInvokeMax' },
    }, {
      title: '套餐人数',
      dataIndex: 'packageUserMax',
      scopedSlots: { customRender: 'packageUserMax' },
    }, {
      title: '价格',
      dataIndex: 'packagePrice',
      scopedSlots: { customRender: 'packagePrice' },
    }, {
      title: '时间',
      key: 'packageTime',
      scopedSlots: { customRender: 'packageTime' },
    }];
    const auditRecordColumns = [{
      title: '序号',
      dataIndex: 'index',
    }, {
      title: '审核结果',
      dataIndex: 'auditStatus',
      scopedSlots: { customRender: 'auditStatus' },
    }, {
      title: '审核时间',
      dataIndex: 'auditTime',
      // width: '300px'
    }, {
      title: '审核员',
      dataIndex: 'auditor',
      // width: '300px'
    }];
    const platformRecordColumns = [{
      title: '序号',
      dataIndex: 'index',
    }, {
      title: '审核结果',
      dataIndex: 'auditStatus',
      scopedSlots: { customRender: 'auditStatus' },
    }, {
      title: '审核时间',
      dataIndex: 'auditTime',
    }, {
      title: '审核平台',
      dataIndex: 'auditor',
    }];
    const ruleData1 = [
      {
        title: '1.企业资质被驳回情况',
        key: '0-1',
        children: [
          {
            title: '1.1 企业名称填写有错误',
            key: '1-1',
          },
          {
            title: '1.2 企业税号填写有错误',
            key: '1-2',
          }, {
            title: '1.3 企业注册地址填写有错误',
            key: '1-3',
          },
          {
            title: '1.4 企业法人姓名填写有错误',
            key: '1-4',
          }, {
            title: '1.5 企业法人身份证号填写有错误',
            key: '1-5',
          },
          {
            title: '1.6 法人身份证有效期已过',
            key: '1-6',
          }, {
            title: '1.7 企业注册地址未填写完整',
            key: '1-7',
          },
          {
            title: '1.8 企业法人身份证清晰度不够或含水印信息',
            key: '1-8',
          }, {
            title: '1.9 企业营业执照清晰度不够或含水印信息',
            key: '1-9',
          },
          {
            title: '1.10 企业开户行名称填写有错误',
            key: '1-10',
          }, {
            title: '1.11 企业开户账号填写错误',
            key: '1-11',
          },
          {
            title: '1.12 企业开户许可证证书清晰度不够或含水印信息',
            key: '1-12',
          },
        ],
      },
    ];
    const ruleData2 = [
      {
        title: '1.企业资质被拒绝情况',
        key: '0-1',
        children: [
          {
            title: '1.1 企业营业执照过期或造假',
            key: '1-1',
          },
          {
            title: '1.2 企业被纳入失信被执行人名单',
            key: '1-2',
          }, {
            title: '1.3 企业法人被纳入征信黑名单',
            key: '1-3',
          },
          {
            title: '1.4 企业经营状态非存续或在业',
            key: '1-4',
          }, {
            title: '1.5 企业注册资本低于50万元',
            key: '1-5',
          },
          {
            title: '1.6 企业经营范围非计算机服务行业',
            key: '1-6',
          }, {
            title: '1.7 企业不符合RockySaaS云合作伙伴要求',
            key: '1-7',
          },
        ],
      },
    ];
    return {
      providerId: this.$route.params.id,
      examine: this.$route.query.examine || false,
      detail: {},
      pagaination: {
        current: 1,
        pageSize: global.config.pageSize,
        total: 0,
      },
      columns,
      auditRecord: [],
      auditRecordColumns,
      platformRecordColumns,
      platformAuditRecord: [],
      form: {
        auditStatus: '',
        rejectReason: '',
      },
      uploadUrl: global.config.uploadUrl,
      ruleData1,
      ruleData2,
      companyProvinceName: '',
      companyCityName: '',
      bankProvinceName: '',
      bankCityName: '',
    };
  },
  mounted() {
    this.getDetail();
    this.getAuthAuditRecord();
  },
  filters: {
    whetherIsEmpty(value) {
      if (!value) return '-';
      return value;
    },
  },
  methods: {
    getDetail() {
      this.$api.myExamine.authExamineDetail(this.providerId).then((res) => {
        if (res.code === 200) {
          this.detail = res.result;
          this.getProvinceName(
            this.detail.enterpriseLocationProvince,
            this.detail.enterpriseLocationCity,
            this.detail.bankLocationProvince,
            this.detail.bankLocationCity,
          );
          if (this.detail.packageColumns) {
            const packageColumns = JSON.parse(this.detail.packageColumns);
            packageColumns.forEach((item) => {
              if (item.value === 0) {
                this.columns.forEach((ele, index) => {
                  if (ele.title === item.name) {
                    this.columns.splice(index, 1);
                  }
                });
              }
            });
          }
        }
      });
    },
    getProvinceName(companyProvinceCode, companyCityCode, backProvinceCode, bankCityCode) {
      this.$api.common.getProviceCode(0).then((res) => {
        if (res.code === 200) {
          const { result } = res;
          result.forEach((item) => {
            if (companyProvinceCode === item.id) {
              this.companyProvinceName = item.name;
            }
            if (backProvinceCode === item.id) {
              this.bankProvinceName = item.name;
            }
          });
        }
      });
      this.$api.common.getProviceCode(companyProvinceCode).then((res) => {
        if (res.code === 200) {
          const cityData = res.result;
          cityData.forEach((ele) => {
            if (companyCityCode === ele.id) {
              this.companyCityName = ele.name;
            }
          });
        }
      });
      this.$api.common.getProviceCode(backProvinceCode).then((res) => {
        if (res.code === 200) {
          const cityData = res.result;
          cityData.forEach((ele) => {
            if (bankCityCode === ele.id) {
              this.bankCityName = ele.name;
            }
          });
        }
      });
    },
    getAuthAuditRecord() {
      this.$api.myExamine.authAuditRecord({ providerId: this.providerId }).then((res) => {
        if (res.code === 200) {
          res.result.list.forEach((item, index) => {
            /* eslint-disable */
            item.index = index + 1;
            item.expend = false;
          });
          this.auditRecord = res.result.list;
        }
      });
      this.$api.myExamine.platformAuditRecord({ providerId: this.providerId }).then((res) => {
        if (res.code === 200) {
          res.result.list.forEach((item, index) => {
            item.index = index + 1;
            item.expend = false;
          });
          this.platformAuditRecord = res.result.list;
        }
      });
    },
    handleSubmit() {
      const params = {
        ...this.form,
        providerId: this.providerId,
        applicationName: this.detail.applicationName,
      };
      this.$api.myExamine.authExamine(params).then((res) => {
        if (res.code === 200) {
          this.$message.success('操作成功');
          this.$router.go(-1);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    textComfirm(text) {
      this.form.rejectReason = text;
    },
  },
};
</script>
<style lang="scss" scoped>
.top-info{
  padding: 25px 40px;
  background: #fff;
}
.info-line {
  .info-item{
    width: 420px;
    color: #2B303B;
    padding: 10px;
    display: flex;
    align-items: flex-start;
  }
}
.tab_info_wrap {
  background: #fff;
  margin-bottom: 20px;
  padding: 25px;
}
.tab_info_wrap {
  .tab_info_title {
    font-size:18px;
    color:#3B424D;
    line-height:20px;
    border-left: 3px solid #1585FF;
    padding-left: 15px;
    margin-left: 5px;
  }
  .tab_info_form{
    padding: 10px;
    .form_line{
      padding: 10px;
      .btn{
        width:200px;
        height:50px;
        margin: 20px 40px;
      }
    }
  }
  .tab_info_body{
    padding: 30px;
    .info_title{
      img{
        margin-right: 10px;
      }
    }
  }
}
.reply{
  color: #FF8B46;
}
</style>
