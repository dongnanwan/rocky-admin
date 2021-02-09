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
          <span class="f12 ilb fix_position" >添加案例</span>
        </a-button>
        <a-button
          class="mb10 ml10 custom-size"
          type="primary"
          :disabled="data.length===0"
          @click="handleSort">
          <span class="f12 ilb fix_position" >{{draggable?'确认排序':'调整排序'}}</span>
        </a-button>
        <a-button
          class="mb10 ml10 custom-size"
          type="primary"
          :disabled="data.length===0"
          @click="handleIndustrySort">
          <span class="f12 ilb fix_position" >行业排序</span>
        </a-button>
      </div>
      <draggable-table
        :dataSource="data"
        :columns="columns"
        :draggable="draggable"
        :pagination="pagination"
        @change="handleTableChange"
        @update="saveSortData">
        <span slot="miniprogramImagePath" slot-scope="{data}">
          <img :src="data.miniprogramImagePath" alt="" width="60" height="60">
        </span>
        <span slot="caseImagePath" slot-scope="{ data }">
          <img :src="data.caseImagePath" alt="" width="60" height="60">
        </span>
        <span slot="operation" slot-scope="{data}">
          <span @click="handleEdit(data.caseId)" class="mr10"><a>修改</a></span>
          <a-popconfirm
            placement="topRight"
            :title="`确认删除【${data.caseName}】吗`"
            @confirm="handleDelete(data.caseId)"
            okText="是" cancelText="否">
            <span><a>删除</a></span>
          </a-popconfirm>
        </span>
      </draggable-table>
    </div>
    <a-modal title="行业排序" v-model="industrySortVisiable" @ok="handleindustrySortSubmit" @cancel="industrySortVisiable = false">
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
import searchCom from '../../components/Search.vue';
import draggableTable from '../../components/DraggableTable';

const columns = [{
  title: '行业标签',
  dataIndex: 'industryLabelName',
  align: 'center',
  width: '200px',
}, {
  title: '服务商名称',
  dataIndex: 'providerName',
  align: 'center',
}, {
  title: '案例ID',
  dataIndex: 'caseId',
  align: 'center',
}, {
  title: '案例名称',
  dataIndex: 'caseName',
  align: 'center',
}, {
  title: '案例简介',
  dataIndex: 'introduce',
  align: 'center',
  width: '380px',
}, {
  title: '小程序码',
  dataIndex: 'miniprogramImagePath',
  align: 'center',
  scopedSlots: { customRender: 'miniprogramImagePath' },
}, {
  title: '案例图',
  dataIndex: 'caseImagePath',
  align: 'center',
  scopedSlots: { customRender: 'caseImagePath' },
}, {
  title: '添加时间',
  dataIndex: 'createdTime',
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
    draggable,
  },
  data() {
    return {
      condition: {},
      searchData: [],
      total: 0,
      pageNum: 1,
      data: [],
      columns,
      draggable: false,
      sortAdjustList: [],
      industrySortVisiable: false,
      industryOrder: [],
    };
  },
  computed: {
    ...mapState(['industryOptions', 'optionsFetched']),
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
          label: '案例ID',
          attr: 'caseId',
          value: '',
        }, {
          type: 'input',
          label: '案例名称',
          attr: 'caseName',
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
        caseId: filter.caseId,
        caseName: filter.caseName,
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
      this.$api.miniProgram.appletCaseList(params).then((res) => {
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
    handleEdit(caseId) {
      this.$router.push(`/AppletTemplate/CaseDetail/${caseId}`);
    },
    handleDelete(caseId) {
      this.$api.miniProgram.deleteCase(caseId).then((res) => {
        if (res.code === 200) {
          this.fetchData();
          this.$message.success('删除成功');
        }
      });
    },
    saveSortData(data) {
      this.data = data;
      this.sortAdjustList = [];
      data.forEach((item, index) => {
        this.sortAdjustList.push({ caseId: item.caseId, sort: index + 1 });
      });
    },
    handleSort() {
      if (!this.condition.industryLabelId) {
        this.$message.warning('请查询对应行业列表再进行排序');
        return false;
      }
      this.draggable = !this.draggable;
      if (!this.draggable && this.sortAdjustList.length > 0) {
        const params = {
          industryLabelId: this.condition.industryLabelId,
          sortAdjustList: this.sortAdjustList,
        };
        this.$api.miniProgram.updateCaseSort(params).then((res) => {
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
      this.$api.mailManage.labelOption(1).then((res) => {
        if (res.code === 200) {
          this.industrySortVisiable = true;
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
        type: 1,
      };
      this.$api.mailManage.sortIndustryLabel(params).then((res) => {
        if (res.code === 200) {
          this.industrySortVisiable = false;
          this.fetchData();
          this.$message.success('操作成功');
        }
      });
    },
  },
};
</script>
