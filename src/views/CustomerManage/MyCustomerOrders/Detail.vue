<template>
    <div class="detail">
        <div class="detail-title">
            <span>订单归属用户:</span>
            <span>{{belongToUser}}</span>
            <span>订单状态:</span>
            <span>{{orderStatus}}</span>
        </div>
        <div>订单概要</div>
        <ul class="display">
            <li class="display-group" v-for="(val,index) in order" :key="index">
                <span class="display-key">{{val.key}}</span>
                <span class="display-val">{{val.val}}</span>
            </li>
        </ul>
        <div>收款方明细</div>
        <ul class="display">
            <li class="display-group" v-for="(val,index) in payeeDetail" :key="index">
                <span class="display-key">{{val.key}}</span>
                <span class="display-val">{{val.val}}</span>
            </li>
        </ul>
        <div>订单详情</div>
        <ul class="display">
            <li class="display-group" v-for="(val,index) in orderDetail" :key="index">
                <span class="display-key">{{val.key}}</span>
                <span class="display-val">{{val.val}}</span>
            </li>
        </ul>
        <a-button type="primary" @click="$emit('ondetail','List')">返回</a-button>
    </div>
</template>

<script>
export default {
  computed: {
    run() {
      return function (val) {
        return `${val}aa`;
      };
    },
  },
  filters: {
    myfilter(val) {
      return `${val}$`;
    },
  },
  data() {
    return {
      order: [],
      payeeDetail: [],
      orderDetail: [],
      belongToUser: '',
      orderStatus: '',
    };
  },
  props: {
    id: {
      type: [Number, String],
    },
  },
  methods: {
    formatKey(val) {
      switch (val) {
        case 'id':
          return '订单编号';
        default:
          return val;
      }
    },
  },
  mounted() {
    this.$api.customerManage.myCustomerOrderDetail(this.id).then((response) => {
      const r = response.result;
      this.order = [
        { key: '订单编号', val: r.orderNo }, { key: '订单类型', val: r.orderType }, { key: '创建时间', val: r.createTime }, { key: '支付时间', val: r.payTime },
        { key: '应付金额', val: r.paymentAmount }, { key: '支付状态', val: r.status }, { key: '优惠金额', val: r.offAmount }, { key: '使用优惠', val: r.deductAmount },
        { key: '发票状态', val: r.invoiceStatus },
      ];

      this.payeeDetail = [
        { key: '收款方ID', val: r.providerId }, { key: '收款方名称', val: r.provideName }, { key: '收款金额', val: r.providerReceiveAmount }, { key: '收款备注', val: r.remark },
      ];

      this.orderDetail = [
        { key: '服务商名称', val: r.providerName }, { key: '服务商ID', val: r.provideId }, { key: '应用名称', val: r.applicationName }, { key: '套餐版本', val: r.packageVersion },
        { key: '购买年限', val: r.applicatinTime }, { key: '使用人数', val: r.packageUserMax }, { key: '实例ID', val: r.applicationId }, { key: '合约时间', val: r.contractStartTime ? `${r.contractStartTime}-${r.contractEndTime}` : '' },
      ];

      this.orderStatus = r.status === 1 ? '未支付' : r.status === 10 ? '已支付' : r.status === 20 ? '已结算' : '已取消';

      this.belongToUser = r.accountId;
    });
  },
};
</script>

<style scoped>
.detail{
    width: 100%;
    min-width: 800px;
    margin: 0 auto;
}
.detail-title span{
    margin-right: 20px;
}
.display{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    /* border: 1px solid #ccc; */
}
.display-group{
    width: 50%;
    display: flex;
    justify-content: space-around;
    text-align: center;
    line-height: 40px;
    height: 40px;
}
.display-group span{
    width: 50%;
    border: 1px solid #ccc;
}
</style>
