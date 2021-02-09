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
        rowKey="providerId"
        :dataSource="data"
        :columns="columns"
        :pagination="pagination" @change="handleTableChange">
        <span slot="providerType" slot-scope="data">{{$getters.providerType(data)}}</span>
        <span slot="status" slot-scope="data">{{$getters.providerAuthStatus(data)}}</span>
        <span slot="operation" slot-scope="data">
          <span @click="handleDetail(data.providerId)" class="mr10"><a>查看</a></span>
        </span>
      </a-table>
    </div>
  </div>
</template>
<script>
import searchCom from '../../components/Search.vue';

const columns = [{
  title: '服务商Id',
  dataIndex: 'providerId',
  align: 'center',
}, {
  title: '服务商类型',
  dataIndex: 'providerType',
  scopedSlots: { customRender: 'providerType' },
  align: 'center',
}, {
  title: '注册手机号',
  dataIndex: 'mobile',
  align: 'center',
}, {
  title: '邮箱',
  dataIndex: 'email',
  align: 'center',
}, {
  title: '企业名称',
  dataIndex: 'enterpriseName',
  align: 'center',
}, {
  title: '实名认证',
  dataIndex: 'status',
  scopedSlots: { customRender: 'status' },
  align: 'center',
}, {
  title: '注册时间',
  dataIndex: 'createdTime',
  align: 'center',
}, {
  title: '上线应用数量',
  dataIndex: 'number',
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
          label: '服务商ID',
          attr: 'providerId',
          value: '',
        }, {
          type: 'select',
          label: '服务商类型',
          attr: 'providerType',
          option: [{ value: '', label: '请选择' }].concat(this.$selectOptions.providerType),
          value: '',
        }, {
          type: 'input',
          label: '注册手机号',
          attr: 'mobile',
          value: '',
        }, {
          type: 'input',
          attr: 'email',
          label: '邮箱',
          value: '',
        }, {
          type: 'input',
          attr: 'companyName',
          label: '企业名称',
          value: '',
        }, {
          type: 'select',
          label: '实名认证',
          attr: 'auth',
          option: this.$selectOptions.providerAuthStatus,
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
        providerId: filter.providerId,
        providerType: filter.providerType,
        mobile: filter.mobile,
        email: filter.email,
        companyName: filter.companyName,
        auth: filter.auth,
        beginTime: this.$utils.dateRangeFormat(filter.Time, 'begin'),
        endTime: this.$utils.dateRangeFormat(filter.Time, 'end'),
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
      this.$api.user.serverUserList(params).then((res) => {
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
    handleDetail(id) {
      this.$router.push(`/UserManage/ServerUserDetail/${id}`);
    },
    putExcel() {
      if (this.$store.state.enable) {
        this.$store.commit('setEnable', false);
        this.$excel(global.config.requestUrl + this.$api.user.serverUserExcel,
          this.condition, () => {
            setTimeout(() => {
              this.$store.commit('setEnable', true);
            }, 1000);
          });
      }
    },
  },
};
</script>
