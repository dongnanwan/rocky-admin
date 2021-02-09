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
          <span class="f12 ilb fix_position">excel导出</span>
        </a-button>
      </div>
      <a-table
        :dataSource="data"
        :columns="columns"
        rowKey="index"
        :pagination="pagination"
        @change="handleTableChange">
        <span slot="status" slot-scope="data">
          {{$getters.withdrawStatus(data)}}
        </span>
        <span slot="operation" slot-scope="data">
          <a class="mr10" @click="handleAudit(data)" v-if="data.status === 0">审核</a>
          <a @click="handleException(data)" v-if="data.exceptionCount > 0">异常处理</a>
        </span>
      </a-table>
    </div>
    <a-modal
      width="80vw"
      title="服务商结算审核"
      :visible="formVisible"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-table
        :dataSource="detailData"
        :rowSelection="rowSelection"
        :columns="detailColumns"
        rowKey="serialNo"
        :pagination="detailPage"
        @change="(pagination) => {
          this.detailPage.current = pagination.current;this.getDetail(this.opcType, () => {});}" >
        <span slot="serialNo" slot-scope="data">
          <div class="word-break">{{data}}</div>
        </span>
        <span slot="orderNo" slot-scope="data">
          <div class="word-break">{{data}}</div>
        </span>
        <span slot="accountId" slot-scope="data">
          <div class="word-break">{{data}}</div>
        </span>
        <span slot="orderType" slot-scope="data">{{$getters.orderType(data)}}</span>
        <span slot="paymentChannel" slot-scope="data">{{$getters.payWay(data)}}</span>
        <span slot="status" slot-scope="data">{{$getters.flowStatus(data)}}</span>
        <span slot="profitRatio" slot-scope="data">{{data*100}}%</span>
      </a-table>
      <a-form :form="form" class="info-wrap">
        <div class="info-title">结算审核</div>
        <a-form-item label="已选流水订单" :label-col="{ span: 3 }" :wrapper-col="{ span: 8 }">
          {{this.selectedRowKeys.length}}
        </a-form-item>
        <a-form-item label="审核结果" :label-col="{ span: 3 }" :wrapper-col="{ span: 8 }">
          <a-select
            :options="$selectOptions.withdrawStatus1"
            v-decorator="[
              'status',
              { rules: [{ required: true, message: '请选择' }] },
            ]"
            placeholder="请选择"
          >
          </a-select>
        </a-form-item>
        <a-form-item label="备注" :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }">
          <a-textarea
            v-decorator="['comment', { rules: [{ required: true, message: '请输入' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import searchCom from '../../components/Search.vue';

