<template>
  <div class="common_page_wapper">
    <div class="page_search">
      <search-com :searchData="searchData" @search="search"></search-com>
    </div>
    <div class="page_table p16">
      <div class="export_excel clearfix">
        <a-button
          class="m10 custom-size"
          type="primary"
          @click="handleEdit()">
          <span class="f12 ilb fix_position" >添加账号</span>
        </a-button>
        <a-button
          class="m10"
          type="primary"
          size="small"
          :disabled="!($store.state.enable) || data.length===0"
          @click="putExcel()">
          <span class="f12 ilb fix_position" >导出为excel</span>
        </a-button>
      </div>
      <a-table
        rowKey="accountId"
        :dataSource="data"
        :columns="columns"
        :pagination="pagination" @change="handleTableChange">
        <span slot="accountStatus" slot-scope="data">{{$getters.accountStatus(data)}}</span>
        <span slot="operation" slot-scope="data">
          <span @click="handleEdit(data)"><a>修改</a></span>
          <span class="ml10" @click="resetPwd(data.accountId, data.accountName)"><a>重置密码</a></span>
          <a-popconfirm placement="topRight" okText="是" cancelText="否" @confirm="cancelAccount(data.accountId)" v-if="data.status === 1">
            <template slot="title">
              <p>是否确认将【{{data.accountName}}】进行注销，注销后该账号将无法登陆！</p>
            </template>
            <span class="ml10"><a>注销</a></span>
          </a-popconfirm>
          <a-popconfirm placement="topRight" okText="是" cancelText="否" @confirm="resetAccount(data.accountId)" v-if="data.status !== 1">
            <template slot="title">
              <p>是否确认将 【{{data.accountName}}】进行恢复，恢复后该账号可以重新登陆！</p>
            </template>
            <span class="ml10"><a>恢复</a></span>
          </a-popconfirm>
          <!-- <span
            class="ml10"
            @click="cancelAccount(data.accountId)"
            v-if="data.status === 1"><a>注销</a></span>
          <span
            class="ml10"
            @click="resetAccount(data.accountId)"
            v-if="data.status !== 1"><a>恢复</a></span> -->
        </span>
      </a-table>
    </div>
    <a-modal
      :title="accountId?'修改账号': '添加账号'"
      v-model="visible"
      @ok="handleSubmit"
    >
      <a-form
        :form="form"
      >
        <a-form-item
          label="账号名称"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="[
              'accountName',
              {rules:$mixRule.execute($mixRule.rules.whitespace, $mixRule.message.requiredInput)}
            ]"
            placeholder="工号+姓名缩写"
          />
        </a-form-item>
        <a-form-item
          label="真实姓名"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="[
              'realName',
              {rules:$mixRule.execute($mixRule.rules.whitespace, $mixRule.message.requiredInput)}
            ]"
            placeholder="请输入真实姓名"
          />
        </a-form-item>
        <a-form-item
          label="账号角色"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-select
            v-decorator="[
              'roleId',
              {rules:$mixRule.execute($mixRule.rules.required, $mixRule.message.requiredSpecial)}
            ]"
            placeholder="请选择">
            <a-select-option
              v-for="item in roleOptions"
              :value="item.value"
              :key="item.value">{{item.label}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="初始密码"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
          v-if="!accountId"
        >
          <a-input
            v-decorator="[
              'password',
              {rules:$mixRule.execute($mixRule.rules.whitespace, $mixRule.message.requiredInput)}
            ]"
            placeholder="请输入"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      title="重置密码"
      v-model="resetVisible"
      @ok="handleResetSubmit"
    >
      <a-form
        :form="resetForm"
      >
        <a-form-item
          label="账号名称"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            disabled
            v-model="resetAccountName"
          />
        </a-form-item>
        <a-form-item
          label="密码重置"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="[
              'newPassword',
              {rules:$mixRule.execute($mixRule.rules.whitespace, $mixRule.message.requiredInput)}
            ]"
            placeholder="请输入"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import axios from 'axios';
import searchCom from '../../components/Search.vue';


