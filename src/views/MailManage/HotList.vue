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
          @click="handleAdd">
          <span class="f12 ilb fix_position" >添加热门应用</span>
        </a-button>
        <a-button
          class="mb10 ml10 custom-size"
          type="primary"
          @click="showDeleteConfirm" :disabled="selectedRowKeys.length=== 0">
          <span class="f12 ilb fix_position" >删除</span>
        </a-button>
      </div>
      <a-table
        rowKey="applicationId"
        :dataSource="data"
        :columns="columns"
        :rowSelection="rowSelection"
        :pagination="pagination" @change="handleTableChange">
        <span slot="logoPath" slot-scope="data">
          <img :src="data" alt="" width="60" height="60">
        </span>
        <span slot="status" slot-scope="data">
          {{$getters.status(data)}}
        </span>
        <span slot="industryLabelNames" slot-scope="data">
          <div v-if="data">
            <span v-for="item in data.split(' ')" :key="item">
              <a-tag class="tag-m" color="blue">{{item}}</a-tag>
            </span>
          </div>
          <div v-else>暂无</div>
        </span>
        <span slot="operation" slot-scope="data">
          <span @click="handleDetail(data.applicationId)" class="mr10"><a>查看</a></span>
        </span>
      </a-table>
    </div>
    <a-modal title="添加新品应用" v-model="visible" @ok="handleSubmit" @cancel="visible = false">
      <a-form :form="form">
        <a-form-item
          label="产品类型"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-select
            v-decorator="[
              'productTypeLabelId',
              {rules:$mixRule.execute($mixRule.rules.required, $mixRule.message.requiredSpecial)}
            ]"
            placeholder="请选择"
            @change="fetchClassifyOption">
            <a-select-option
              v-for="item in moduleOptions"
              :value="item.value"
              :key="item.value">{{item.label}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="应用类型"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-select
            v-decorator="[
              'applicationTypeLabelId',
              {rules:$mixRule.execute($mixRule.rules.required, $mixRule.message.requiredSpecial)}
            ]"
            placeholder="请选择"
            @change="fetchAppList"
            >
            <a-select-option
              v-for="item in classifyOptions"
              :value="item.value"
              :key="item.value">{{item.label}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="应用名称"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-select
            v-decorator="[
              'applicationId',
              {rules:$mixRule.execute($mixRule.rules.required, $mixRule.message.requiredSpecial)}
            ]"
            placeholder="请选择">
            <a-select-option
              v-for="item in appList"
              :value="item.value"
              :key="item.value">{{item.label}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import searchCom from '../../components/Search.vue';

const columns = [{
  title: '应用ID',
  dataIndex: 'applicationId',
  align: 'center',
}, {
  title: 'Logo',
  dataIndex: 'logoPath',
  scopedSlots: { customRender: 'logoPath' },
  align: 'center',
}, {
  title: '服务商名称',
  dataIndex: 'providerName',
  align: 'center',
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
  title: '行业标签',
  dataIndex: 'industryLabelNames',
  scopedSlots: { customRender: 'industryLabelNames' },
  align: 'center',
  width: 200,
}, {
  title: '发布时间',
  dataIndex: 'releaseTime',
  align: 'center',
}, {
  title: '添加时间',
  dataIndex: 'addTime',
  align: 'center',
}, {
  title: '应用状态',
  dataIndex: 'status',
  scopedSlots: { customRender: 'status' },
  align: 'center',
}, {
  title: '浏览人数',
  dataIndex: 'viewerCountFake',
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
      selectedRowKeys: [],
      rowSelection: {
        onChange: (selectedRowKeys) => {
          this.selectedRowKeys = selectedRowKeys;
        },
      },
      visible: false,
      form: this.$form.createForm(this),
      appList: [],
      productTypeLabelId: '',
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
    visible(val) {
      if (!val) {
        this.form.resetFields();
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
          label: '应用ID',
          attr: 'applicationId',
          value: '',
        }, {
          type: 'input',
          attr: 'applicationName',
          label: '应用名称',
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
          label: '行业标签',
          attr: 'industryLabelId',
          option: [{ value: '', label: '请选择' }].concat(this.industryOptions),
          value: '',
        }, {
          type: 'rangePicker',
          attr: 'Time',
          label: '发布时间',
          value: [],
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
        industryLabelId: filter.industryLabelId,
        releaseBeginTime: this.$utils.dateRangeFormat(filter.Time, 'begin'),
        releaseEndTime: this.$utils.dateRangeFormat(filter.Time, 'end'),
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
      this.$api.mailManage.hotList(params).then((res) => {
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
    handleDetail(applicationId) {
      this.$router.push(`/AppManage/AppDetail/${applicationId}`);
    },
    handleAdd() {
      this.visible = true;
    },
    showDeleteConfirm() {
      const self = this;
      this.$confirm({
        title: '删除',
        content: `确认将${this.selectedRowKeys.length}个应用删除吗`,
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk() {
          self.handleDelete();
        },
        onCancel() {
        },
      });
    },
    handleDelete() {
      const params = {
        type: 2,
        applicationIdList: this.selectedRowKeys,
      };
      this.$api.mailManage.appDelete(params).then((res) => {
        if (res.code === 200) {
          this.fetchData();
        }
      });
    },
    fetchClassifyOption(val) {
      this.productTypeLabelId = val;
      this.$store.dispatch('fetchClassifyOptions', val);
    },
    fetchAppList(val) {
      const params = {
        type: 2,
        productTypeLabelId: this.productTypeLabelId,
        applicationTypeLabelId: val,
      };
      this.appList = [];
      this.$api.mailManage.appFilterClassify(params).then((res) => {
        if (res.code === 200) {
          res.result.forEach((item) => {
            this.appList.push({ value: item.applicationId, label: item.applicationName });
          });
        }
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.visible = false;
          const params = {
            type: 2,
            applicationId: values.applicationId,
          };
          this.$api.mailManage.newAppSave(params).then((res) => {
            if (res.code === 200) {
              // this.visible = false;
              this.fetchData();
            }
          });
        }
      });
    },
  },
};
</script>
