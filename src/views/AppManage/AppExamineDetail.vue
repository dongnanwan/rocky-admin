<template>
  <div>
    <div class="overview">
      <div class="flex flex-align-center">
        <div class="left flex flex-col flex-justify-center">
          <div class="img-wrap">
            <img :src="detail.applicationLogoPath" alt="应用logo"  width="200" height="132">
            <p>应用Logo</p>
          </div>
          <div class="img-wrap">
            <img :src="detail.applicationImagePath" alt="应用展位图"  width="200" height="132">
            <p>应用展位图</p>
          </div>
        </div>
        <div class="right">
          <div class="overview_detail">
            <div class="overview_title flex flex-align-center">
              <a-icon type="tablet" theme="twoTone" style="font-size: 20px; padding: 8px;"/>
              <div>应用简介</div>
            </div>
            <div class="info_wrap flex flex-wrap">
              <div class="info_item"><label>应用名称：</label>{{detail.applicationName}}</div>
            </div>
            <div class="info_wrap flex flex-wrap">
              <div class="info_item">
                <label>分类标签：</label>
                {{detail.productTypeLabelName}}>{{detail.applicationTypeLabelName}}</div>
            </div>
            <div class="info_desc">
              <div class="label">应用简介：</div>
              <span class="text">
              {{detail.introduce}}
              </span>
            </div>
            <div class="divide"></div>
            <div class="provider-info flex">
              <div class="provider-detail">
                <div class="overview_title flex flex-align-center">
                  <a-icon type="shop" theme="twoTone" style="font-size: 20px; padding: 8px;"/>
                  <div>服务商信息</div>
                </div>
                <div class="info_wrap flex flex-wrap">
                  <div class="info_item"><label>服务商名称：</label>{{detail.providerName}}</div>
                  <div class="info_item"><label>客服电话：</label>{{detail.customerServiceLine}}</div>
                  <div class="info_item"><label>客服邮箱：</label>{{detail.customerServiceEmail}}</div>
                </div>
                <div class="info_wrap flex flex-wrap">
                  <div class="info_item">
                    <label>在线时间：</label>{{detail.onlineServiceTime | whetherIsEmpty}}</div>
                </div>
              </div>
              <div class="provider-img">
                <div class="img-wrap" style="width: 214px;margin: 0 auto;">
                  <img
                    class="overview_avatar"
                    :src="detail.providerLogoPath"
                    alt="应用logo"
                    width="214"
                    height="66">
                  <p>服务商logo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tab_info_wrap">
      <a-tabs defaultActiveKey="1" class="">
        <a-tab-pane tab="产品详情" key="1">
          <div v-html="detail.detailInfo"></div>
        </a-tab-pane>
        <a-tab-pane tab="系统演示" key="2" v-if="detail.presentVideoUrl">
          <video :src="detail.presentVideoUrl" controls="controls" width="842" height="507">
            您的浏览器不支持 video 标签。
          </video>
        </a-tab-pane>
        <a-tab-pane tab="套餐信息" key="3">
          <div class="flex flex-justify-start p10">
            <div style="width: 800px;">
              <a-table
                row-key="id"
                :columns="columns"
                :dataSource="detail.packageList"
                bordered
                :pagination="false"
                size="middle">
                <span slot="packageInvokeMax" slot-scope="data">
                  {{data==-1?'不限':data+'次'}}
                </span>
                <span slot="packageUserMax" slot-scope="data">
                  {{data==-1?'不限':data+'人'}}
                </span>
                <span slot="packagePrice" slot-scope="data">
                  {{data+'元'}}
                </span>
                <span slot="packageTime" slot-scope="data">
                  {{data.packageTime===-1?
                    '无上限'
                    :data.packageTime+$getters.timeUnit(Number(data.packageTimeUnit))}}
                </span>
              </a-table>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane tab="售后服务" key="4">
          <div v-html="detail.afterSaleInstruction"></div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div class="tab_info_wrap">
      <a-tabs defaultActiveKey="1" class="">
        <a-tab-pane tab="历史平台审核" key="1">
          <collapse-table
            row-key="index"
            :columns="auditRecordColumns"
            :dataSource="auditRecord" :pagination="false">
            <span slot="auditStatus" slot-scope="{data}">
              {{$getters.appAuditStatus(Number(data.auditStatus))}}
            </span>
            <div
              slot="expandedRowRender"
              slot-scope="{data}" style="margin: 0;line-height: 28px;color: #2B303B">
              <p v-if="Number(data.auditStatus) !== 10">
                <label >违反的规则类型：</label>{{data.rejectReason}}
              </p>
              <p v-if="Number(data.auditStatus) === -5">
                <label>修改建议：</label>{{data.modifyAdvice | whetherIsEmpty}}
              </p>
              <p v-if="Number(data.auditStatus) !== 10">
                <label class="reply">
                  【{{detail.providerName}}】回复：</label>{{data.auditReply | whetherIsEmpty}}
              </p>
              <a
                :href="data.providerFilePath"
                target="_blank"
                v-if="data.providerFilePath">点击下载附件</a>
            </div>
          </collapse-table>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div class="tab_info_wrap" v-if="examine">
      <div class="tab_info_title">应用审核</div>
      <div class="tab_info_form">
        <div class="form_line">
          <label>审核结果：</label>
          <s-select v-model="form.auditStatus" :options="$selectOptions.appAuditStatus2"></s-select>
        </div>
        <div v-if="form.auditStatus === '-5' || form.auditStatus === '-30'">
          <div class="form_line">
            <rule-back
              :auditStatus="$getters.appAuditStatus2(Number(form.auditStatus))"
              :ruleData="ruleData1" @submit="textComfirm" v-if="form.auditStatus === '-5'">
            </rule-back>
            <rule-back
              :auditStatus="$getters.appAuditStatus2(Number(form.auditStatus))"
              :ruleData="ruleData2" @submit="textComfirm" v-if="form.auditStatus === '-30'">
            </rule-back>
          </div>
          <div class="form_line">
            <s-input style="white-space: pre-line"
              v-model="form.rejectReason"
              type="area"
              width="auto"
              height="146"
              :maxlength="512"></s-input>
          </div>
          <div>
            <a-upload
              name="file"
              :multiple="false"
              :headers="{'Authorization':$store.state.token}"
              :beforeUpload="(file)=>{return beforeUpload(file)}"
              @change="handleChange"
              :action="uploadUrl"
              :fileList="fileList"
            >
              <a-button type="link">上传附件</a-button>
            </a-upload>
          </div>
        </div>
        <div v-if="form.auditStatus === '-5'">
          <div class="form_line">修改建议：</div>
          <div class="form_line">
            <s-input
            v-model="form.modifyAdvice"
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
            :disabled="btnDisabled">提交</a-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CollapseTable from '../../components/CollapseTable.vue';
