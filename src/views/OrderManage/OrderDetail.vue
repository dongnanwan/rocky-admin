<template>
  <div class="common_page_wapper">
    <div class="page_table">
      <div class="overview flex flex-align-center">
        <div class="text">订单归属用户：<span>【{{detail.mobileNo | whetherIsEmpty}}】</span></div>
        <div class="text">订单状态： <span :class="detail.status===10?'success':''">
          {{$getters.orderStatus(detail.status )| whetherIsEmpty}}</span>
        </div>
      </div>
      <div class="info-wrap mt10">
        <div class="title">订单概要</div>
        <div class="info">
          <div class="info-line flex flex-justify-around">
            <div class="info-item flex-child-average">订单编号：{{detail.orderNo | whetherIsEmpty}}</div>
            <div class="info-item flex-child-average">
              订单类型：{{$getters.orderType(detail.orderType) | whetherIsEmpty}}</div>
            <div class="info-item flex-child-average">
              创建时间：{{detail.createTime | whetherIsEmpty}}</div>
          </div>
          <div class="info-line flex flex-justify-around">
            <div class="info-item flex-child-average">支付时间：{{detail.payTime | whetherIsEmpty}}</div>
            <div class="info-item flex-child-average">
              应付金额：{{detail.payableAmount | whetherIsEmpty}}</div>
            <div class="info-item flex-child-average">
              支付状态：{{$getters.orderStatus(detail.status) | whetherIsEmpty}}</div>
          </div>
          <div class="info-line flex flex-justify-around">
            <div class="info-item flex-child-average">
              优惠金额：{{detail.offAmount | whetherIsEmpty}}</div>
            <div class="info-item flex-child-average">使用优惠：{{detail.offWay | whetherIsEmpty}}</div>
            <div class="info-item flex-child-average">
              发票状态：{{$getters.invoiceStatus(detail.invoiceStatus) | whetherIsEmpty}}</div>
          </div>
        </div>
        <a-table
          bordered
          class="mt30"
          v-if="detail.paymentChannel"
          rowKey="orderNo"
          :dataSource="data"
          :columns="columns"
          :pagination="false"
          ></a-table>
      </div>
      <div class="info-wrap">
        <div class="info-divider"></div>
      </div>
      <div class="info-wrap">
        <div class="title">订单详情</div>
        <div class="info">
          <div class="info-line flex flex-justify-around">
            <div class="info-item flex-child-average">
              服务商名称：{{detail.providerName | whetherIsEmpty}}</div>
            <div class="info-item flex-child-average">
              服务商ID：{{detail.providerId | whetherIsEmpty}}</div>
            <div class="info-item flex-child-average">
              应用名称：{{detail.applicationName | whetherIsEmpty}}</div>
          </div>
          <div class="info-line flex flex-justify-around">
            <div class="info-item flex-child-average">
              套餐版本：{{detail.packageVersion | whetherIsEmpty}}</div>
            <div class="info-item flex-child-average">
              购买年限：
              {{detail.packageTime === -1?
                '无上限':
                detail.packageTime+$getters.timeUnit(Number(detail.packageTimeUnit))}}</div>
            <div class="info-item flex-child-average">
              使用人数：
              {{Number(detail.packageUserMax)===-1
                ?'无上限':
                detail.packageUserMax+'人' | whetherIsEmpty}}</div>
          </div>
          <div class="info-line flex flex-justify-around">
            <div class="info-item flex-child-average">
              实例ID：{{detail.instanceId | whetherIsEmpty}}</div>
            <div class="info-item flex-child-average">
              合约时间：
              {{(detail.packageTime === -1?
              '无期限':
              detail.contractStartTime===null?
                '-':
                detail.contractStartTime+'~'+detail.contractEndTime)}}</div>
            <div class="info-item flex-child-average"></div>
          </div>
        </div>
        <br>
        <div class="info-item flex-child-average" v-if="detail.marketContractPath">订单协议：
          <a
            :href="detail.marketContractPath"
            target="_blank">{{ '《 ' + detail.marketContractPath +' 》'}}</a>
        </div>
      </div>
      <div class="info-wrap">
        <div class="info-divider"></div>
      </div>
      <div class="info-wrap">
        <div class="title">收款方明细</div>
        <a-table
          class="mt30"
          rowKey="providerId"
          :dataSource="collectionData"
          :columns="collection"
          :pagination="false"
          bordered></a-table>
      </div>
    </div>
  </div>
</template>
<script>
const columns = [{
  title: '支付渠道',
  dataIndex: 'paymentChannel',
  align: 'center',
}, {
  title: '扣款费用',
  dataIndex: 'deductAmount',
  align: 'center',
}, {
  title: '扣款时间',
  dataIndex: 'deductTime',
  align: 'center',
}, {
  title: '流水编号',
  dataIndex: 'serialNo',
  align: 'center',
}, {
  title: '扣款账号',
  dataIndex: 'accountNo',
  align: 'center',
}];
const collection = [{
  title: '收款方ID',
  dataIndex: 'providerId',
  align: 'center',
}, {
  title: '收款方名称',
  dataIndex: 'providerName',
  align: 'center',
}, {
  title: '收款金额',
  dataIndex: 'providerReceiveAmount',
  align: 'center',
}, {
  title: '收款备注',
  dataIndex: 'remark',
  align: 'center',
}];
export default {
  data() {
    return {
      orderNo: this.$route.params.id,
      detail: {},
      data: [],
      columns,
      collection,
      collectionData: [],
    };
  },
  filters: {
    whetherIsEmpty(value) {
      if (!value) return '-';
      return value;
    },
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      this.$api.orders.orderDetail(this.orderNo).then((res) => {
        if (res.code === 200) {
          this.detail = res.result;
          if (this.detail.paymentChannel) {
            this.data = [{
              orderNo: this.detail.orderNo,
              paymentChannel: this.$getters.payWay(this.detail.paymentChannel),
              serialNo: this.detail.serialNo,
              accountNo: this.detail.accountNo,
              deductAmount: this.detail.deductAmount,
              deductTime: this.detail.deductTime,
            }];
            this.collectionData = [{
              providerId: this.detail.providerId,
              providerName: this.detail.providerName,
              providerReceiveAmount: this.detail.providerReceiveAmount,
              remark: this.detail.remark,
            }];
          } else {
            this.data = [];
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
  .overview{
    width: 100%;
    height:44px;
    background:#f0f7ff;
    border-radius: 5px;
    padding: 0 20px;
    .text{
      color: #1585FF;
      font-size:14px;
      margin-right: 100px;
    }
  }
  .success{
    color: #00BB39;
  }
  .info-wrap{
    padding: 10px;
    .title{
      margin-bottom: 20px;
      color: rgba(0,0,0,.85);
      font-weight: 700;
      font-size: 16px;
      line-height: 1.5;
    }
    .info{
      .info-line{
        .info-item{
          font-weight: 400;
          font-size: 14px;
          line-height: 30px;
        }
      }
    }
  }
  .info-divider{
    display: block;
    clear: both;
    width: 100%;
    min-width: 100%;
    // height: 1px;
    border-bottom: 1px dashed #e8e8e8;
    // background: #e8e8e8;
    margin: 20px 0;
  }
</style>
