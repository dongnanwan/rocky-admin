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
          @click="handleEdit(0)">
          <span class="f12 ilb fix_position" >添加模板</span>
        </a-button>
      </div>
      <a-table
        rowKey="templateId"
        :dataSource="data"
        :columns="columns"
        :pagination="pagination" @change="handleTableChange">
        <span slot="templateImagePath" slot-scope="data">
          <img :src="data" alt="" width="60" height="60">
        </span>、
        <span slot="industryLabelName" slot-scope="data">
          <div v-if="data">
            <span v-for="item in data.split(' ')" :key="item">
              <a-tag class="tag-m" color="blue">{{item}}</a-tag>
            </span>
          </div>
          <div v-else>暂无</div>
        </span>
        <span slot="industryLabelIds" slot-scope="data">
          <span v-for="item in JSON.parse(data).id" :key="item">
            <a-tag color="blue">{{industryLabel(item)}}</a-tag>
          </span>
        </span>
        <span slot="operation" slot-scope="data">
          <span @click="handleEdit(data.templateId)" class="mr10"><a>修改</a></span>
          <a-popconfirm
            placement="topRight"
            :title="`确认删除【${data.templateName}】吗`"
            @confirm="handleDelete(data.templateId)"
            okText="是" cancelText="否">
            <span><a>删除</a></span>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import searchCom from '../../components/Search.vue';

const columns = [{
  title: '产品类型',
  dataIndex: 'productType',
  align: 'center',
}, {
  title: '服务商名称',
  dataIndex: 'providerName',
  align: 'center',
}, {
  title: '应用类型',
  dataIndex: 'applicationTypeLabelName',
  align: 'center',
}, {
  title: '行业标签',
  dataIndex: 'industryLabelName',
  align: 'center',
  scopedSlots: { customRender: 'industryLabelName' },
  width: 200,
}, {
  title: '模板ID',
  dataIndex: 'templateId',
  align: 'center',
}, {
  title: '模板名称',
  dataIndex: 'templateName',
  align: 'center',
}, {
  title: '价格',
  dataIndex: 'price',
  align: 'center',
}, {
  title: '模板图',
  dataIndex: 'templateImagePath',
  align: 'center',
  scopedSlots: { customRender: 'templateImagePath' },
}, {
  title: '添加时间',
  dataIndex: 'createdTime',
  align: 'center',
}, {
  title: '操作',
  key: 'operation',
  scopedSlots: { customRender: 'operation' },
  align: 'center',
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
    ...mapState(['classifyOptions', 'industryOptions', 'optionsFetched']),
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
        this.$store.dispatch('fetchClassifyOptions', '2');
        this.searchDataInit();
      }
    },
  },
  mounted() {
    this.$store.dispatch('fetchClassifyOptions', '2');
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
          label: '模板ID',
          attr: 'templateId',
          value: '',
        }, {
          type: 'input',
          label: '模板名称',
          attr: 'templateName',
          value: '',
        }, {
          type: 'input',
          label: '服务商名称',
          attr: 'providerName',
          value: '',
        }, {
          type: 'select',
          attr: 'industryLabelId',
          label: '行业标签',
          option: this.industryOptions,
          value: '',
        }, {
          type: 'rangePicker',
          attr: 'Time',
          label: '添加时间',
          value: [],
        },
      ];
    },
    search(filter) {
      this.condition = {
        templateId: filter.templateId,
        templateName: filter.templateName,
        providerName: filter.providerName,
        industryLabelId: filter.industryLabelId,
        createBeginTime: this.$utils.dateRangeFormat(filter.Time, 'begin'),
        createEndTime: this.$utils.dateRangeFormat(filter.Time, 'end'),
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
      this.$api.miniProgram.templateList(params).then((res) => {
        if (res.code === 200) {
          this.total = Number(res.result.total);
          this.data = res.result.list;
        }
      });
    },
    handleTableChange(pagination) {
      this.pageNum = pagination.current;
      this.fetchData();
    },
    handleEdit(templateId) {
      this.$router.push(`/AppletTemplate/templateDetail/${templateId}`);
    },
    handleDelete(templateId) {
      this.$api.miniProgram.deleteApplet(templateId).then((res) => {
        if (res.code === 200) {
          this.fetchData();
          this.$message.success('删除成功');
        }
      });
    },
  },
};
</script>
