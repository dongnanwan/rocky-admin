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
          @click="addApp('-1')">
          <span class="f12 ilb fix_position" >添加应用</span>
        </a-button>
      </div>
      <a-table
        :dataSource="data"
        :columns="columns"
        rowKey="applicationId"
        :pagination="pagination"
        @change="handleTableChange" >
        <span slot="applicationId" slot-scope="data">
          <div class="word-break">{{data}}</div>
        </span>
        <span slot="logoPath" slot-scope="data">
          <img :src="data" alt="" width="60" height="60">
        </span>
        <span slot="status" slot-scope="data">
          {{$getters.status(data)}}
        </span>
        <span slot="industryLabelNames" slot-scope="data">
          <div v-if="data">
            <span v-for="item in data.split(' ')" :key="item">
              <a-tag class="tag-m" color="blue" v-if="item">{{item}}</a-tag>
            </span>
          </div>
          <div v-else>暂无</div>
        </span>
        <span
          slot="recommendSetting"
          slot-scope="data">
          {{recommendFilter(data)}}
        </span>
        <span slot="operation" slot-scope="data">
          <span class="mr10" @click="addApp(data.applicationId)"><a>编辑</a></span>
          <span class="mr10" @click="toDetail(data.applicationId)"><a>查看</a></span>
          <span @click="setRecommendSetting(data)" class="mr10"><a>推荐</a></span>
          <a-popconfirm
            placement="topRight"
            :title="`确认下架吗【${data.applicationName}】`"
            @confirm="putUnderline(data.applicationId)"
            okText="是" cancelText="否">
            <span class="mr10"><a>下架</a></span>
          </a-popconfirm>

        </span>
      </a-table>
    </div>
    <a-modal
      title="推荐设置"
      v-model="visible"
      @ok="handleOk"
    >
      <p class="message">您可为 <span class="blue">【{{application.name}}】</span>  设置以下推荐</p>
      <a-checkbox-group v-model="checkedList" >
        <a-checkbox
          :disabled="item.disabled"
          v-for="item in recommendSettingOptions"
          :value="item.value"
          :key="item.value">{{item.label}}</a-checkbox>
      </a-checkbox-group>
      <p class="red message">{{recommendMessage}}</p>
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
    scopedSlots: { customRender: 'applicationId' },
  },
  {
    title: '服务商名称',
    dataIndex: 'providerName',
    align: 'center',
  }, {
    title: 'Logo',
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
    width: 100,
  }, {
    title: '行业标签',
    dataIndex: 'industryLabelNames',
    align: 'center',
    scopedSlots: { customRender: 'industryLabelNames' },
    width: 200,
  }, {
    title: '发布时间',
    dataIndex: 'releaseTime',
    align: 'center',
  }, {
    title: '应用状态',
    dataIndex: 'status',
    align: 'center',
    scopedSlots: { customRender: 'status' },
    width: 100,
  }, {
    title: '推荐设置',
    key: 'recommendSetting',
    align: 'center',
    scopedSlots: { customRender: 'recommendSetting' },
  }, {
    title: '审核员',
    dataIndex: 'auditor',
    align: 'center',
  }, {
    title: '浏览总人数',
    dataIndex: 'viewerCount',
    align: 'center',
  }, {
    title: '应用评分',
    dataIndex: 'mark',
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
      searchData: [],
      condition: {},
      data: [],
      columns,
      total: 0,
      pageNum: 0,
      visible: false,
      application: '',
      checkedList: [],
      recommendMessage: '',
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
    recommendSettingOptions() {
      const arr = this.$selectOptions.recommendSetting.slice(1, 3);
      arr.forEach((item) => {
        // eslint-disable-next-line
        item.disabled = false;
      });
      return arr;
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
    visible(val) {
      if (!val) {
        this.checkedList = [];
      }
    },
  },
  methods: {
    recommendSettingLabel(data) {
      const buyerFlag = data.buyerRecommendSetting;
      const relatedFlag = data.relatedRecommendSetting;
      let result = '';
      if (buyerFlag === 1 && relatedFlag === -1) {
        result = '买家应用推荐';
      }
      if (buyerFlag === -1 && relatedFlag === 1) {
        result = '同行相关推荐';
      }
      if (buyerFlag === 1 && relatedFlag === 1) {
        result = '同行相关推荐 + 买家应用推荐';
      }
      if (buyerFlag === -1 && relatedFlag === -1) {
        result = '否';
      }
      return result;
    },
    recommendFilter(data) {
      let result = '';
      if (data.buyerRecommendSetting === 1) {
        result += '买家应用推荐 ';
      }
      if (data.relatedRecommendSetting === 1) {
        result += '同行相关推荐';
      }
      if (data.buyerRecommendSetting === -1 && data.relatedRecommendSetting === -1) {
        result = '否';
      }
      return result;
    },
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
              if (item.attr === 'industryLabelId') {
                item.value = '';
                item.option = [{ value: '', label: '请选择' }].concat(this.industryOptions);
              }
            });
            // this.searchData.splice(1, 0, {
            //   type: 'select',
            //   attr: 'applicationTypeLabelId',
            //   label: '应用类型',
            //   option: this.classifyOptions,
            //   value: '',
            // });
          },
        }, {
          type: 'select',
          label: '应用类型',
          attr: 'applicationTypeLabelId',
          option: [],
          value: '',
        },
        {
          type: 'select',
          attr: 'industryLabelId',
          label: '行业标签',
          option: this.industryOptions,
          value: '',
        }, {
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
          attr: 'auditor',
          label: '审核员',
          option: [],
          value: '',
        }, {
          type: 'select',
          attr: 'recommendSetting',
          label: '推荐设置',
          option: this.$selectOptions.recommendSetting,
          value: '',
        }, {
          type: 'rangePicker',
          attr: 'Time',
          label: '发布时间',
          value: [],
        }];
    },
    search(filter) {
      this.condition = {
        applicationId: filter.applicationId,
        applicationName: filter.applicationName,
        applicationTypeLabelId: filter.applicationTypeLabelId,
        auditor: filter.auditor,
        buyerRecommendSetting: filter.recommendSetting === 'buyerRecommendSetting' ? 1 : '',
        relatedRecommendSetting: filter.recommendSetting === 'relatedRecommendSetting' ? 1 : '',
        industryLabelId: filter.industryLabelId,
        productTypeLabelId: filter.productTypeLabelId,
        providerName: filter.providerName,
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
      this.$api.app.hasPublishList(params).then((res) => {
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
    setRecommendSetting(data) {
      this.application = {
        name: data.applicationName, id: data.applicationId, buyerRecommendSetting: data.buyerRecommendSetting, relatedRecommendSetting: data.relatedRecommendSetting,
      };
      if (data.buyerRecommendSetting === 1) {
        this.checkedList.push('buyerRecommendSetting');
      }
      if (data.relatedRecommendSetting === 1) {
        this.checkedList.push('relatedRecommendSetting');
      }
      this.$api.common.recommendEnable(this.application.id).then((res) => {
        if (res.code === 10021025) { // 同行相关推荐达到上限
          this.recommendSettingOptions.forEach((item) => {
            if (item.value === 'relatedRecommendSetting') {
              item.disabled = true;
              this.recommendMessage = res.message;
            } else {
              item.disabled = false;
            }
          });
        } else if (res.code === 10021026) { // 买家应用推荐达到上限
          this.recommendSettingOptions.forEach((item) => {
            if (item.value === 'buyerRecommendSetting') {
              item.disabled = true;
              this.recommendMessage = res.message;
            } else {
              item.disabled = false;
            }
          });
        } else if (res.code === 10021027) { // 都达到上限
          this.recommendSettingOptions.forEach((item) => {
            item.disabled = true;
            this.recommendMessage = res.message;
          });
        } else if (res.code === 200) {
          this.recommendSettingOptions.forEach((item) => {
            item.disabled = false;
            this.recommendMessage = '';
          });
        }
      });
      this.visible = true;
    },
    putUnderline(applicationId) {
      const params = {
        applicationId,
        status: -20,
      };
      this.$api.app.updateStatus(params).then((res) => {
        if (res.result === 1) {
          this.$message.success(res.message);
          this.fetchData();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handleOk() {
      const params = {
        applicationId: this.application.id,
        buyerRecommendSetting: this.checkedList.indexOf('buyerRecommendSetting') !== -1 ? 1 : -1,
        relatedRecommendSetting: this.checkedList.indexOf('relatedRecommendSetting') !== -1 ? 1 : -1,
      };
      this.$api.app.setApplicationRecommend(params).then((res) => {
        if (res.code === 200) {
          this.visible = false;
          this.fetchData();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    addApp(id) {
      this.$router.push({ path: `/AppManage/AppAdd/${id}`, query: { type: 1 } });
    },
    toDetail(applicationId) {
      this.$router.push(`/AppManage/AppDetail/${applicationId}`);
    },
  },
};
</script>
<style lang="scss" scoped>
.message{
  line-height: 38px;
}
.tag-m{
  margin: 5px;
}
</style>
