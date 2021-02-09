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
          <span class="f12 ilb fix_position" >
            <a-icon type="plus" class="mr5 f10"/>云市场推荐</span>
        </a-button>
        <a-button
          class="mb10 ml10 custom-size"
          type="primary"
          :disabled="data.length===0"
          @click="handleSort">
          <span class="f12 ilb fix_position" >{{draggable?'确认排序':'应用排序'}}</span>
        </a-button>
        <a-button
          class="mb10 ml10 custom-size"
          type="primary"
          :disabled="data.length===0"
          @click="handleIndustrySort">
          <span class="f12 ilb fix_position" >应用类型排序</span>
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
              <a-tag color="blue">{{item}}</a-tag>
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
            @change="appTypeChange"
            >
            <a-select-option
              v-for="item in classifyOptions"
              :value="item.value"
              :key="item.value">{{item.label}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <!-- <a-form-item
          label="行业标签"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-select
            v-decorator="[
              'industryLabelId',
              {rules:$mixRule.execute($mixRule.rules.required, $mixRule.message.requiredSpecial)}
            ]"
            placeholder="请选择"
            @change="fetchAppList">
            <a-select-option
              v-for="item in industryOptions"
              :value="item.value"
              :key="item.value">{{item.label}}
            </a-select-option>
          </a-select>
        </a-form-item> -->
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
    <a-modal
      title="行业排序"
      v-model="sortVisiable"
      @ok="handleindustrySortSubmit"
      @cancel="sortVisiable = false">
      <draggable
        v-model="industryOrder"
        @update="datadragEnd"
        v-bind="{animation:500}">
          <transition-group>
            <template v-for="(tag) in industryOrder">
              <a-tag
                color="blue"
                :key="tag.labelId">
                {{tag.industryName}}
              </a-tag>
            </template>
          </transition-group>
      </draggable>
    </a-modal>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import draggable from 'vuedraggable';
import draggableTable from '../../components/DraggableTable.vue';
import searchCom from '../../components/Search.vue';

const columns = [
  {
    title: '应用ID',
    dataIndex: 'applicationId',
    align: 'center',
  }, {
    title: '应用类型',
    dataIndex: 'applicationTypeLabelName',
    align: 'center',
  }, {
    title: '服务商名称',
    dataIndex: 'providerName',
    align: 'center',
  }, {
    title: 'Logo',
    dataIndex: 'logoPath',
    scopedSlots: { customRender: 'logoPath' },
    align: 'center',
  }, {
    title: '应用名称',
    dataIndex: 'applicationName',
    align: 'center',
  }, {
    title: '产品类型',
    dataIndex: 'productTypeLabelName',
    align: 'center',
  },
  // {
  //   title: '行业标签',
  //   dataIndex: 'industryLabelNames',
  //   scopedSlots: { customRender: 'industryLabelNames' },
  //   align: 'center',
  //   width: '300px'
  // },
  {
    title: '添加时间',
    dataIndex: 'addTime',
    align: 'center',
  },
  {
    title: '发布时间',
    dataIndex: 'releaseTime',
    align: 'center',
  }, {
    title: '应用状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
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
    draggable,
    draggableTable,
  },
  data() {
    return {
      searchData: [],
      condition: {},
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
      applicationType: '',
      draggable: false,
      sortAdjustList: [],
      pagination: {
        pageSize: global.config.pageSize,
        total: 0,
        current: 1,
        showTotal: total => `共 ${total} 条`,
      },
      sortVisiable: false,
      industryOrder: [],
    };
  },
  computed: {
    ...mapState(['moduleOptions', 'classifyOptions', 'industryOptions', 'optionsFetched']),
    // industryOptions: {
    //   get() {
    //     return this.$store.state.industryOptions
    //   },
    //   set(val) {
    //     this.$store.commit('setIndustryOptions', val)
    //   }
    // }
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
        },
        // {
        //   type: 'select',
        //   label: '行业标签',
        //   attr: 'industryLabelId',
        //   option: [{ value: '', label: '请选择' }].concat(this.industryOptions),
        //   value: '',
        // },
        {
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
      this.$api.mailManage.cloudRecomend(params).then((res) => {
        if (res.code === 200) {
          this.data = res.result.list;
          this.pagination.total = Number(res.result.total);
        }
      });
    },
    handleTableChange(pagination) {
      this.pagination.pageNum = pagination.current;
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
        type: 4,
        applicationIdList: [id],
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
    appTypeChange(val) {
      this.applicationType = val;
      this.fetchAppList();
    },
    fetchAppList(val) {
      const params = {
        type: 4,
        productTypeLabelId: this.productTypeLabelId,
        applicationTypeLabelId: this.applicationType,
        industryLabelId: val,
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
            type: 4,
            applicationId: values.applicationId,
            sortLabelId: values.applicationTypeLabelId,
          };
          this.$api.mailManage.newAppSave(params).then((res) => {
            if (res.code === 200) {
              // this.visible = false;
              this.fetchData();
            } else {
              this.$message.error(res.message);
            }
          });
        }
      });
    },
    saveSortData(data) {
      this.data = data;
      this.sortAdjustList = [];
      data.forEach((item, index) => {
        this.sortAdjustList.push({ applicationId: item.applicationId, sort: index });
      });
    },
    handleSort() {
      if (!this.condition.applicationTypeLabelId) {
        this.$message.warning('请先查询产品类型-应用类型');
        return false;
      }
      this.draggable = !this.draggable;
      if (!this.draggable && this.sortAdjustList.length > 0) {
        const params = {
          sortLabelId: this.condition.applicationTypeLabelId,
          type: 4,
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
    handleIndustrySort() {
      this.$api.mailManage.labelOption(3).then((res) => {
        if (res.code === 200) {
          this.sortVisiable = true;
          this.industryOrder = res.result;
        }
      });
    },
    datadragEnd(evt) {
      evt.preventDefault();
    },
    handleindustrySortSubmit() {
      this.industryOrder.forEach((item, index) => {
        item.sort = index;
      });
      const params = {
        industryOrderList: this.industryOrder,
        type: 3,
      };
      this.$api.mailManage.sortIndustryLabel(params).then((res) => {
        if (res.code === 200) {
          this.sortVisiable = false;
          this.fetchData();
          this.$message.success('操作成功');
        }
      });
    },
  },
};
</script>
