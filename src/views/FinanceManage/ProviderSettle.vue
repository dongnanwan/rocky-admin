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
        rowKey="providerId"
        :pagination="pagination"
        @change="handleTableChange">
        <span slot="profitRatio" slot-scope="data">
          {{data*100}}%
        </span>
        <span slot="operation" slot-scope="data">
          <a @click="detailExcel(data)" v-if="$store.state.enable">明细导出</a>
          <span v-else>明细导出</span>
        </span>
        <template slot="footer">
          <div class="flex flex-justify-between">
            <div style="width: 150px;text-align:center">总计
            </div>
            <div class="flex flex-justify-end">
              <span style="width: 120px;text-align:center">{{totalInfo.totalCount}}</span>
              <span style="width: 120px;text-align:center">{{totalInfo.payOrderTotal}}</span>
              <span style="width: 120px;text-align:center">{{totalInfo.trailOrderTotal}}</span>
              <span style="width: 120px;text-align:center">{{totalInfo.receiveTotal}}</span>
              <span style="width: 100px;text-align:center"></span>
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

const columns = [{
  title: '日期',
  dataIndex: 'reportDate',
  align: 'center',
  width: 150,
}, {
  title: '服务商ID',
  dataIndex: 'providerId',
  align: 'center',
}, {
  title: '服务商名称',
  dataIndex: 'providerName',
  align: 'center',
}, {
  title: '应用名称',
  dataIndex: 'applicationName',
  align: 'center',
}, {
  title: '分润比例',
  dataIndex: 'profitRatio',
  align: 'center',
  scopedSlots: { customRender: 'profitRatio' },
}, {
  title: '交易总单量',
  dataIndex: 'totalCount',
  align: 'center',
  width: 120,
}, {
  title: '付费订单总金额',
  dataIndex: 'payOrderAmount',
  align: 'center',
  width: 120,
}, {
  title: '试用订单金额',
  dataIndex: 'trailOrderAmount',
  align: 'center',
  width: 120,
}, {
  title: '服务商收款金额',
  dataIndex: 'providerReceiveAmount',
  align: 'center',
  width: 120,
}, {
  title: '操作',
  key: 'operation',
  align: 'center',
  scopedSlots: { customRender: 'operation' },
  width: 120,
}];
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
      this.searchData = [{
        type: 'input',
        label: '服务商ID',
        attr: 'providerId',
        value: '',
      }, {
        type: 'input',
        label: '服务商名称',
        attr: 'providerName',
        value: '',
      }, {
        type: 'input',
        label: '应用名称',
        attr: 'applicationName',
        value: '',
      }, {
        type: 'rangePicker',
        attr: 'date',
        label: '日期',
        value: [],
      }];
    },
    search(filter) {
      this.condition = {
        providerId: filter.providerId,
        providerName: filter.providerName,
        applicationName: filter.applicationName,
        dateBegin: this.$utils.dateRangeFormat(filter.date, 'begin'),
        dateEnd: this.$utils.dateRangeFormat(filter.date, 'end'),
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
      this.$api.financeManage.providerSettle(params).then((res) => {
        if (res.code === 200) {
          this.data = res.result.list;
          this.total = Number(res.result.total);
          this.$api.financeManage.providerSettleTotal(params).then((res1) => {
            this.totalInfo = res1.result;
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
        this.$excel(global.config.requestUrl
          + this.$api.financeManage.providerSettleExcel, this.condition, () => {
          setTimeout(() => {
            this.$store.commit('setEnable', true);
          }, 1000);
        });
      }
    },
    detailExcel(data) {
      const params = {
        applicationId: data.applicationId,
        providerId: data.providerId,
        reportDate: data.reportDate,
      };
      if (this.$store.state.enable) {
        this.$store.commit('setEnable', false);
        this.$excel(global.config.requestUrl
          + this.$api.financeManage.providerSettleDeatilExcel, params, () => {
          setTimeout(() => {
            this.$store.commit('setEnable', true);
          }, 1000);
        });
      }
    },
  },
};
</script>
