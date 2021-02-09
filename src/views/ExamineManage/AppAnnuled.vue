<template>
  <div class="common_page_wapper">
    <div class="page_search">
      <search-com :searchData="searchData" @search="search"></search-com>
    </div>
    <div class="page_table">
      <div class="export_excel clearfix">
        <a-button
          class="mb10 ml10 custom-size"
          type="primary"
          :disabled="!($store.state.enable)"
          @click="putExcel">
          <span class="f12 ilb fix_position">excel导出</span>
        </a-button>
      </div>
      <a-table
        :dataSource="data"
        :columns="columns"
        rowKey="id"
        :pagination="pagination"
        @change="handleTableChange" >
        <span slot="appType" slot-scope="data">
          {{data.productTypeLabelName+'>'+data.applicationTypeLabelName}}
        </span>
        <span slot="status" slot-scope="data">
          {{$getters.status(data)}}
        </span>
        <span slot="auditStatus" slot-scope="data">
          {{$getters.appAnunledStatus(data)}}
        </span>
        <span slot="operation" slot-scope="data">
          <span
            @click="handleClick(data)"
            class="mr5"
            v-if="data.auditStatus === 6"><a>审核</a></span>
          <span @click="handleDetail(data)" class="mr5" v-else><a>查看</a></span>
        </span>
      </a-table>
    </div>
    <a-modal
      width="40vw"
      title="审核"
      :visible="formVisible"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-row type="flex" justify="center" class="line-wrap">
        <a-col :span="11">
          <span>应用ID：</span>{{application.applicationId}}</a-col>
        <a-col :span="11">
          <span>应用名称：</span>{{application.applicationName}}</a-col>
      </a-row>
      <a-row type="flex" justify="center" class="line-wrap">
        <a-col :span="11">
          <span>服务商名称：</span>{{application.providerName}}</a-col>
        <a-col :span="11">
          <span>应用类别：</span>
            {{application.productTypeLabelName+'>'+application.applicationTypeLabelName}}</a-col>
      </a-row>
      <a-row type="flex" justify="center" class="line-wrap">
        <a-col :span="22">
          <span>备注：</span>{{application.remark || '-'}}</a-col>
      </a-row>
      <a-form :form="form" >
        <a-form-item label="审核结果" :label-col="{ span: 3 }" :wrapper-col="{ span: 8 }">
          <a-select
            :options="$selectOptions.appAuditStatus5"
            v-decorator="[
              'auditStatus',
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
    <a-modal
      width="40vw"
      title="查看"
      :footer="null"
      :visible="detailVisible"
      @cancel="detailVisible = false"
    >
      <a-row type="flex" justify="center" class="line-wrap">
        <a-col :span="11">
          <span>应用ID：</span>{{application.applicationId}}</a-col>
        <a-col :span="11">
          <span>应用名称：</span>{{application.applicationName}}</a-col>
      </a-row>
      <a-row type="flex" justify="center" class="line-wrap">
        <a-col :span="11">
          <span>服务商名称：</span>{{application.providerName}}</a-col>
        <a-col :span="11">
          <span>应用类别：</span>
          {{application.productTypeLabelName+'>'+application.applicationTypeLabelName}}</a-col>
      </a-row>
      <a-row type="flex" justify="center" class="line-wrap">
        <a-col :span="22">
          <span>备注：</span>{{application.remark || '-'}}</a-col>
      </a-row>
      <a-row type="flex" justify="center" class="line-wrap">
        <a-col :span="22">
          <span>审核结果：</span>{{$getters.appAnunledStatus(application.auditStatus)}}</a-col>
      </a-row>
      <a-row type="flex" justify="center" class="line-wrap">
        <a-col :span="22">
          <span>备注：</span>{{application.remark1 || '-'}}</a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import searchCom from '../../components/Search.vue';

const columns = [{
  title: '申请Id',
  dataIndex: 'id',
  align: 'center',
}, {
  title: '应用Id',
  dataIndex: 'applicationId',
  align: 'center',
}, {
  title: '应用名称',
  dataIndex: 'applicationName',
  align: 'center',
}, {
  title: '服务商名称',
  dataIndex: 'providerName',
  align: 'center',
}, {
  title: '应用类别',
  key: 'appType',
  align: 'center',
  scopedSlots: { customRender: 'appType' },
}, {
  title: '备注',
  dataIndex: 'remark',
  align: 'center',
}, {
  title: '应用状态',
  dataIndex: 'status',
  align: 'center',
  scopedSlots: { customRender: 'status' },
}, {
  title: '申请时间',
  dataIndex: 'updateTime',
  align: 'center',
}, {
  title: '状态',
  dataIndex: 'auditStatus',
  align: 'center',
  scopedSlots: { customRender: 'auditStatus' },
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
      condition: {},
      searchData: [],
      total: 0,
      pageNum: 1,
      data: [],
      columns,
      formVisible: false,
      detailVisible: false,
      application: {},
      form: this.$form.createForm(this),
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
        }, {
          type: 'select',
          attr: 'status',
          label: '应用状态',
          option: this.$selectOptions.status.slice(3),
          value: '',
        }, {
          type: 'select',
          attr: 'auditStatus',
          label: '状态',
          option: this.$selectOptions.appAnunledStatus,
          value: '',
        }];
    },
    search(filter) {
      this.condition = {
        applicationId: filter.applicationId,
        applicationName: filter.applicationName,
        providerName: filter.providerName,
        status: filter.status,
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
      this.$api.examineManage.appAnnuledApply(params).then((res) => {
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
    handleClick(data) {
      const params = {
        applicationId: data.applicationId,
        id: data.id,
      };
      this.$api.examineManage.appAnunledDetail(params).then((res) => {
        if (res.code === 200) {
          this.application = res.result;
          this.formVisible = true;
        }
      });
    },
    handleCancel() {
      this.formVisible = false;
      this.form.resetFields();
    },
    handleDetail(data) {
      const params = {
        applicationId: data.applicationId,
        id: data.id,
      };
      this.$api.examineManage.appAnunledDetail(params).then((res) => {
        if (res.code === 200) {
          this.application = res.result;
          this.detailVisible = true;
        }
      });
    },
    handleSubmit(e) { // 审核表单提交
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          const params = {
            id: this.application.id,
            applicationId: this.application.applicationId,
            ...values,
          };
          this.$api.examineManage.appAnnuledAudit(params).then((res) => {
            if (res.code === 200) {
              this.formVisible = false;
              this.$message.success(res.message);
              this.fetchData();
            } else {
              this.$message.error(res.message);
            }
          });
        }
      });
    },
    putExcel() {
      if (this.$store.state.enable) {
        this.$store.commit('setEnable', false);
        this.$excel(global.config.requestUrl
          + this.$api.examineManage.appAnunledExcel, this.condition, () => {
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
    line-height: 38px;
  }
</style>
