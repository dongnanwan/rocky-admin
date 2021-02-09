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
          @click="handleEdit()">
          <span class="f12 ilb fix_position" >添加角色</span>
        </a-button>
      </div>
      <a-table
        rowKey="id"
        :dataSource="data"
        :columns="columns"
        :pagination="pagination" @change="handleTableChange">
        <span slot="accountStatus" slot-scope="data">{{$getters.accountStatus(data)}}</span>
        <span slot="operation" slot-scope="data">
          <span @click="handleEdit(data.id, data.roleName)"><a>修改</a></span>
          <span class="ml10" @click="handleDelete(data.id)"><a>删除</a></span>
        </span>
      </a-table>
    </div>
    <!-- 添加修改权限 -->
    <a-modal
      :title="modifyId?'修改角色':'添加角色'"
      :visible="visible"
      @cancel="resetRoleForm"
      @ok="addRoleSubmit" :okButtonProps="{ props: {disabled: btnDisable} }">
    <template>
      <a-form @submit="addRoleSubmit" :form="addRoleForm" >
        <a-form-item
          label="角色名称"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }">
            <a-input
              v-decorator="[
                'roleName',
                {
                  rules: $mixRule.execute($mixRule.rules.required, $mixRule.message.requiredSpecial),
                }
              ]" />
        </a-form-item>
        <a-form-item
          label="角色权限"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }">
          <a-tree
            checkable
            v-decorator="[
              'rightIds',
              {
                rules: $mixRule.execute($mixRule.rules.required, $mixRule.message.requiredSpecial),
              },
               
            ]"
            :treeData="treeData" @check="onCheck" v-model="rightIds"></a-tree>
        </a-form-item>
      </a-form>
    </template>
    </a-modal>
  </div>
</template>
<script>
import searchCom from '../../components/Search.vue';

const columns = [{
  title: '角色ID',
  dataIndex: 'id',
  align: 'center',
}, {
  title: '角色名称',
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
      condition: {},
      searchData: [],
      total: 0,
      pageNum: 1,
      data: [],
      columns,
      visible: false,
      addRoleForm: this.$form.createForm(this),
      rightIdsAll: [],
      rightIds: [],
      treeData: [],
      checkedKeys: [],
      btnDisable: true,
      modifyId: '',
      menuArr: [],
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
    visible(value) {
      if (!value) {
        this.addRoleForm.resetFields();
        this.modifyId = '';
        this.rightIds = [];
        this.btnDisable = true;
      }
    },
  },
  mounted() {
    this.searchDataInit();
    this.fetchData();
    this.fetchPermissTree();
  },
  methods: {
    searchDataInit() { // 初始化搜索条件
      this.updateSearchData();
    },
    updateSearchData() {
      this.searchData = [
        {
          type: 'input',
          label: '角色ID',
          attr: 'roleId',
          value: '',
        }, {
          type: 'input',
          label: '角色名称',
          attr: 'roleName',
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
        roleId: filter.roleId,
        roleName: filter.roleName,
        createdTimeStart: this.$utils.dateRangeFormat(filter.createdTime, 'begin'),
        createdTimeEnd: this.$utils.dateRangeFormat(filter.createdTime, 'end'),
        lastUpdateTimeStart: this.$utils.dateRangeFormat(filter.updatedTime, 'begin'),
        lastUpdateTimeEnd: this.$utils.dateRangeFormat(filter.updatedTime, 'end'),
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
      this.$api.setting.roleList(params).then((res) => {
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
    fetchPermissTree() {
      this.$api.setting.permisionTree().then((res) => {
        if (res.code === 200) {
          const menuList = res.result[0].subMenu;
          const str1 = JSON.parse(JSON.stringify(menuList).replace(/menuName/g, 'title'));
          const str2 = JSON.parse(JSON.stringify(str1).replace(/subMenu/g, 'children'));
          const str3 = JSON.parse(JSON.stringify(str2).replace(/id/g, 'key'));

          this.treeData = str3;
          this.arrReduce(this.treeData); // 递归菜单树 数组降维
          this.menuArr = this.menuArr.filter(element => element.hasMenu === true); // 过滤得到为菜单的数组
        }
      });
    },
    handleEdit(id, name) {
      if (id) {
        this.modifyId = id;
        this.$api.setting.fetchTreeById(id).then((res) => {
          if (res.code === 200) {
            this.rightIds = res.result.checkedAuthList;
            
            this.visible = true;
            this.$nextTick(() => {
              this.addRoleForm.setFieldsValue({roleName: name})
            })
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        this.visible = true;
      }
    },
    handleDelete(id) {
      this.$api.setting.deleteRole(id).then((res) => {
        if (res.code === 200) {
          this.$message.success(res.message);
          this.fetchData();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    arrReduce(arr) { // 数组
      arr.forEach((element) => {
        if (element.children) {
          this.arrReduce(element.children);
          this.menuArr.push(element);
        } else {
          this.menuArr.push(element);
        }
      });
    },
    addRoleSubmit(e) {
      e.preventDefault();
      this.addRoleForm.validateFields((err, values) => {
        if (!err) {
          const menuIdList = [];
          let actionIdList = [];

          this.menuArr.forEach((item) => {
            if (values.rightIds.indexOf(item.key) !== -1) {
              menuIdList.push(item.key);
            }
          });
          actionIdList = values.rightIds.filter(el => menuIdList.indexOf(el) < 0);
          const params = {
            roleName: values.roleName,
            platformCode: 'ADMIN',
            menuIdList,
            actionIdList,
          };
          if (this.modifyId) {
            params.roleId = this.modifyId;
          }
          this.$api.setting.saveRole(params).then((res) => {
            if (res.code === 200) {
              this.$message.success('操作成功');
              this.resetRoleForm();
              this.fetchData();
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    onCheck(checkedKeys, info) {
      this.btnDisable = false;
      this.checkedKeys = info.halfCheckedKeys.concat(checkedKeys);
      this.addRoleForm.setFieldsValue({
        rightIds: this.checkedKeys,
      });
      // this.rightIds = this.checkedKeys;
    },
    resetRoleForm() {
      this.visible = false;
    },
  },
};
</script>