const columns = [{
  title: '支付日期',
  dataIndex: 'settleDate',
  align: 'center',
}, {
  title: '服务商ID',
  dataIndex: 'providerId',
  align: 'center',
}, {
  title: '服务商名称',
  dataIndex: 'providerName',
  align: 'center',
}, {
  title: '需结算订单数量',
  dataIndex: 'settleCount',
  align: 'center',
}, {
  title: '异常订单数量',
  dataIndex: 'exceptionCount',
  align: 'center',
}, {
  title: '状态',
  dataIndex: 'status',
  align: 'center',
  scopedSlots: { customRender: 'status' },
}, {
  title: '审核时间',
  dataIndex: 'auditTime',
  align: 'center',
}, {
  title: '操作员',
  dataIndex: 'auditor',
  align: 'center',
}, {
  title: '操作',
  key: 'operation',
  align: 'center',
  scopedSlots: { customRender: 'operation' },
}];
const detailColumns = [{
  title: '流水编号',
  dataIndex: 'serialNo',
  align: 'center',
  scopedSlots: { customRender: 'serialNo' },
}, {
  title: '订单编号',
  dataIndex: 'orderNo',
  align: 'center',
  scopedSlots: { customRender: 'orderNo' },
}, {
  title: '订单类型',
  dataIndex: 'orderType',
  align: 'center',
  scopedSlots: { customRender: 'orderType' },
}, {
  title: '用户ID',
  dataIndex: 'accountId',
  align: 'center',
  scopedSlots: { customRender: 'accountId' },
}, {
  title: '应用名称',
  dataIndex: 'applicationId',
  align: 'center',
}, {
  title: '支付渠道',
  dataIndex: 'paymentChannel',
  align: 'center',
  scopedSlots: { customRender: 'paymentChannel' },
}, {
  title: '创建时间',
  dataIndex: 'createTime',
  align: 'center',
}, {
  title: '支付时间',
  dataIndex: 'payTime',
  align: 'center',
}, {
  title: '流水状态',
  dataIndex: 'status',
  align: 'center',
  scopedSlots: { customRender: 'status' },
}, {
  title: '应付金额',
  dataIndex: 'payableAmount',
  align: 'center',
}, {
  title: '优惠金额',
  dataIndex: 'offAmount',
  align: 'center',
}, {
  title: '实付金额',
  dataIndex: 'paymentAmount',
  align: 'center',
}, {
  title: '分润比例',
  dataIndex: 'profitRatio',
  align: 'center',
  scopedSlots: { customRender: 'profitRatio' },
}, {
  title: '服务商收款金额',
  dataIndex: 'providerReceiveAmount',
  align: 'center',
}, {
  title: '平台收款金额',
  dataIndex: 'platformReceiveAmount',
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
      form: this.$form.createForm(this),
      settleId: '',
      detailData: [],
      detailColumns,
      detailPage: {
        current: 1,
        pageSize: 5,
        total: 0,
      },
      selectedRowKeys: [],
      isAll: 0,
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
    rowSelection() {
      return {
        onSelectAll: (selected, selectedRows) => {
          if (selected) {
            /* eslint-disable */
            this.isAll = 1;
            let arr = [];
            selectedRows.forEach((item) => {
              arr.push(item.serialNo);
            })
            this.selectedRowKeys = arr;
          } else {
            this.isAll = 0;
            this.selectedRowKeys = []
          }
        },
        onChange: (selectedRowKeys) => {
          /* eslint-disable */
          this.selectedRowKeys = selectedRowKeys;
        },
      };
    },
  },
  mounted() {
    this.fetchData();
    this.searchDataInit();
  },
  methods: {
    searchDataInit() { // 初始化搜索条件
      this.updateSearchData();
    },
    updateSearchData() {
      this.searchData = [
        {
          type: 'rangePicker',
          attr: 'Time',
          label: '支付日期',
          value: [],
        }, {
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
          type: 'select',
          attr: 'status',
          label: '状态',
          option: [{ value: '', label: '请选择' }].concat(this.$selectOptions.withdrawStatus),
          value: '',
        }];
    },
    search(filter) {
      this.condition = {
        providerId: filter.providerId,
        providerName: filter.providerName,
        status: filter.status,
        settleDateBegin: this.$utils.dateRangeFormat(filter.Time, 'begin'),
        settleDateEnd: this.$utils.dateRangeFormat(filter.Time, 'end'),
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
      this.$api.financeManage.settleAuditList(params).then((res) => {
        if (res.code === 200) {
          const { list } = res.result;
          list.forEach((item, index) => {
            /* eslint-disable */
            item.index = index + (this.pageNum - 1) * global.config.pageSize;
          });
          this.data = list;
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
        this.$excel(global.config.requestUrl
          + this.$api.financeManage.settleAuditExcel, this.condition, () => {
          setTimeout(() => {
            this.$store.commit('setEnable', true);
          }, 1000);
        });
      }
    },
    handleAudit(data) {
      this.settleId = Number(data.id)
      this.opcType = 0;
      this.getDetail(this.opcType, () =>{
        this.formVisible = true;
      });
    },
    getDetail(type, cb) {
      const params = {
        settleId: this.settleId,
        type: type,
        pageSize: this.detailPage.pageSize,
        pageNum: this.detailPage.current,
      };
      this.$api.financeManage.processData(params).then((res) => {
        if (res.code === 200) {
          this.detailData = res.result.list;
          cb();
        }
      });
    },
    handleException(data) {
      this.settleId = Number(data.id)
      this.opcType = -1;
      this.getDetail(this.opcType, () =>{
        this.formVisible = true;
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          const params = {
            settleId: this.settleId,
            isAll: this.isAll,
            serialArray: this.selectedRowKeys,
            type: this.opcType,
            ...values,
          };
          this.$api.financeManage.settleAuditSubmit(params).then((res) => {
            if (res.code === 200) {
              this.formVisible = false;
              this.$message.success('操作成功');
              this.fetchData();
            } else {
              this.$message.error(res.message)
            }
          });
        }
      });
    },
    handleCancel() {
      this.formVisible = false;
    },
  },
};
</script>
<style lang="scss">
.info-wrap{
  margin: 10px 5px;
  .info-title{
    border-left: 3px solid #1585FF;
    padding-left:  10px;
    margin-bottom: 10px;
  }
  .line-wrap{
    line-height: 38px;
  }
}
</style>
