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
          <span class="f12 ilb fix_position" >添加活动</span>
        </a-button>
         <a-button
          class="mb10 ml10"
          type="primary"
          size="small"
          :disabled="!($store.state.enable) || data.length===0"
          @click="putExcel">
          <span class="f12 ilb fix_position" >excel导出</span>
        </a-button>
      </div>
      <a-table
        rowKey="id"
        :dataSource="data"
        :columns="columns"
        :pagination="pagination" @change="handleTableChange">
        <span slot="targetUser" slot-scope="data">{{$getters.targetUser(data)}}</span>
        <span slot="bonusType" slot-scope="data">{{$getters.bonusType(data)}}</span>
        <span slot="activityTime" slot-scope="data">
          {{data.activityStartTime +'~'+ data.activityEndTime}}</span>
        <span slot="status" slot-scope="data">{{$getters.activityStatus(data)}}</span>
        <span slot="quantityLimit" slot-scope="data">{{Number(data) === -1?'无上限': data}}</span>
        <span slot="operation" slot-scope="data">
          <a-switch
            v-if="data.status !== -1"
            checkedChildren="开"
            unCheckedChildren="关"
            :checked="Boolean(data.status)"
            @change="(checked) => {handleSwitch(data.id, data.name, checked)}"/>
        </span>
      </a-table>
    </div>
  </div>
</template>
<script>
import searchCom from '../../components/Search.vue';

const columns = [{
  title: '活动ID',
  dataIndex: 'id',
  align: 'center',
}, {
  title: '活动名称',
  dataIndex: 'name',
  align: 'center',
}, {
  title: '用户对象',
  dataIndex: 'targetUser',
  scopedSlots: { customRender: 'targetUser' },
  align: 'center',
}, {
  title: '指定服务商',
  dataIndex: 'targetProviderName',
  align: 'center',
}, {
  title: '指定产品',
  dataIndex: 'targetApplicationName',
  align: 'center',
}, {
  title: '活动奖励',
  dataIndex: 'bonusType',
  scopedSlots: { customRender: 'bonusType' },
  align: 'center',
}, {
  title: '每日发送上限',
  dataIndex: 'quantityLimit',
  scopedSlots: { customRender: 'quantityLimit' },
  align: 'center',
}, {
  title: '活动时间',
  key: 'activityTime',
  scopedSlots: { customRender: 'activityTime' },
  align: 'center',
}, {
  title: '活动链接',
  dataIndex: 'activityLink',
  align: 'center',
}, {
  title: '状态',
  dataIndex: 'status',
  scopedSlots: { customRender: 'status' },
  align: 'center',
}, {
  title: '今日已发数量',
  dataIndex: 'quantityUsed',
  align: 'center',
}, {
  title: '累计已发数量',
  dataIndex: 'totalUsed',
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
          label: '活动ID',
          attr: 'id',
          value: '',
        }, {
          type: 'input',
          label: '活动名称',
          attr: 'name',
          value: '',
        }, {
          type: 'select',
          label: '用户对象',
          attr: 'targetUser',
          option: [{ value: '', label: '请选择' }].concat(this.$selectOptions.targetUser),
          value: '',
        }, {
          type: 'input',
          label: '指定产品',
          attr: 'targetApplicationName',
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
          label: '活动时间',
          value: [],
        },
      ];
    },
    search(filter) {
      this.condition = {
        id: filter.id,
        name: filter.name,
        targetUser: filter.targetUser,
        targetApplicationName: filter.targetApplicationName,
        status: filter.status,
        beginTime: this.$utils.dateRangeFormat(filter.Time, 'begin'),
        endTime: this.$utils.dateRangeFormat(filter.Time, 'end'),
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
      this.$api.operation.activityList(params).then((res) => {
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
    handleAdd() {
      this.$router.push('/OperationManage/ActivityDetail');
    },
    handleSwitch(id, name, checked) {
      const self = this;
      this.$confirm({
        title: checked ? '开始提示' : '关闭提示',
        content: checked ? `是否确认将【${name}】进行开启，开启后该活动将立即在商城端进行执行！`
          : `是否确认将【${name}】进行关闭，关闭后该活动将不再执行！`,
        okText: '是',
        okType: checked ? 'success' : 'danger',
        cancelText: '否',
        onOk() {
          const params = {
            id,
            status: checked === true ? 1 : -1,
          };
          self.$api.operation.updateActivityStatus(params).then((res) => {
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
    putExcel() {
      if (this.$store.state.enable) {
        this.$store.commit('setEnable', false);
        this.$excel(global.config.requestUrl + this.$api.operation.activityExcel,
          this.condition,
          () => {
            setTimeout(() => {
              this.$store.commit('setEnable', true);
            }, 1000);
          });
      }
    },
  },
};
</script>
