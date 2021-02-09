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
      </a-table>
    </div>
  </div>
</template>
<script>
import searchCom from '../../components/Search.vue';

const columns = [{
  title: '申请ID',
  dataIndex: 'id',
  width: 100,
}, {
  title: '企业名称',
  dataIndex: 'enterpriseName',
}, {
  title: '联系人名称',
  dataIndex: 'contactName',
}, {
  title: '联系电话',
  dataIndex: 'contactTelephone',
}, {
  title: '需求说明',
  dataIndex: 'instruction',
  // align: 'center',
  // width: 300,
}, {
  title: '提交时间',
  dataIndex: 'createdTime',
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
          label: '申请ID',
          attr: 'id',
          value: '',
        }, {
          type: 'rangePicker',
          attr: 'Time',
          label: '提交时间',
          value: [],
        },
      ];
    },
    search(filter) {
      this.condition = {
        id: filter.id,
        applyStartTime: this.$utils.dateRangeFormat(filter.Time, 'begin'),
        applyEndTime: this.$utils.dateRangeFormat(filter.Time, 'end'),
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
      this.$api.customerManage.applicationList(params).then((res) => {
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
        this.$excel(global.config.requestUrl + this.$api.customerManage.applicationExcel, this.condition, () => {
          setTimeout(() => {
            this.$store.commit('setEnable', true);
          }, 1000);
        });
      }
    },
  },
};
</script>
