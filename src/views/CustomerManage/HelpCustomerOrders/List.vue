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
                    <a-button @click="goToDetail(record)">添加</a-button>
                </a>
            </a-table>
        </template>
    </div>
</template>

<script>
const columns = [
  {
    title: '应用ID',
    dataIndex: 'applicationId',
    key: 'applicationId',
  },
  {
    title: '服务商名称',
    dataIndex: 'providerName',
    key: 'providerName',
  },
  // {
  //     title: "应用LOGO",
  //     dataIndex: "paymentChannel",
  //     key:"paymentChannel"
  // },
  {
    title: '产品类型',
    dataIndex: 'industryLabelNames',
    key: 'industryLabelNames',
  },
  {
    title: '应用类型',
    dataIndex: 'applicationTypeLabelName',
    key: 'applicationTypeLabelName',
  },
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
      params: { pageNum: 1, pageSize: 11 },
    };
  },
  components: {

  },
  methods: {
    goToDetail(t) {
      this.$emit('ondetail', 'Detail', t);
    },
    getList() {
      this.$api.customerManage.helpCustomerOrdersList(this.params).then((response) => {
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
