<template>
  <div class="common_page_wapper">
    <div class="page_search">
      <search-com :searchData="searchData" @search="search"></search-com>
    </div>
    <div class="page_table p15">
      <a-table
        :dataSource="data"
        :columns="columns"
        rowKey="providerId"
        :pagination="pagination"
        @change="handleTableChange">
        <span slot="providerType" slot-scope="data">
          {{$getters.providerType(data)}}
        </span>
        <span slot="auditStatus" slot-scope="data">
          {{$getters.providerAuthStatus(data)}}
        </span>
        <span slot="operation" slot-scope="data">
          <a @click="handleAuth(data.providerId)" v-if="data.auditStatus === 1">认证审核</a>
          <a @click="handleDetail(data.providerId)" v-else>查看</a>
        </span>
      </a-table>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import searchCom from '../../components/Search.vue';

const columns = [{
  title: '服务商ID',
  dataIndex: 'providerId',
  align: 'center',
  scopedSlots: { customRender: 'providerId' },
}, {
  title: '服务商类型',
  dataIndex: 'providerType',
  align: 'center',
  scopedSlots: { customRender: 'providerType' },
}, {
  title: '注册手机号',
  dataIndex: 'mobile',
  align: 'center',
}, {
  title: '提交时间',
  dataIndex: 'registerTime',
  align: 'center',
}, {
  title: '实名认证',
  dataIndex: 'auditStatus',
  align: 'center',
  scopedSlots: { customRender: 'auditStatus' },
}, {
  title: '最后审核时间',
  dataIndex: 'auditTime',
  align: 'center',
}, {
  title: '操作',
  key: 'operation',
  align: 'center',
  scopedSlots: { customRender: 'operation' },
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
        type: 'select',
        label: '服务商类型',
        attr: 'providerType',
        option: this.$selectOptions.providerType,
        value: '',
      }, {
        type: 'input',
        label: '注册手机号',
        attr: 'mobile',
        value: '',
      }, {
        type: 'select',
        label: '实名认证',
        attr: 'auditStatus',
        option: this.$selectOptions.providerAuthStatus.slice(1),
        value: '',
      }];
    },
    search(filter) {
      this.condition = {
        providerId: filter.providerId,
        providerType: filter.providerType,
        mobile: filter.mobile,
        auditStatus: filter.auditStatus,
      };
      this.pageNum = 1;
      this.fetchData();
    },
    fetchData() {
      const params = {
        flax: 1,
        ...this.condition,
        pageNum: this.pageNum,
        pageSize: global.config.pageSize,
      };
      this.$api.myExamine.authExamineList(params).then((res) => {
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
    handleAuth(providerId) {
      this.$router.push(`/MyExamine/AuthExamineDetail/${providerId}?examine=true`);
    },
    handleDetail(providerId) {
      this.$router.push(`/MyExamine/AuthExamineDetail/${providerId}`);
    },
  },
};
</script>
