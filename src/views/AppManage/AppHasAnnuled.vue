<template>
  <div class="common_page_wapper">
    <div class="page_search">
      <search-com :searchData="searchData" @search="search"></search-com>
    </div>
    <div class="page_table">
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
          <span @click="toDetail(data.applicationId)" class="mr5"><a>查看</a></span>
          <span @click="putOnline(data)" class="mr5"><a>  上架</a></span>
          <a-popconfirm
            placement="topRight"
            :title="`请问将【${data.applicationName}】进行删除，删除后便无法恢复该应用`"
            @confirm="handleDelete(data.applicationId)"
            okText="是" cancelText="否">
            <span><a>删除</a></span>
          </a-popconfirm>
          <!-- <span @click="handleDelete(data.applicatonId)" class="mr5"><a>删除</a></span> -->
        </span>
      </a-table>
    </div>
    <a-modal title="发布" v-model="visible" @ok="handleSubmit" @cancel="visible = false">
      <a-form :form="form">
        <p style="padding: 10px 10px 20px 5px;">请问是否确定将【{{application.applicationName}}】重新发布到saas商城端?</p>
        <a-form-item
          label="备注"
          :label-col="{ span: 3 }"
          :wrapper-col="{ span: 20 }"
        >
          <a-textarea
            placeholder="请留下重新发布的原因"
            v-decorator="[
              'reReleaseReason',
              {rules:$mixRule.execute($mixRule.rules.whitespace, $mixRule.message.requiredInput)}
            ]"
          />
        </a-form-item>
      </a-form>
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
    width: 100,
  }, {
    title: '服务商名称',
    dataIndex: 'providerName',
    align: 'center',
  }, {
    title: 'Logo',
    dataIndex: 'logoPath',
    align: 'center',
    scopedSlots: { customRender: 'logoPath' },
  },
  {
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
    align: 'center',
    scopedSlots: { customRender: 'industryLabelNames' },
    width: 200,
  }, {
    title: '下架时间',
    dataIndex: 'dismountTime',
    align: 'center',
  }, {
    title: '应用状态',
    dataIndex: 'status',
    align: 'center',
    scopedSlots: { customRender: 'status' },
  }, {
    title: '审核员',
    dataIndex: 'auditor',
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
      visible: false,
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
          type: 'select',
          attr: 'productTypeLabelId',
          label: '产品类型',
          option: [{ label: '请选择', value: '' }].concat(this.moduleOptions),
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
            // this.searchData.splice(1, 0, {
            //   type: 'select',
            //   attr: 'applicationTypeLabelId',
            //   label: '应用类型',
            //   option: this.classifyOptions,
            //   value: '',
            // });
            // this.searchData.splice(2, 0, {
            //   type: 'select',
            //   attr: 'industryLabelId',
            //   label: '行业标签',
            //   option: this.industryOptions,
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
        },
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
          option: this.$selectOptions.status,
          value: '',
        }, {
          type: 'select',
          attr: 'auditor',
          label: '审核员',
          option: [],
          value: '',
        }, {
          type: 'rangePicker',
          attr: 'Time',
          label: '下架时间',
          value: [],
        }];
    },
    search(filter) {
      this.condition = {
        applicationId: filter.applicationId,
        applicationName: filter.applicationName,
        applicationTypeLabelId: filter.applicationTypeLabelId,
        auditor: filter.auditor,
        industryLabelId: filter.industryLabelId,
        // orderBy: 'string',
        productTypeLabelId: filter.productTypeLabelId,
        providerName: filter.providerName,
        status: filter.status,
        dismountBeginTime: this.$utils.dateRangeFormat(filter.Time, 'begin'),
        dismountEndTime: this.$utils.dateRangeFormat(filter.Time, 'end'),
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
      this.$api.app.hasUnderlineList(params).then((res) => {
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
    toDetail(applicationId) {
      this.$router.push(`/AppManage/AppDetail/${applicationId}`);
    },
    putOnline(application) {
      this.application = application;
      this.visible = true;
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          const params = {
            applicationId: this.application.applicationId,
            status: 10,
            reReleaseReason: values.reReleaseReason,
          };
          this.$api.app.updateStatus(params).then((res) => {
            if (res.result === 1) {
              this.visible = false;
              this.$message.success(res.message);
              this.fetchData();
            } else {
              this.$message.error(res.message);
            }
          });
        }
      });
    },
    handleDelete(applicationId) {
      this.$api.app.appDelete(applicationId).then((res) => {
        if (res.code === 200) {
          this.$message.success(res.message);
          this.fetchData();
        } else {
          this.$message.error(res.message);
        }
      });
    },
  },
};
</script>
