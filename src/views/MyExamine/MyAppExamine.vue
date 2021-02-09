<template>
  <div class="common_page_wapper">
    <div class="page_search">
      <search-com :searchData="searchData" @search="search"></search-com>
    </div>
    <div class="page_table p15">
      <a-table
        :dataSource="data"
        :columns="columns"
        rowKey="index"
        :pagination="pagination"
        @change="handleTableChange">
        <span slot="logoPath" slot-scope="data">
          <img :src="data" alt="" width="60" height="60">
        </span>
        <span slot="status" slot-scope="data">
          {{$getters.status(data)}}
        </span>
        <span slot="operation" slot-scope="data">
          <a @click="toExamine(data.applicationId)" v-if="data.status === 6">审核</a>
          <a @click="handlePublish(data.applicationId)" v-else-if="data.status === 8">发布</a>
          <a @click="toDetail(data.applicationId)" v-else>查看</a>
        </span>
      </a-table>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { mapState } from 'vuex';
import searchCom from '../../components/Search.vue';

const { Base64 } = require('js-base64');

const columns = [{
  title: '应用ID',
  dataIndex: 'applicationId',
  align: 'center',
}, {
  title: '服务商名称',
  dataIndex: 'providerName',
  align: 'center',
}, {
  title: 'logo',
  dataIndex: 'logoPath',
  align: 'center',
  scopedSlots: { customRender: 'logoPath' },
}, {
  title: '应用名称',
  dataIndex: 'applicationName',
  align: 'center',
}, {
  title: '产品类型',
  dataIndex: 'productTypeLabelName',
  align: 'center',
}, {
  title: '应用类型',
  dataIndex: 'applicationTypeLabelName',
  align: 'center',
}, {
  title: '最后提交时间',
  dataIndex: 'updateTime',
  align: 'center',
}, {
  title: '应用状态',
  dataIndex: 'status',
  align: 'center',
  scopedSlots: { customRender: 'status' },
}, {
  title: '操作',
  key: 'operation',
  align: 'center',
  scopedSlots: { customRender: 'operation' },
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
        label: '应用ID',
        attr: 'applicationId',
        value: '',
      }, {
        type: 'input',
        label: '应用名称',
        attr: 'applicationName',
        value: '',
      }, {
        type: 'input',
        label: '服务商名称',
        attr: 'providerName',
        value: '',
      }, {
        type: 'select',
        label: '产品类型',
        attr: 'productTypeLabelId',
        option: [{ value: '', label: '请选择' }].concat(this.moduleOptions),
        value: '',
        onChange: (item) => {
          this.$store.dispatch('fetchClassifyOptions', item.value);
          /* eslint-disable */
          this.searchData.forEach((item) => {
            if (item.attr === 'applicationTypeLabelId') {
              /* eslint-disable */
              item.option = [{ value: '', label: '请选择' }].concat(this.classifyOptions);
            }
          });
        },
      }, {
        type: 'select',
        label: '应用类型',
        attr: 'applicationTypeLabelId',
        option: [],
        value: '',
      }, {
        type: 'rangePicker',
        attr: 'Time',
        label: '最后提交时间',
        value: [],
      }, {
        type: 'select',
        label: '应用状态',
        attr: 'status',
        value: '',
        option: this.$selectOptions.appAuditStatus1,
      }];
    },
    search(filter) {
      this.condition = {
        applicationId: filter.applicationId,
        applicationName: filter.applicationName,
        providerName: filter.providerName,
        productTypeLabelId: filter.productTypeLabelId,
        applicationTypeLabelId: filter.applicationTypeLabelId,
        updateBeginTime: this.$utils.dateRangeFormat(filter.Time, 'begin'),
        updateEndTime: this.$utils.dateRangeFormat(filter.Time, 'end'),
        status: filter.status ? Number(filter.status) : '',
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
      this.$api.myExamine.appAudiyList(params).then((res) => {
        if (res.code === 200) {
          const { list } = res.result;
          list.forEach((item, index) => {
            /* eslint-disable */
            item.index = index + (this.pageNum -1) * this.pagination.pageSize; 
          })
          this.data = list;
          this.total = Number(res.result.total);
        }
      });
    },
    handleTableChange(pagination) {
      this.pageNum = pagination.current;
      this.fetchData();
    },
    toDetail(applicationId) { // 跳转详情页
      this.$router.push(`/AppManage/AppExamineDetail/${applicationId}`);
    },
    toExamine(applicationId) {
      this.$router.push(`/AppManage/AppExamineDetail/${applicationId}?examine=true`);
    },
    handlePublish(applicationId) { // 发布
      const params = {
        applicationId,
      };
      const header = `Basic ${Base64.encode(`${global.config.clientId}:${global.config.clientSecret}`)}`;
      this.loginAxios(header, applicationId, (res) => {
        const { data } = res;
        if (data.code === 200) {
          const accessToken = data.result.access_token;
          const tokenType = 'Bearer';
          const token = `${tokenType} ${accessToken}`;
          this.$router.push(`/PreRelease/${applicationId}?token=${token}`);
        } else {
          const { data } = res;
          this.$message.error(data.message);
        }
      })
    },
    loginAxios(header, applicationId, callback) {
      const token = this.$store.state.token;
      this.$store.commit('setToken', header);
      const params = {
        applicationId,
        accessToken: token.split(' ')[1],
      };
      axios({
        method: 'post',
        url: `${global.config.requestUrl}/muc/account/application/login-auth`, // 路径
        data: params,
      }).then((res) => {
        this.$store.commit('setToken', token);
        callback(res);
      }).catch(() => {
        this.$message.error('接口错误');
      });
    },
  },
};
</script>
