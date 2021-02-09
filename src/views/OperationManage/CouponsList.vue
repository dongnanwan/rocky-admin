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
          :disabled="!($store.state.enable) || data.length===0"
          @click="putExcel">
          <span class="f12 ilb fix_position" >excel导出</span>
        </a-button>
      </div>
      <a-table
        rowKey="id"
        :dataSource="data"
        :columns="columns"
        :pagination="pagination" @change="handleTableChange">
        <span slot="bonusType" slot-scope="data">{{$getters.bonusType(data)}}</span>
        <span slot="validTime" slot-scope="data">{{data.validStartTime?data.validStartTime +'~'+ data.validEndTime:''}}</span>
        <span slot="status" slot-scope="data">{{$getters.couponStatus(data)}}</span>
      </a-table>
    </div>
  </div>
</template>
<script>
import searchCom from '../../components/Search.vue';

const columns = [{
  title: '用户ID',
  dataIndex: 'userId',
  align: 'center',
}, {
  title: '活动名称',
  dataIndex: 'activityName',
  align: 'center',
}, {
  title: '指定服务商',
  dataIndex: 'targetProviderName',
  align: 'center',
}, {
  title: '指定产品',
  dataIndex: 'targetApplicationName',
  align: 'center',
}, {
  title: '活动奖励',
  dataIndex: 'bonusType',
  scopedSlots: { customRender: 'bonusType' },
  align: 'center',
}, {
  title: '领取时间',
  dataIndex: 'receiveTime',
  align: 'center',
}, {
  title: '有效期',
  key: 'validTime',
  scopedSlots: { customRender: 'validTime' },
  align: 'center',
}, {
  title: '状态',
  dataIndex: 'status',
  scopedSlots: { customRender: 'status' },
  align: 'center',
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
          label: '用户ID',
          attr: 'userId',
          value: '',
        }, {
          type: 'input',
          label: '活动名称',
          attr: 'activityName',
          value: '',
        }, {
          type: 'select',
          label: '状态',
          attr: 'status',
          option: [{ value: '', label: '请选择' }].concat(this.$selectOptions.couponStatus),
          value: '',
        }, {
          type: 'rangePicker',
          attr: 'receive',
          label: '领取时间',
          value: [],
        }, {
          type: 'rangePicker',
          attr: 'valid',
          label: '有效期',
          value: [],
        },
      ];
    },
    search(filter) {
      this.condition = {
        userId: filter.userId,
        activityName: filter.activityName,
        status: filter.status,
        receiveBeginTime: this.$utils.dateRangeFormat(filter.receive, 'begin'),
        receiveEndTime: this.$utils.dateRangeFormat(filter.receive, 'end'),
        validBeginTime: this.$utils.dateRangeFormat(filter.valid, 'begin'),
        validEndTime: this.$utils.dateRangeFormat(filter.valid, 'end'),
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
      this.$api.operation.couponList(params).then((res) => {
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
    putExcel() {
      if (this.$store.state.enable) {
        this.$store.commit('setEnable', false);
        this.$excel(global.config.requestUrl + this.$api.operation.couponExcel, this.condition, () => {
          setTimeout(() => {
            this.$store.commit('setEnable', true);
          }, 1000);
        });
      }
    },
  },
};
</script>
