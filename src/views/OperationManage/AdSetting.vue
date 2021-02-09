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
          <span class="f12 ilb fix_position" >添加广告</span>
        </a-button>
        <a-button
          class="mb10 ml10"
          type="primary"
          size="small"
          :disabled="data.length===0"
          @click="handleSort">
          <span class="f12 ilb fix_position" >{{draggable?'确认排序':'调整排序'}}</span>
        </a-button>
      </div>
      <draggable-table
        :dataSource="data"
        :columns="columns"
        :draggable="draggable"
        :pagination="pagination"
        @change="handleTableChange"
        @update="saveSortData">
        <span slot="adImageAttachUrl" slot-scope="{ data }">
          <img :src="data.adImageAttachUrl" alt="" width="80" height="80">
        </span>
        <span slot="adType" slot-scope="{data}">{{$getters.advertType(data.adType)}}</span>
        <span slot="targetUser" slot-scope="{data}">{{$getters.targetUser(data.targetUser)}}</span>
        <span slot="time" slot-scope="{data}">
          {{data.popularizeStartTime +'~'+ data.popularizeEndTime}}</span>
        <span slot="status" slot-scope="{data}">{{$getters.activityStatus(data.status)}}</span>
        <span slot="operation" slot-scope="{data}">
          <span
            v-if="data.status !== -1"
            @click="handleEdit(data.id)" class="mr30"><a>修改</a></span>
          <a-switch
            v-if="data.status !== -1"
            checkedChildren="开"
            unCheckedChildren="关"
            :checked="Boolean(data.status)"
            @change="(checked) => {handleSwitch(data.id, checked)}"/>
        </span>
      </draggable-table>
    </div>
  </div>
</template>
<script>
import searchCom from '../../components/Search.vue';
import draggableTable from '../../components/DraggableTable.vue';

const columns = [{
  title: '广告ID',
  dataIndex: 'id',
  align: 'center',
}, {
  title: '广告位',
  dataIndex: 'adType',
  scopedSlots: { customRender: 'adType' },
  align: 'center',
}, {
  title: '广告图',
  dataIndex: 'adImageAttachUrl',
  scopedSlots: { customRender: 'adImageAttachUrl' },
  align: 'center',
}, {
  title: '推广对象',
  dataIndex: 'targetUser',
  scopedSlots: { customRender: 'targetUser' },
  align: 'center',
}, {
  title: '添加时间',
  dataIndex: 'createdTime',
  align: 'center',
}, {
  title: '推广时间',
  dataIndex: 'time',
  scopedSlots: { customRender: 'time' },
  align: 'center',
}, {
  title: '广告链接',
  dataIndex: 'adLink',
  align: 'center',
}, {
  title: '状态',
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
      draggable: false,
      sortAdjustList: [],
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
  },
  watch: {
    optionsFetched(flag) {
      if (flag) {
        this.searchDataInit();
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
          label: '广告ID',
          attr: 'id',
          value: '',
        }, {
          type: 'select',
          label: '广告位',
          attr: 'advertType',
          option: [{ value: '', label: '请选择' }].concat(this.$selectOptions.advertType),
          value: '',
        }, {
          type: 'select',
          label: '推广对象',
          attr: 'targetUser',
          option: [{ value: '', label: '请选择' }].concat(this.$selectOptions.targetUser),
          value: '',
        }, {
          type: 'select',
          label: '状态',
          attr: 'status',
          option: [{ value: '', label: '请选择' }].concat(this.$selectOptions.activityStatus),
          value: '',
        }, {
          type: 'rangePicker',
          attr: 'Time',
          label: '推广时间',
          value: [],
        },
      ];
    },
    search(filter) {
      this.condition = {
        id: filter.id,
        advertType: filter.advertType,
        targetUser: filter.targetUser,
        status: filter.status,
        popularizeStartTime: this.$utils.dateRangeFormat(filter.Time, 'begin'),
        popularizeEndTime: this.$utils.dateRangeFormat(filter.Time, 'end'),
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
      this.$api.operation.adSetting(params).then((res) => {
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
    handleSwitch(id, checked) {
      const self = this;
      this.$confirm({
        title: checked ? '开始提示' : '关闭提示',
        content: checked ? `是否确认将ID为【${id}】的广告进行开启，开启后该广告后将立即在商城端进行执行！`
          : `是否确认将ID为【${id}】的广告进行关闭，关闭后该广告将不再展示！`,
        okText: '是',
        okType: checked ? 'success' : 'danger',
        cancelText: '否',
        onOk() {
          const params = {
            id,
            status: checked === true ? 1 : -1,
          };
          self.$api.operation.updateAdStatus(params).then((res) => {
            if (res.code === 200) {
              self.$message.success('操作成功');
              self.fetchData();
            } else {
              this.$message.error(res.message);
            }
          });
        },
        onCancel() {
        },
      });
    },
    // handleAdd() {
    //   this.$router.push(`/OperationManage/AdDetail`);
    // },
    saveSortData(data) {
      this.data = data;
      this.sortAdjustList = [];
      data.forEach((item, index) => {
        this.sortAdjustList.push({ adType: item.adType, id: item.id, sort: index });
      });
    },
    handleSort() {
      if (!this.condition.advertType) {
        this.$message.warning('请查询对应广告位列表再进行调整排序');
      } else {
        this.draggable = !this.draggable;
        if (!this.draggable && this.sortAdjustList.length > 0) {
          const params = {
            advertManageSortList: this.sortAdjustList,
          };
          this.$api.operation.sortAdjust(params).then((res) => {
            if (res.code === 200) {
              this.$message.success('操作成功');
              this.fetchData();
            } else {
              this.$message.error(res.message);
            }
          });
        }
      }
    },
    handleEdit(id) {
      this.$router.push(`/OperationManage/AdDetail/${id}`);
    },
  },
};
</script>
