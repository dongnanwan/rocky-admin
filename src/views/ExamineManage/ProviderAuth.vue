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
          @click="handleDistribute"
          :disabled="selectedRowKeys.length === 0">
          <span class="f12 ilb fix_position" >转派</span>
        </a-button>
        <a-button
          class="mb10 ml10 custom-size"
          type="primary"
          :disabled="!($store.state.enable) || data.length===0"
          @click="putExcel">
          <span class="f12 ilb fix_position" >excel导出</span>
        </a-button>
      </div>
      <a-table
        :dataSource="data"
        :rowSelection="rowSelection"
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
          <span class="mr10" @click="handleDetail(data.providerId)"><a>查看</a></span>
        </span>
      </a-table>
    </div>
    <a-modal
      width="40vw"
      title="审核转派"
      :visible="formVisible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-row
        type="flex"
        justify="center"
        class="line-wrap"
        v-for="(item, i) in selectedRows"
        :key="i">
        <a-col :span="11">
          <span>服务商ID：</span>{{item.providerId}}</a-col>
        <a-col :span="11">
          <span>注册手机号：</span>{{item.mobile}}</a-col>
      </a-row>
      <a-form :form="form" >
        <a-form-item label="转派给" :label-col="{ span: 3 }" :wrapper-col="{ span: 8 }">
          <a-select
            :options="auditorList"
            v-decorator="[
              'auditorId',
              { rules: [{ required: true, message: '请选择' }] },
            ]"
            placeholder="请选择"
          >
          </a-select>
        </a-form-item>
        <a-form-item label="备注" :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }">
          <a-textarea
            v-decorator="['remark', { rules: [{ required: true, message: '请输入' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import searchCom from '../../components/Search.vue';

const columns = [
  {
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
    title: '审核员',
    dataIndex: 'auditor',
    align: 'center',
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
      searchData: [],
      condition: {},
      data: [],
      columns,
      total: 0,
      pageNum: 0,
      formVisible: false,
      selectedRowKeys: [],
      selectedRows: [],
      form: this.$form.createForm(this),
      auditorList: [],
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
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          /* eslint-disable */
          this.selectedRows = selectedRows;
          this.selectedRowKeys = selectedRowKeys;
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
          },
        }),
      };
    },
  },
  mounted() {
    this.updateSearchData();
    this.fetchData();
    this.getAuditor();
  },
  watch: {
    optionsFetched(flag) {
      if (flag) {
        this.searchDataInit();
      }
    },
  },
  methods: {
    searchDataInit() { // 初始化搜索条件
      this.updateSearchData();
    },
    updateSearchData() {
      this.searchData = [
        {
          type: 'input',
          label: '服务商Id',
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
        ...this.condition,
        pageNum: this.pageNum,
        pageSize: global.config.pageSize,
      };
      this.$api.myExamine.authExamineList(params).then((res) => {
        if (res.code === 200) {
          const { list } = res.result;
          list.forEach((item, index) => {
            item.index = (this.pageNum - 1) * global.config.pageSize + index
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
    handleDetail(providerId) {
      this.$router.push(`/MyExamine/AuthExamineDetail/${providerId}`);
    },
    getAuditor() {
      this.auditorList = [{ value: '', label: '请选择' }];
      this.$api.app.auditor(2312).then((res) => {
        if (res.code === 200) {
          res.result.forEach((item) => {
            this.auditorList.push({
              label: item.name,
              value: item.accountId,
            });
          });
        }
      });
    },
    handleDistribute() {
      this.formVisible = true;
      this.form.resetFields();
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          const auditor = this.auditorList.filter((item) => {
            return item.value === values.auditorId;
          })[0].label;
          const params = {
            ...values,
            auditor,
            providerId: this.selectedRowKeys.join(','),
          };
          this.$api.examineManage.providerAuthDistribute(params).then((res) => {
            if (res.code === 200) {
              this.formVisible = false;
              this.fetchData();
              this.$message.success('操作成功！');
            }
          });
        }
      });
    },
    handleCancel() {
      this.formVisible = false;
      this.form.resetFields();
    },
    putExcel() {
      if (this.$store.state.enable) {
        this.$store.commit('setEnable', false);
        this.$excel(global.config.requestUrl + this.$api.examineManage.providerAuthExcel,
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
<style lang="scss">
  .line-wrap{
    line-height: 50px;
  }
</style>
