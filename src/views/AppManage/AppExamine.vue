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
      </div>
      <a-table
        :dataSource="data"
        :rowSelection="rowSelection"
        :columns="columns"
        rowKey="applicationId"
        :pagination="pagination"
        @change="handleTableChange" >
        <span slot="logoPath" slot-scope="data">
          <img :src="data" alt="" width="60" height="60">
        </span>
        <span slot="status" slot-scope="data">
          {{$getters.status(data)}}
        </span>
        <span slot="operation" slot-scope="data">
          <span class="mr10" @click="toDetail(data.applicationId)"><a>查看</a></span>
        </span>
      </a-table>
    </div>
    <a-modal
      width="50vw"
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
          <span>应用ID：</span>{{item.applicationId}}</a-col>
        <a-col :span="11">
          <span>应用名称：</span>{{item.applicationName}}</a-col>
      </a-row>
      <a-form :form="form" >
        <a-form-item label="转派给" :label-col="{ span: 3 }" :wrapper-col="{ span: 8 }">
          <a-select
            v-decorator="[
              'auditorId',
              { rules: [{ required: true, message: '请选择' }] },
            ]"
            :options="auditorOptions"
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
    title: '应用id',
    dataIndex: 'applicationId',
    align: 'center',
  }, {
    title: '服务商名称',
    dataIndex: 'providerName',
    align: 'center',
  }, {
    title: 'LOGO',
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
    title: '审核员',
    dataIndex: 'auditor',
    align: 'center',
    scopedSlots: { customRender: 'auditor' },
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
      pageNum: 1,
      formVisible: false,
      selectedRowKeys: [],
      selectedRows: [],
      form: this.$form.createForm(this),
    };
  },
  computed: {
    ...mapState(['moduleOptions', 'classifyOptions', 'industryOptions', 'optionsFetched', 'auditorOptions']),
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
          label: '应用Id',
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
        },
        {
          type: 'select',
          attr: 'productTypeLabelId',
          label: '产品类型',
          option: [{ label: '请选择', value: '' }].concat(this.moduleOptions),
          value: '',
          onChange: (item) => {
            this.$store.dispatch('fetchClassifyOptions', item.value);
            this.searchData.forEach((item) => {
              if (item.attr === 'applicationTypeLabelId') {
                item.value = '';
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
          type: 'select',
          attr: 'auditor',
          label: '审核员',
          option: this.auditorOptions,
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
          option: this.$selectOptions.appAuditStatus1.slice(0,5),
          value: ''
        },
      ];
    },
    search(filter) {
      this.condition = {
        applicationId: filter.applicationId,
        applicationName: filter.applicationName,
        providerName: filter.providerName,
        productTypeLabelId: filter.productTypeLabelId,
        applicationTypeLabelId: filter.applicationTypeLabelId,
        auditor: this.auditorOptions.filter((item) => { return item.value === filter.auditor})[0]?this.auditorOptions.filter((item) => { return item.value === filter.auditor})[0].label: '',
        updateBeginTime: this.$utils.dateRangeFormat(filter.Time, 'begin'),
        updateEndTime: this.$utils.dateRangeFormat(filter.Time, 'end'),
        status: filter.status,
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
      this.$api.app.auditList(params).then((res) => {
        if (res.code === 200) {
          const { list } = res.result;
          list.forEach((item, index) => {
            item.index = (this.pageNum-1) * this.pagination.pageSize + index + 1;
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
    toDetail(applicationId) {
      this.$router.push(`/AppManage/AppExamineDetail/${applicationId}`);
    },
    // getAuditor(callback) {
    //   this.auditorOptions = [{value: '', label: '请选择'}];
    //   this.$api.app.auditor(2312).then((res) => {
    //     if (res.code === 200) {
    //       res.result.forEach((item, index) => {
    //         this.auditorOptions.push({
    //           label: item.name,
    //           value: item.accountId
    //         })
    //         callback();
    //       })
    //     }
    //   })
    // },
    handleDistribute() {
      this.formVisible = true;
      this.form.resetFields();
    },
    handleOk(){
      this.form.validateFields((err, values) => {
        if(!err){
          const auditor = this.auditorOptions.filter((item) => { return item.value === values.auditorId})[0].label;
          const params = {
            ...values,
            auditor,
            applicationId: this.selectedRowKeys.join(','),
          }
          this.$api.app.distribute(params).then((res) => {
            if(res.code === 200){
              this.formVisible = false;
              this.fetchData();
              this.$message.success('操作成功！');
            }
          })
        }
      })
    },
    handleCancel() {
      this.formVisible = false;
    }
  }
};
</script>
<style lang="scss">
  .line-wrap{
    line-height: 50px;
  }
</style>