import RuleBack from '../../components/RuleBack.vue';

export default {
  components: {
    CollapseTable,
    RuleBack,
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
    }, {
      title: '审核员',
      dataIndex: 'auditor',
    }];
    const ruleData1 = [
      {
        title: '1.SaaS应用被驳回情况',
        key: '0-1',
        children: [
          {
            title: '1.1 SaaS应用名称超过30个汉字或60个字符',
            key: '1-1',
          }, {
            title: '1.2 SaaS应用名称含有特殊符号或空格',
            key: '1-2',
          }, {
            title: '1.3 SaaS应用名称与实际名称不相符',
            key: '1-3',
          }, {
            title: '1.4 SaaS应用简介超过130个汉字或260个字符',
            key: '1-4',
          }, {
            title: '1.5 SaaS应用简介中含有特殊符号（如“*”“-”）',
            key: '1-5',
          }, {
            title: '1.6 SaaS应用简介与实际应用内容不相符或无关',
            key: '1-6',
          }, {
            title: '1.7 SaaS应用详情（包括图文）与实际应用内容不相符或无关',
            key: '1-7',
          }, {
            title: '1.8 SaaS应用使用指南、演示视频与实际应用内容不相符或无关',
            key: '1-8',
          }, {
            title: '1.9 SaaS应用名称、简介、应用logo、公司logo、展位图、应用详情、使用指南、演示视频等信息相互没有关联的',
            key: '1-9',
          }, {
            title: '1.10 SaaS应用公司logo、应用logo、展位图清晰度不够或含水印信息',
            key: '1-10',
          }, {
            title: '1.11 SaaS应用的应用详情图清晰度不够或含水印信息',
            key: '1-11',
          }, {
            title: '1.12 SaaS应用详情图存在重复图片的',
            key: '1-12',
          }, {
            title: '1.13 SaaS应用售后信息与实际情况不相符或无关',
            key: '1-13',
          }, {
            title: '1.14 SaaS应用所选应用类型与实际应用内容不相符或无关',
            key: '1-14',
          }, {
            title: '1.15 SaaS应用所选行业与实际应用内容不相符或无关',
            key: '1-15',
          }, {
            title: '1.16 SaaS应用简介、应用详情、使用指南嵌入非RockySaaS云市场的外部链接地址',
            key: '1-16',
          }, {
            title: '1.17软件著作权资质证书清晰度不够或含水印信息',
            key: '1-17',
          }, {
            title: '1.18网站备案许可证证书清晰度不够或含水印信息',
            key: '1-18',
          }, {
            title: '1.19电信业务经营许可证证书清晰度不够或含水印信息',
            key: '1-19',
          }, {
            title: '1.20质量管理体系认证（ISO9000）证书清晰度不够或含水印信息',
            key: '1-20',
          },
        ],
      },
    ];
    const ruleData2 = [
      {
        title: '1.SaaS应用被拒绝情况',
        key: '0-1',
        children: [
          {
            title: '1.1 SaaS应用存在反政府、反社会或不符合主流政治的行为',
            key: '1-1',
          }, {
            title: '1.2 SaaS应用存在煽动性的涉政言论或国家法律禁止的内容',
            key: '1-2',
          }, {
            title: '1.3 SaaS应用内容含有散布谣言，扰乱社会秩序，破坏社会稳定信息的',
            key: '1-3',
          }, {
            title: '1.4 SaaS应用内容含有色情素材（即旨在激发情欲，对性器官或性行为的明确描述或展示，而无关美学）的',
            key: '1-4',
          }, {
            title: '1.5 SaaS应用存在涉嫌宣扬传播淫秽、色情内容信息，包括暴露图片、挑逗内容等',
            key: '1-5',
          }, {
            title: '1.6 SaaS应用内容包含非法色情交易的信息',
            key: '1-6',
          }, {
            title: '1.7 SaaS应用以虚拟货币或真实货币直接进行押输赢、竞猜、参与赌博等',
            key: '1-7',
          }, {
            title: '1.8 SaaS应用以或包含炸金花（扎金花）、梭哈、百家乐、赌场、比大小、赢三张、三张牌、六合彩、轮盘、港式五张、21点、黑杰克等宣扬赌博的名称作为应用的名称',
            key: '1-8',
          }, {
            title: '1.9 SaaS应用内容涉及宗教、文化或民族群体的引用或评论包含诽谤性、攻击性或狭隘性内容，或会使特定群体遭受伤害或暴力的程序',
            key: '1-9',
          }, {
            title: '1.10 SaaS应用内容包含煽动民族仇恨、民族歧视、破坏民族团结的内容、破坏国家宗教政策、宣扬邪教和封建迷信的将被拒绝',
            key: '1-10',
          }, {
            title: '1.11 SaaS应用内容包含展示人或动物被杀戮、致残、枪击、针刺或其他伤害的真实图片，描述暴力或虐待儿童的将被拒绝',
            key: '1-11',
          }, {
            title: '1.12 SaaS应用内容包含宣扬暴力血腥内容的将被拒绝',
            key: '1-12',
          }, {
            title: '1.13 SaaS应用内容包含侮辱或者诽谤他人，侵害他人合法权益信息的将被拒绝',
            key: '1-13',
          }, {
            title: '1.14 SaaS应用内容带有模仿、抄袭、虚假、欺诈的将被拒绝',
            key: '1-14',
          }, {
            title: '1.15 SaaS应用名称、logo、内容、元素等侵犯他人权利（著作权、商标权、肖像权、名誉权等）',
            key: '1-15',
          },
        ],
      },
    ];
    return {
      applicationId: this.$route.params.id,
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
      activeKey: ['1'],
      form: {
        auditStatus: '',
        rejectReason: '',
        auditAttachId: '',
        modifyAdvice: '',
      },
      uploadUrl: global.config.uploadUrl,
      fileList: [],
      ruleVisible: false,
      ruleData1,
      ruleData2,
      checkedKeys: [],
      textArr: [],
    };
  },
  mounted() {
    this.getDetail();
    this.getAppAuditRecord();
  },
  filters: {
    whetherIsEmpty(value) {
      if (!value) return '-';
      return value;
    },
  },
  computed: {
    btnDisabled() {
      const { auditStatus } = this.form;
      if (auditStatus === '10') {
        return false;
        /* eslint-disable */
      } else if (auditStatus !== '10') {
        if (this.form.rejectReason) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
  },
  methods: {
    getDetail() {
      this.$api.app.appAuditDetail(this.applicationId).then((res) => {
        if (res.code === 200) {
          this.detail = res.result;
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
    getAppAuditRecord() {
      this.$api.app.appAuditRecord({ applicationId: this.applicationId }).then((res) => {
        if (res.code === 200) {
          res.result.list.forEach((item, index) => {
            item.index = index + 1;
            item.expend = false;
          });
          this.auditRecord = res.result.list;
        }
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
        this.form.auditAttachId = response.result.attachmentId;
      }
    },
    handleSubmit() {
      const params = {
        ...this.form,
        applicationId: this.applicationId,
        applicationName: this.detail.applicationName,
      };
      this.$api.myExamine.appExamine(params).then((res) => {
        if (res.code === 200) {
          this.$message.success('操作成功');
          this.$router.go(-1);
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

.overview{
  width: 100%;
  // height: 320px;
  background: #fff;
  margin-bottom: 20px;
  padding:  20px 50px 30px ;
  .left{
    flex: 0 0 220px;
  }
  .right{
    flex: 1;
    .divide{
      width:100%;
      height:1px;
      background: #DADADA;
      margin: 20px 0;
    }
    .provider-info{
      .provider-detail{
        flex: 1;
      }
      .provider-img{
        flex: 0 0 360px;
        border-left: 1px dashed #ccc;
      }
    }
  }
  .img-wrap{
    padding: 10px;
    p{
      text-align: center;
      line-height: 48px;
      color: #909090;
    }
  }
  .overview_title{
    font-size:16px;
    font-family:MicrosoftYaHei;
    color:rgba(59,66,77,1);
    line-height:40px;
  }
  .overview_detail {
    margin-left: 20px;
    .info_wrap {
      padding: 0 10px;
      .info_item {
        flex: 0 0 320px;
        font-size:14px;
        font-family:SourceHanSansCN-Regular,SourceHanSansCN;
        color: #909090;
        line-height:40px;
        label {
          font-weight:400;
          color:#2B303B;
        }
      }
    }
    .info_desc{
      padding: 0 10px;
      max-width:900px;
      .label{
        color: #2B303B;
        line-height: 30px;
      }
      .text{
        color: #909090;
        line-height: 30px;
      }
    }
  }
  .overview_point{
    width: 320px;
    .relative{
      // width: 70px;
      position: relative;
      .icon_edit{
        position: absolute;
        top: 5px;
        right: 0px;
        cursor: pointer;
      }
    }
    .point{
      font-size:28px;
      font-family:SourceHanSansCN-Bold,SourceHanSansCN;
      font-weight:bold;
      line-height:58px;
    }
    .overview_point_1{
      flex: 1;
      border-right: 1px dashed #CECECE;
      padding: 0 20px;
      .point{
        color:#FF8B46;
      }
    }
    .overview_point_2{
       flex: 1;
       padding: 0 20px;
      .point{
        color:#1585FF;
      }
    }
  }
}
.tab_info_wrap {
  background: #fff;
  margin-bottom: 20px;
  padding: 20px;
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
      // line-height: 60px;
      .btn{
        width:200px;
        height:50px;
        margin: 40px;
      }
    }
  }
}
.reply{
  color: #FF8B46;
}
</style>
<style lang="scss">
  
</style>
