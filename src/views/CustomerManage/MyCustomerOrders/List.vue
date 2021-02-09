<template>
    <div>
        <div class="search-group">
            <span>订单编号</span>
            <a-input v-model="params.accountId" size="small" style="width:200px;height:30px" />
            <a-button @click="handleSearch" type="primary">查询</a-button>
        </div>

        <template>
            <a-table :columns="columns" :data-source="data">
                <a slot="operation" slot-scope="text,record">
                    <a-button @click="goToDetail(record)">详情</a-button>
                </a>
            </a-table>
        </template>
    </div>
</template>

<script>
const columns = [
  {
    title: '订单编号',
    dataIndex: 'accountId',
    key: 'accountId',
  },
  {
    title: '订单类型',
    dataIndex: 'orderType',
    key: 'orderType',
  },
  {
    title: '用户手机号',
    dataIndex: 'mobileNo',
    key: 'mobileNo',
  },
  {
    title: '实名',
    dataIndex: 'authStatus',
    key: 'authStatus',
  },
  {
    title: '服务商',
    dataIndex: 'applicationName',
    key: 'applicationName',
  },
  // {
  //     title: "产品详情",
  //     dataIndex: "accountId",
  //     key:"accountId"
  // },
  {
    title: '支付方式',
    dataIndex: 'paymentChannel',
    key: 'paymentChannel',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '支付时间',
    dataIndex: 'payTime',
    key: 'payTime',
  },
  {
    title: '支付状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '应付金额',
    dataIndex: 'payableAmount',
    key: 'payableAmount',
  },
  {
    title: '优惠金额',
    dataIndex: 'offAmount',
    key: 'offAmount',
  },
  {
    title: '实付金额',
    dataIndex: 'paymentAmount',
    key: 'paymentAmount',
  },
  {
    title: '发票状态',
    dataIndex: 'invoiceStatus',
    key: 'invoiceStatus',
  },
  // {
  //     title: "协议状态",
  //     dataIndex: "accountId",
  //     key:"accountId"
  // },
  {
    title: '操作',
    ellipsis: true,
    scopedSlots: { customRender: 'operation' },
  },
];


export default {
  data() {
    return {
      data: [],
      columns,
      params: { pageNum: 1, pageSize: 10 },
    };
  },
  components: {

  },
  methods: {
    goToDetail(t) {
      this.$emit('ondetail', 'Detail', t.orderNo);
    },
    getList() {
      this.$api.customerManage.myCustomerOrderList(this.params).then((response) => {
        this.data = response.result.list;
      });
    },
    handleSearch() {
      // if(this.params.accountId){
      //     this.params.accountId = Number(this.params.accountId)
      // }
      // console.log(this.params)
      this.getList();
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style scoped>
.search-group{
    padding: 20px;
}
</style>
