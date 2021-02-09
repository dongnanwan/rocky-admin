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
          <span class="f12 ilb fix_position" >添加精品应用</span>
        </a-button>
        <a-button
          class="mb10 ml10 custom-size"
          type="primary"
          :disabled="data.length===0"
          @click="handleSort">
          <span class="f12 ilb fix_position" >{{draggable?'确认排序':'调整排序'}}</span>
        </a-button>
        <!-- <a-button
          class="mb10 ml10"
          type="primary"
          size="small"
          @click="showDeleteConfirm" :disabled="selectedRowKeys.length=== 0">
          <span class="f12 ilb fix_position" >删除</span>
        </a-button> -->
      </div>
      <draggable-table
        :dataSource="data"
        :columns="columns"
        :draggable="draggable"
        :pagination="pagination"
        @change="handleTableChange"
        @update="saveSortData">
        <span slot="logoPath" slot-scope="{ data }">
          <img :src="data.logoPath" alt="" width="60" height="60">
        </span>
        <span slot="status" slot-scope="{ data }">
          {{$getters.status(data.status)}}
        </span>
        <span slot="industryLabelNames" slot-scope="{ data }">
          <div v-if="data.industryLabelNames">
            <span v-for="item in data.industryLabelNames.split(' ')" :key="item">
              <a-tag class="tag-m" color="blue">{{item}}</a-tag>
            </span>
          </div>
          <div v-else>暂无</div>
        </span>
        <span slot="operation" slot-scope="{ data }">
          <span @click="handleDetail(data.applicationId)" class="mr10"><a>查看</a></span>
          <a-popconfirm
            placement="topRight"
            :title="`确认删除【${data.applicationName}】吗`"
            @confirm="handleDelete(data.applicationId)"
            okText="是" cancelText="否">
            <span><a>删除</a></span>
          </a-popconfirm>
        </span>
      </draggable-table>
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
import draggableTable from '../../components/DraggableTable.vue';
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
  width: '200px',
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
    draggableTable,
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
      draggable: false,
      sortAdjustList: [],
      pagination: {
        pageSize: global.config.pageSize,
        total: 0,
        current: 1,
        showTotal: total => `共 ${total} 条`,
      },
    };
  },
  computed: {
    ...mapState(['moduleOptions', 'classifyOptions', 'industryOptions', 'optionsFetched']),
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
                item.value = '';
                item.option = [{ value: '', label: '请选择' }].concat(this.classifyOptions);
              }
              if (item.attr === 'industryLabelId') {
                item.value = '';
                item.option = [{ value: '', label: '请选择' }].concat(this.industryOptions);
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
      this.pagination.pageNum = 1;
      this.fetchData();
    },
    fetchData() {
      const params = {
        ...this.condition,
        pageNum: this.pagination.pageNum,
        pageSize: global.config.pageSize,
      };
      this.$api.mailManage.topList(params).then((res) => {
        if (res.code === 200) {
          this.data = res.result.list;
          this.pagination.total = Number(res.result.total);
        }
      });
    },
    handleTableChange(current) {
      this.pagination.pageNum = current;
      this.fetchData();
    },
    handleDetail(applicationId) {
      this.$router.push(`/AppManage/AppDetail/${applicationId}`);
    },
    handleAdd() {
      this.visible = true;
    },
    handleDelete(id) {
      const params = {
        type: 3,
        applicationIdList: [id],
      };
      this.$api.mailManage.appDelete(params).then((res) => {
        if (res.code === 200) {
          this.fetchData();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    fetchClassifyOption(val) {
      this.productTypeLabelId = val;
      this.$store.dispatch('fetchClassifyOptions', val);
    },
    fetchAppList(val) {
      const params = {
        type: 3,
        productTypeLabelId: this.productTypeLabelId,
        applicationTypeLabelId: val,
      };
      this.appList = [];
      this.$api.mailManage.appFilterClassify(params).then((res) => {
        if (res.code === 200) {
          this.appList = [];
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
            type: 3,
            applicationId: values.applicationId,
          };
          this.$api.mailManage.newAppSave(params).then((res) => {
            if (res.code === 200) {
              this.fetchData();
            }
          });
        }
      });
    },
    saveSortData(data) {
      this.data = data;
      this.sortAdjustList = [];
      data.forEach((item, index) => {
        this.sortAdjustList.push({ applicationId: item.applicationId, sort: index + 1 });
      });
    },
    handleSort() {
      this.draggable = !this.draggable;
      if (!this.draggable && this.sortAdjustList.length > 0) {
        const params = {
          type: 3,
          sortAdjustList: this.sortAdjustList,
        };
        this.$api.mailManage.sortAdjust(params).then((res) => {
          if (res.code === 200) {
            this.$message.success('操作成功');
            this.fetchData();
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },
  },
};
</script>