const columns = [{
  title: '账号ID',
  dataIndex: 'accountId',
  align: 'center',
}, {
  title: '账号名称',
  dataIndex: 'accountName',
  align: 'center',
}, {
  title: '真实姓名',
  dataIndex: 'realName',
  align: 'center',
}, {
  title: '角色',
  dataIndex: 'roleName',
  align: 'center',
}, {
  title: '创建时间',
  dataIndex: 'createdTime',
  align: 'center',
}, {
  title: '最后修改时间',
  dataIndex: 'updateTime',
  align: 'center',
}, {
  title: '状态',
  dataIndex: 'status',
  align: 'center',
  scopedSlots: { customRender: 'accountStatus' },
}, {
  title: '操作',
  key: 'operation',
  scopedSlots: { customRender: 'operation' },
  align: 'center',
}];
const downloadFile = (data, fileName) => {
  if (!data) {
    return;
  }
  const blob = new Blob([data], { type: 'application/vnd.ms-excel;charset=UTF-8 ' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
};
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
      accountId: '',
      visible: false,
      form: this.$form.createForm(this),
      roleOptions: [{ value: '', label: '请选择' }],
      resetVisible: false,
      resetForm: this.$form.createForm(this),
      resetAccountName: '',
      resetAccountId: '',
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
    visible(val) {
      if (!val) {
        this.accountId = '';
        this.form.resetFields();
      }
    },
  },
  mounted() {
    this.searchDataInit();
    this.fetchData();
    this.getAllRoleList();
  },
  methods: {
    searchDataInit() { // 初始化搜索条件
      this.updateSearchData();
    },
    updateSearchData() {
      this.searchData = [
        {
          type: 'input',
          label: '账号ID',
          attr: 'accountId',
          value: '',
        }, {
          type: 'input',
          label: '账号名称',
          attr: 'accountName',
          value: '',
        }, {
          type: 'select',
          label: '角色',
          attr: 'roleId',
          option: this.roleOptions,
          value: '',
        }, {
          type: 'select',
          attr: 'status',
          label: '状态',
          option: [{ value: '', label: '请选择' }].concat(this.$selectOptions.accountStatus),
          value: '',
        }, {
          type: 'rangePicker',
          attr: 'createdTime',
          label: '创建时间',
          value: [],
        }, {
          type: 'rangePicker',
          attr: 'updatedTime',
          label: '最后修改时间',
          value: [],
        },
      ];
    },
    search(filter) {
      this.condition = {
        accountId: filter.accountId,
        accountName: filter.accountName,
        roleId: filter.roleId,
        status: filter.status,
        createdTimeStart: this.$utils.dateRangeFormat(filter.createdTime, 'begin'),
        createdTimeEnd: this.$utils.dateRangeFormat(filter.createdTime, 'end'),
        updatedTimeStart: this.$utils.dateRangeFormat(filter.updatedTime, 'begin'),
        updatedTimeEnd: this.$utils.dateRangeFormat(filter.updatedTime, 'end'),
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
      this.$api.setting.accountList(params).then((res) => {
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
    getAllRoleList() {
      this.$api.setting.allRoleList().then((res) => {
        if (res.code === 200) {
          res.result.forEach((element) => {
            this.roleOptions.push({ label: element.roleName, value: element.id });
          });
        }
      });
    },
    handleEdit(data) {
      this.visible = true;
      if (data) {
        this.accountId = data.accountId;
        this.$nextTick(() => {
          this.form.setFieldsValue({
            accountName: data.accountName,
            realName: data.realName,
            roleId: data.roleId,
            password: data.password,
          });
        });
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          const params = {
            ...values,
          };
          if (this.accountId) {
            params.accountId = this.accountId;
            this.$api.setting.editAccount(params).then((res) => {
              if (res.code === 200) {
                this.visible = false;
                this.$message.success('操作成功');
                this.fetchData();
              } else {
                this.$message.error(res.message);
              }
            });
          } else {
            this.$api.setting.addAccount(params).then((res) => {
              if (res.code === 200) {
                this.visible = false;
                this.$message.success('操作成功');
                this.fetchData();
              } else {
                this.$message.error(res.message);
              }
            });
          }
        }
      });
    },
    cancelAccount(accountId) {
      const params = { accountId };
      this.$api.setting.cancelAccount(params).then((res) => {
        if (res.code === 200) {
          this.$message.success(res.message);
          this.fetchData();
        }
      });
    },
    resetAccount(accountId) {
      const params = { accountId };
      this.$api.setting.resetAccount(params).then((res) => {
        if (res.code === 200) {
          this.$message.success(res.message);
          this.fetchData();
        }
      });
    },
    resetPwd(id, name) {
      this.resetVisible = true;
      this.resetAccountName = name;
      this.resetAccountId = id;
    },
    handleResetSubmit(e) {
      e.preventDefault();
      this.resetForm.validateFields((err, values) => {
        if (!err) {
          const params = {
            accountId: this.resetAccountId,
            ...values,
          };
          this.$api.setting.resetPwd(params).then((res) => {
            this.resetVisible = false;
            if (res.code === 200) {
              this.$message.success(res.message);
            }
          });
        }
      });
    },
    putExcel() {
      if (this.$store.state.enable) {
        this.$store.commit('setEnable', false);
        axios.post(global.config.requestUrl + this.$api.setting.accountExcel, this.condition, { responseType: 'blob' }).then((response) => {
          let fileName = response.headers['content-disposition'].split(';')[1].split('filename=')[1];
          fileName = decodeURI(fileName);
          downloadFile(response.data, fileName);
          this.$store.commit('setEnable', true);
        });
      }
    },
  },
};
</script>
