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
        rowKey="accountId"
        :dataSource="data"
        :columns="columns"
        :pagination="pagination" @change="handleTableChange">
        <span slot="type" slot-scope="data">{{$getters.userType(data)}}</span>
        <span slot="isPaidUser" slot-scope="data">{{$getters.whetherFlag(data)}}</span>
        <span slot="authStatus" slot-scope="data">{{$getters.authStatus(data)}}</span>
        <span slot="operation" slot-scope="data">
          <span @click="handleDetail(data.accountId)" class="mr10"><a>查看详情</a></span>
        </span>
      </a-table>
    </div>
  </div>
</template>
<script>
import searchCom from '../../components/Search.vue';

const columns = [{
  title: '用户ID',
  dataIndex: 'accountId',
  align: 'center',
}, {
  title: '用户类型',
  dataIndex: 'type',
  scopedSlots: { customRender: 'type' },
  align: 'center',
}, {
  title: '注册手机号',
  dataIndex: 'mobileNo',
  align: 'center',
}, {
  title: '绑定邮箱',
  dataIndex: 'email',
  align: 'center',
}, {
  title: '注册时间',
  dataIndex: 'regTime',
  align: 'center',
}, {
  title: '信息认证',
  dataIndex: 'status',
  scopedSlots: { customRender: 'authStatus' },
  align: 'center',
}, {
  title: '付费用户',
  dataIndex: 'isPaidUser',
  scopedSlots: { customRender: 'isPaidUser' },
  align: 'center',
}, {
  title: '操作',
  key: 'operation',
  scopedSlots: { customRender: 'operation' },
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
          attr: 'accountId',
          value: '',
        }, {
          type: 'select',
          label: '用户类型',
          attr: 'type',
          option: [{ value: '', label: '请选择' }].concat(this.$selectOptions.userType),
          value: '',
        }, {
          type: 'input',
          label: '注册手机号',
          attr: 'mobileNo',
          value: '',
        }, {
          type: 'input',
          attr: 'email',
          label: '绑定邮箱',
          value: '',
        }, {
          type: 'select',
          label: '付费用户',
          attr: 'isPaidUser',
          option: [{ value: '', label: '请选择' }].concat(this.$selectOptions.whetherFlag),
          value: '',
        }, {
          type: 'select',
          label: '信息认证',
          attr: 'status',
          option: [{ value: '', label: '请选择' }].concat(this.$selectOptions.authStatus),
          value: '',
        }, {
          type: 'rangePicker',
          attr: 'Time',
          label: '注册时间',
          value: [],
        },
      ];
    },
    search(filter) {
      this.condition = {
        accountId: filter.accountId,
        type: filter.type,
        mobileNo: filter.mobileNo,
        email: filter.email,
        isPaidUser: filter.isPaidUser,
        status: filter.status,
        regTimeBegin: this.$utils.dateRangeFormat(filter.Time, 'begin'),
        regTimeEnd: this.$utils.dateRangeFormat(filter.Time, 'end'),
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
      this.$api.user.costomUserList(params).then((res) => {
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
    handleDetail(accountId) {
      this.$router.push(`/UserManage/CustomUserDetail/${accountId}`);
    },
    putExcel() {
      if (this.$store.state.enable) {
        this.$store.commit('setEnable', false);
        this.$excel(global.config.requestUrl + this.$api.user.customerUserExcel, this.condition, () => {
          setTimeout(() => {
            this.$store.commit('setEnable', true);
          }, 1000);
        });
      }
    },
  },
};
</script>
