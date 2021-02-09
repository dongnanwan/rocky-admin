<template>
  <div class="common_page_wapper">
    <div class="page_search">
      <search-com :searchData="searchData" @search="search"></search-com>
    </div>
    <div class="page_table p15">
      <div class="export_excel clearfix">
        <a-button
          class="mb10 ml10 custom-size"
          type="primary"
          :disabled="!($store.state.enable)"
          @click="putExcel">
          <span class="f12 ilb fix_position" >excel导出</span>
        </a-button>
      </div>
      <a-table
        :dataSource="data"
        :columns="columns"
        rowKey="serialNo"
        :pagination="pagination"
        @change="handleTableChange">
        <span slot="serialNo" slot-scope="data">
          <div class="word-break">
            {{data}}
          </div>
        </span>
        <span slot="accountId" slot-scope="data">
          <div class="word-break">
            {{data}}
          </div>
        </span>
        <span slot="orderNo" slot-scope="data">
          <div class="word-break">
            {{data}}
          </div>
        </span>
        <span slot="orderType" slot-scope="data">
          {{$getters.orderType(data)}}
        </span>
        <span slot="profitRatio" slot-scope="data">
          {{data}} %
        </span>
        <span slot="appDetail" slot-scope="data">
          {{data.applicationName}}<br/>
          {{data.packageVersion}}<br/>
          {{Number(data.packageTime) !==-1?data.packageTime+$getters.timeUnit(Number(data.packageTimeUnit))+'/限用':'无上限/'}}
          {{Number(data.packageInvokeMax) !== -1?data.packageInvokeMax + '次/':'无上限/'}}
          {{Number(data.packageUserMax) !==-1?data.packageUserMax + '人':'无上限'}}
        </span>
        <span slot="status" slot-scope="data">
          {{$getters.flowStatus(data)}}
        </span>
         <span slot="paymentChannel" slot-scope="data">
          {{$getters.payWay(data)}}
        </span>
        <template slot="footer">
          <div class="flex flex-justify-between">
            <div>总计</div>
            <div class="flex flex-justify-end">
              <span style="width: 110px">{{totalInfo.payableAmount}}</span>
              <span style="width: 90px">{{totalInfo.offAmount}}</span>
              <span style="width: 30px">{{totalInfo.paymentAmount}}</span>
              <span style="width: 100px"></span>
              <span style="width: 100px"></span>
              <span style="width: 100px"></span>
            </div>
          </div>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import searchCom from '../../components/Search.vue';

const columns = [
  {
    title: '流水编号',
    dataIndex: 'serialNo',
    align: 'center',
    scopedSlots: { customRender: 'serialNo' },
  }, {
    title: '订单编号',
    dataIndex: 'orderNo',
    align: 'center',
    scopedSlots: { customRender: 'orderNo' },
  }, {
    title: '订单类型',
    dataIndex: 'orderType',
    align: 'center',
    scopedSlots: { customRender: 'orderType' },
  }, {
    title: '用户ID',
    dataIndex: 'accountId',
    align: 'center',
    scopedSlots: { customRender: 'accountId' },
  }, {
    title: '服务商',
    dataIndex: 'providerName',
    align: 'center',
    width: 100,
  }, {
    title: '产品详情',
    key: 'appDetail',
    align: 'center',
    scopedSlots: { customRender: 'appDetail' },
    // width: 200,
  }, {
    title: '支付渠道',
    dataIndex: 'paymentChannel',
    align: 'center',
    scopedSlots: { customRender: 'paymentChannel' },
    // width: 100,
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
    title: '流水状态',
    dataIndex: 'status',
    align: 'center',
    scopedSlots: { customRender: 'status' },
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
    title: '分润比例',
    dataIndex: 'profitRatio',
    align: 'center',
    scopedSlots: { customRender: 'profitRatio' },
  }, {
    title: '服务商收款金额',
    dataIndex: 'providerReceiveAmount',
    align: 'center',
  }, {
    title: '平台收款金额',
    dataIndex: 'platformReceiveAmount',
    align: 'center',
  },
];
export default {
  components: {
    searchCom,
  },
  data() {
    return {
      condition: {},
      searchData: [],
      total: 0,
      pageNum: 1,
      data: [],
      columns,
      totalInfo: {},
    };
  },
  computed: {
    ...mapState(['moduleOptions', 'classifyOptions', 'industryOptions', 'optionsFetched']),
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
    this.fetchData();
    this.searchDataInit();
  },
  methods: {
    industryLabel(id) {
      let result;
      this.industryOptions.forEach((element) => {
        if (element.value === id) {
          result = element.label;
        }
      });
      return result;
    },
    searchDataInit() { // 初始化搜索条件
      this.updateSearchData();
    },
    updateSearchData() {
      this.searchData = [
        {
          type: 'input',
          label: '流水编号',
          attr: 'serialNo',
          value: '',
          width: 190,
        }, {
          type: 'input',
          label: '订单编号',
          attr: 'orderNo',
          value: '',
          width: 190,
        }, {
          type: 'select',
          attr: 'orderType',
          label: '订单类型',
          option: [{ value: '', label: '请选择' }].concat(this.$selectOptions.orderType),
          value: '',
        }, {
          type: 'input',
          label: '用户ID',
          attr: 'accountId',
          value: '',
          width: 190,
        }, {
          type: 'input',
          label: '服务商ID',
          attr: 'providerId',
          value: '',
        }, {
          type: 'select',
          attr: 'paymentChannel',
          label: '支付方式',
          option: [{ value: '', label: '请选择' }].concat(this.$selectOptions.payWay),
          value: '',
        }, {
          type: 'select',
          attr: 'status',
          label: '流水状态',
          option: [{ value: '', label: '请选择' }].concat(this.$selectOptions.flowStatus),
          value: '',
        }, {
          type: 'rangePicker',
          attr: 'createTime',
          label: '创建时间',
          value: [],
        }, {
          type: 'rangePicker',
          attr: 'payTime',
          label: '支付时间',
          value: [],
        }];
    },
    search(filter) {
      this.condition = {
        serialNo: filter.serialNo,
        orderNo: filter.orderNo,
        orderType: filter.orderType,
        accountId: filter.accountId,
        providerId: filter.providerId,
        paymentChannel: filter.paymentChannel,
        status: filter.status,
        createTimeBegin: this.$utils.dateRangeFormat(filter.createTime, 'begin'),
        createTimeEnd: this.$utils.dateRangeFormat(filter.createTime, 'end'),
        payTimeBegin: this.$utils.dateRangeFormat(filter.payTime, 'begin'),
        payTimeEnd: this.$utils.dateRangeFormat(filter.payTime, 'end'),
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
      this.$api.financeManage.accountFlow(params).then((res) => {
        if (res.code === 200) {
          this.data = res.result.list;
          this.total = Number(res.result.total);
          this.$api.financeManage.total(params).then((res) => {
            this.totalInfo = res.result;
          });
        }
      });
    },
    handleTableChange(pagination) {
      this.pageNum = pagination.current;
      this.fetchData();
    },
    putExcel() {
      if (this.$store.state.enable) {
        this.$store.commit('setEnable', false);
        this.$excel(global.config.requestUrl + this.$api.financeManage.flowExcel, this.condition, () => {
          setTimeout(() => {
            this.$store.commit('setEnable', true);
          }, 1000);
        });
      }
    },
  },
};
</script>
