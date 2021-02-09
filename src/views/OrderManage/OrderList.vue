<template>
  <div class="common_page_wapper">
    <div class="page_search">
      <search-com :searchData="searchData" @search="search"></search-com>
    </div>
    <div class="page_table p15">
      <a-table
        rowKey="orderNo"
        :dataSource="data"
        :columns="columns"
        :pagination="pagination" @change="handleTableChange">
        <span slot="orderNo" slot-scope="data">
          <div class="word-break">{{data}}</div>
        </span>
        <!-- <span slot="mobileNo" slot-scope="data">
          <div class="word-break">{{data}}</div>
        </span> -->
        <span slot="appDetail" slot-scope="data">
          {{data.applicationName}}  <br>
          {{data.packageVersion}}  <br>
          {{Number(data.packageTime) ===-1?'无上限/':data.packageTime+$getters.timeUnit(Number(data.packageTimeUnit))+'/'}}
          {{Number(data.packageInvokeMax) == -1?'无上限/':'限用'+data.packageInvokeMax + '次'}}
          {{Number(data.packageUserMax) == -1?'无上限':data.packageUserMax + '人'}}
        </span>
        <span slot="orderType" slot-scope="data">{{$getters.orderType(data)}}</span>
        <span slot="paymentChannel" slot-scope="data">{{$getters.payWay(data)}}</span>
        <span slot="status" slot-scope="data">{{$getters.orderStatus(data)}}</span>
        <span slot="invoiceStatus" slot-scope="data">{{$getters.invoiceStatus(data)}}</span>
        <span slot="operation" slot-scope="data">
          <span @click="handleDetail(data.orderNo)" class="mr10"><a>详情</a></span>
        </span>
      </a-table>
    </div>
  </div>
</template>
<script>
import searchCom from '../../components/Search.vue';

const columns = [{
  title: '订单编号',
  dataIndex: 'orderNo',
  align: 'center',
  scopedSlots: { customRender: 'orderNo' },
}, {
  title: '订单类型',
  dataIndex: 'orderType',
  scopedSlots: { customRender: 'orderType' },
  align: 'center',
  width: 100,
}, {
  title: '用户手机号',
  dataIndex: 'mobileNo',
  align: 'center',
  scopedSlots: { customRender: 'mobileNo' },
},
{
  title: '服务商',
  dataIndex: 'providerName',
  align: 'center',
  width: 100,
}, {
  title: '产品详情',
  key: 'appDetail',
  scopedSlots: { customRender: 'appDetail' },
  align: 'center',
  width: 300,
}, {
  title: '支付方式',
  dataIndex: 'paymentChannel',
  scopedSlots: { customRender: 'paymentChannel' },
  align: 'center',
  width: 150,
}, {
  title: '创建时间',
  dataIndex: 'createTime',
  align: 'center',
  width: 100,
}, {
  title: '支付时间',
  dataIndex: 'payTime',
  align: 'center',
  width: 100,
}, {
  title: '支付状态',
  dataIndex: 'status',
  scopedSlots: { customRender: 'status' },
  align: 'center',
  width: 100,
}, {
  title: '应付金额',
  dataIndex: 'payableAmount',
  align: 'center',
  width: 100,
}, {
  title: '优惠金额',
  dataIndex: 'offAmount',
  align: 'center',
  width: 100,
}, {
  title: '实付金额',
  dataIndex: 'paymentAmount',
  align: 'center',
  width: 100,
}, {
  title: '发票状态',
  dataIndex: 'invoiceStatus',
  scopedSlots: { customRender: 'invoiceStatus' },
  align: 'center',
  width: 100,
}, {
  title: '操作',
  key: 'operation',
  scopedSlots: { customRender: 'operation' },
  align: 'center',
  width: 100,
}];
export default {
  components: {
    searchCom,
  },
  data() {
    return {
      searchData: [],
      consition: {},
      total: 0,
      pageNum: 1,
      data: [],
      columns,
    };
  },
  computed: {
    pagination() {
      return {
        pageSize: global.config.pageSize,
        total: this.total,
        current: this.pageNum,
        showTotal: total => `共 ${total} 条`,
      };
    },
  },
  watch: {
    optionsFetched(flag) {
      if (flag) {
        this.searchDataInit();
      }
    },
  },
  mounted() {
    this.searchDataInit();
    this.fetchData();
  },
  methods: {
    searchDataInit() { // 初始化搜索条件
      this.updateSearchData();
    },
    updateSearchData() {
      this.searchData = [
        {
          type: 'input',
          label: '订单编号',
          attr: 'orderNo',
          value: '',
        }, {
          type: 'select',
          label: '订单类型',
          attr: 'orderType',
          option: [{ value: '', label: '请选择' }].concat(this.$selectOptions.orderType),
          value: '',
        }, {
          type: 'input',
          label: '用户手机号',
          attr: 'mobileNo',
          value: '',
        },
        {
          type: 'input',
          attr: 'providerName',
          label: '服务商',
          value: '',
        },
        {
          type: 'select',
          label: '支付方式',
          attr: 'paymentChannel',
          option: [{ value: '', label: '请选择' }].concat(this.$selectOptions.payWay),
          value: '',
        }, {
          type: 'select',
          label: '支付状态',
          attr: 'status',
          option: [{ value: '', label: '请选择' }].concat(this.$selectOptions.orderStatus),
          value: '',
        }, {
          type: 'rangePicker',
          attr: 'payTime',
          label: '支付时间',
          value: [],
        }, {
          type: 'rangePicker',
          attr: 'createTime',
          label: '创建时间',
          value: [],
        },
      ];
    },
    search(filter) {
      this.condition = {
        orderNo: filter.orderNo,
        orderType: filter.orderType,
        mobileNo: filter.mobileNo,
        providerName: filter.providerName,
        paymentChannel: filter.paymentChannel,
        status: filter.status,
        payTimeBegin: this.$utils.dateRangeFormat(filter.payTime, 'begin'),
        payTimeEnd: this.$utils.dateRangeFormat(filter.payTime, 'end'),
        createTimeBegin: this.$utils.dateRangeFormat(filter.createTime, 'begin'),
        createTimeEnd: this.$utils.dateRangeFormat(filter.createTime, 'end'),
      };
      this.pageNum = 1;
      this.fetchData();
    },
    fetchData() {
      const params = {
        ...this.condition,
        pageNum: this.pageNum,
        pageSize: global.config.pageSize,
      };
      this.$api.orders.orderList(params).then((res) => {
        if (res.code === 200) {
          this.data = res.result.list;
          this.total = Number(res.result.total);
        }
      });
    },
    handleTableChange(pagination) {
      this.pageNum = pagination.current;
      this.fetchData();
    },
    handleDetail(orderNo) {
      this.$router.push(`/orderManage/orderDetail/${orderNo}`);
    },
  },
};
</script>
