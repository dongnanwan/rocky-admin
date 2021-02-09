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
          <span class="f12 ilb fix_position" >添加品牌服务商</span>
        </a-button>
        <a-button
          class="mb10 ml10 custom-size"
          type="primary"
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
        <span slot="logoPath" slot-scope="{ data }">
          <img :src="data.providerLogoPath" alt="" width="60" height="60">
        </span>
        <span slot="operation" slot-scope="{ data }">
          <span @click="handleDetail(data.providerShowId)" class="mr10"><a>修改</a></span>
          <!-- <span @click="handleDelete(data.providerShowId)" class="mr10"><a>删除</a></span> -->
          <a-popconfirm
            placement="topRight"
            :title="`确认删除【${data.providerName}】吗`"
            @confirm="handleDelete(data.providerShowId)"
            okText="是" cancelText="否">
            <span><a>删除</a></span>
          </a-popconfirm>
        </span>
      </draggable-table>
    </div>
    <a-modal title="添加品牌服务商" v-model="visible" @ok="handleSubmit" @cancel="visible = false">
      <a-form :form="form">
        <a-form-item
          label="服务商名称"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="[
              'providerName',
              {rules:$mixRule.execute($mixRule.rules.whitespace, $mixRule.message.requiredInput)}
            ]"
          />
        </a-form-item>
        <a-form-item
          label="服务商Logo"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-upload
            name="file"
            listType="picture-card"
            class="avatar-uploader flex"
            :showUploadList="false"
            :headers="{'Authorization':$store.state.token}"
            :action="uploadUrl"
            :beforeUpload="beforeUpload"
            @change="handleImgChange"
          >
            <img v-if="imgUrl" :src="imgUrl" width="100" height="100"/>
            <div v-else class="flex flex-col flex-justify-center" style="height: 100px;">
                <a-icon :type="'upload'" class="green"/>
                <div class="ant-upload-text">200*200px</div>
            </div>
          </a-upload>
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
  title: 'Logo',
  dataIndex: 'logoPath',
  scopedSlots: { customRender: 'logoPath' },
  align: 'center',
}, {
  title: '服务商名称',
  dataIndex: 'providerName',
  align: 'center',
}, {
  title: '添加时间',
  dataIndex: 'addTime',
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
      visible: false,
      form: this.$form.createForm(this),
      draggable: false,
      sortAdjustList: [],
      pagination: {
        pageSize: global.config.pageSize,
        total: 0,
        current: 1,
        showTotal: total => `共 ${total} 条`,
      },
      modifyId: '',
      imgUrl: '',
      uploadUrl: global.config.uploadUrl,
      providerAttachId: '',
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
      this.searchData = [{
        type: 'input',
        label: '服务商名称',
        attr: 'providerName',
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
        providerName: filter.providerName,
        addBeginTime: this.$utils.dateRangeFormat(filter.Time, 'begin'),
        addEndTime: this.$utils.dateRangeFormat(filter.Time, 'end'),
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
      this.$api.mailManage.providerList(params).then((res) => {
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
    handleDetail(id) {
      this.modifyId = id;
      this.$api.mailManage.getProviderDetail(this.modifyId).then((res) => {
        if (res.code === 200) {
          const detail = res.result;
          this.visible = true;
          this.$nextTick(() => {
            this.form.setFieldsValue({
              providerName: detail.providerName,
            });
            this.imgUrl = detail.providerLogoPath;
            this.providerAttachId = detail.providerAttachId;
          });
        }
      });
    },
    handleAdd() {
      this.visible = true;
    },
    handleDelete(id) {
      const providerShowIds = id;
      this.$api.mailManage.providerDelete(providerShowIds).then((res) => {
        if (res.code === 200) {
          this.$message.success('删除成功');
          this.fetchData();
        }
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.visible = false;
          const params = {
            providerName: values.providerName,
            providerAttachId: this.providerAttachId,
          };
          if (this.modifyId) {
            params.providerShowId = this.modifyId;
            this.$api.mailManage.updateProvider(params).then((res) => {
              if (res.code === 200) {
                // this.visible = false;
                this.fetchData();
                this.resetForm();
              }
            });
          } else {
            this.$api.mailManage.addProvider(params).then((res) => {
              if (res.code === 200) {
                // this.visible = false;
                this.fetchData();
                this.resetForm();
              }
            });
          }
        }
      });
    },
    resetForm() {
      this.modifyId = '';
      this.form.resetFields();
      this.imgUrl = '';
      this.providerAttachId = '';
    },
    saveSortData(data) {
      this.data = data;
      this.sortAdjustList = [];
      data.forEach((item, index) => {
        this.sortAdjustList.push({ providerShowId: item.providerShowId, sort: index + 1 });
      });
    },
    handleSort() {
      this.draggable = !this.draggable;
      if (!this.draggable && this.sortAdjustList.length > 0) {
        const params = {
          sortAdjustList: this.sortAdjustList,
        };
        this.$api.mailManage.providerAdjust(params).then((res) => {
          if (res.code === 200) {
            this.$message.success('操作成功');
            this.fetchData();
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },
    beforeUpload(file) {
      // 限制图片 格式、size、分辨率
      const isJPG = file.type === 'image/jpeg';
      const isGIF = file.type === 'image/gif';
      const isPNG = file.type === 'image/png';
      if (!(isJPG || isGIF || isPNG)) {
        this.$message.error('只能上传JPG 、JPEG 、GIF、 PNG格式的图片~');
      }
      const validWidth = 200;
      const validHeight = 200;
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        this.$message.error('Image must smaller than 1MB!');
      }
      return (isJPG || isGIF || isPNG)
      && isLt1M && this.$utils.valWidthAndHeight(file, validWidth, validHeight);
    },
    handleImgChange(info) {
      const { response } = info.file;
      if (response) {
        if (response.code === 200) {
          this.imgUrl = response.result.attachmentUrl;
          this.providerAttachId = response.result.attachmentId;
        } else {
          this.$message.error(response.message);
        }
      }
    },
  },
};
</script>
