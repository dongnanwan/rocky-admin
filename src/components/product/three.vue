<template>
  <div class="wrap">
    <a-form
      :form="form"
      @submit="handleSubmit"
    >
      <a-form-item
        label="表单预览"
        :label-col="{ span: 2 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-table :columns="columns" :dataSource="dataList" bordered :pagination="false">
          <span slot="packageInvokeMax" slot-scope="data">
            {{data?Number(data) === -1 ? '无上限':data+'次':''}}
          </span>
          <span slot="packageUserMax" slot-scope="data">
            {{data?Number(data) === -1 ? '无上限':data+'人':''}}
          </span>
          <span slot="packageTime" slot-scope="data">
            {{data?Number(data) === -1 ? '无上限':data+'月':''}}
          </span>
        </a-table>
      </a-form-item>
      <a-form-item
        label="列标签选择"
        :label-col="{ span: 2 }"
        :wrapper-col="{ span: 20 }"
        required
      >
        <a-checkbox-group v-model="checkedList">
          <a-row>
            <a-col>
              <a-checkbox
                style="width: 120px"
                :disabled="item.value === 'version'
                  || item.value === 'price' || item.value === 'time'"
                :value="item.value"
                v-for="item in plainOptions"
                :key="item.value"
                 @change="onItemChange">{{item.label}}
              </a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
        <a-button class="ml30" size="small" type="primary" @click="handleSetOption">参数值修改</a-button>
      </a-form-item>
      <a-form-item
          label="行内容展示"
          :label-col="{ span: 2 }"
          :wrapper-col="{ span: 20 }"
          required
        >
        <div class="info-wrap" v-for="item in keys" :key="item">
          <s-select
            v-model="version[item]"
            class="mr10"
            :width="120"
            placeholder="请选择"
            :options="versionOption"
            v-if="checkedList.indexOf('version') !== -1">
            <!-- <s-option
              v-for="item in versionOption"
              :value="item.paramValue"
              :key="item.configId">{{item.paramValue}}
            </s-option> -->
          </s-select>
          <s-select
            v-model="limit[item]"
            class="mr10"
            :width="120"
            placeholder="请选择"
            :options="limitOption"
            v-if="checkedList.indexOf('limit')!== -1">
            <!-- <a-select-option
              v-for="item in limitOption"
              :value="item.paramValue"
              :key="item.configId">{{Number(item.paramValue) === -1 ? '无上限':item.paramValue+'次'}}
            </a-select-option> -->
          </s-select>
          <s-select
            v-model="count[item]"
            class="mr10"
            :width="120"
            placeholder="请选择"
            :options="countOption"
            v-if="checkedList.indexOf('count')!== -1">
            <!-- <a-select-option
              v-for="item in countOption"
              :value="item.paramValue"
              :key="item.configId">{{Number(item.paramValue) === -1 ? '无上限':item.paramValue+'人'}}
            </a-select-option> -->
          </s-select>
          <s-input
            v-model="price[item]"
            type="number"
            min='0'
            class="mr10"
            :width="120"
            height="40"
            placeholder="请输入"
            v-if="checkedList.indexOf('price')!== -1" inline/>
          <s-select
            v-model="time[item]"
            class="mr10"
            :width="120"
            :options="timeOption"
            placeholder="请选择" v-if="checkedList.indexOf('time')!== -1">
          </s-select>
          <a-icon
            v-if="keys.length > 1"
            class="dynamic-delete-button"
            type="minus-circle-o"
            :disabled="keys.length === 1"
            @click="() => remove(item)"
          />
        </div>

      </a-form-item>
      <a-form-item v-bind="formItemLayoutWithOutLabel">
        <a-button
          type="dashed"
          style="width: 60%"
          @click="add"
        >
          <a-icon type="plus" /> 添加套餐
        </a-button>
        <div class="flex flex-col remark">
          <span>表单设置：</span>
          <span>1. 您可以自定义勾选您所需要的列标签项，如上所示在行内容中进行自定义编辑（套餐版本和价格以及时间为必选项，不可取消）；</span>
          <span>2. 针对套餐配额选项，针对一些有API调用次数限制的应用可勾选，若您的应用没有API接口调用次数的限制，建议可不勾选</span>
        </div>
      </a-form-item>
      <a-form-item
        label="能否试用"
        :label-col="{ span: 2 }"
        :wrapper-col="{ span: 20 }"
        required
      >
        <a-radio-group v-model="canTrail">
          <a-radio :value="1">是</a-radio>
          <a-radio :value="-1">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-bind="formItemLayoutWithOutLabel" v-if="canTrail === 1">
        <a-checkbox-group v-model="checkedList">
          <a-row>
            <a-col>
              <a-checkbox
                style="width: 120px"
                disabled
                :value="item.value"
                v-for="item in plainOptions"
                :key="item.value">{{item.label}}
              </a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item v-bind="formItemLayoutWithOutLabel" v-if="canTrail === 1">
        <div>
          <a-select
            v-model="trialData.version"
            class="mr10"
            style="width: 120px" disabled>
            <a-select-option value="试用版">试用版</a-select-option>
          </a-select>
          <a-select
            v-model="trialData.limit"
            class="mr10"
            style="width: 120px"
            placeholder="请选择1"
            v-if="checkedList.indexOf('limit') !== -1">
            <a-select-option
              v-for="item in limitOption"
              :value="item.paramValue"
              :key="item.configId">{{item.paramValue == -1 ? '无上限':item.paramValue+'次'}}
            </a-select-option>
          </a-select>
          <a-select
            v-model="trialData.count"
            class="mr10"
            style="width: 120px"
            placeholder="请选择"
            v-if="checkedList.indexOf('count') !== -1">
            <a-select-option
              v-for="item in countOption"
              :value="item.paramValue"
              :key="item.configId">{{item.paramValue == -1 ?'无上限':item.paramValue+'人'}}
            </a-select-option>
          </a-select>
          <a-input
            v-model="trialData.price"
            class="mr10"
            style="width: 120px"
            disabled
            v-if="checkedList.indexOf('price') !== -1"/>
          <a-select
            v-model="trialData.time"
            class="mr10" style="width: 120px"
            v-if="checkedList.indexOf('time') !== -1">
            <a-select-option
              v-for="item in trialTimeOption"
              :value="item"
              placeholder="请选择"
              :key="item.configId">{{item+'天'}}
            </a-select-option>
          </a-select>
        </div>
      </a-form-item>
      <div class="flex flex-justify-end" style="padding-right:120px;">
        <a-button
          class="up-btn mt50"
          style="width:240px;height:50px"
          @click="handleBack"
        >
          <a>上一步</a>
        </a-button>
        <a-button
          class="mt50"
          style="width:240px;height:50px"
          type="primary"
          :loading="$store.state.spinning"
          html-type="submit"
        >
          下一步
        </a-button>
      </div>
    </a-form>
    <a-modal
        title="参数配置"
        v-model="visible"
        width="50vw"
        :closable="false"
      >
        <template slot="footer">
          <a-button key="submit" type="primary" @click="visible=false">
            确认
          </a-button>
        </template>
        <a-form :form="optionsForm"
        >
          <a-form-item
            label="套餐版本"
            :label-col="{ span: 2 }"
            :wrapper-col="{ span: 20 }"
          >
            <config-options
              :tags="versionOption"
              paramCode="00"
              @remove="handleRemoveTag"
              @change="handleNewTag"></config-options>
          </a-form-item>
          <a-form-item
            label="套餐配额"
            :label-col="{ span: 2 }"
            :wrapper-col="{ span: 20 }"
          >
            <config-options
              paramCode="01"
              :tags="limitOption"
              @remove="handleRemoveTag"
              @change="handleNewTag"></config-options>
          </a-form-item>
          <a-form-item
            label="套餐人数"
            :label-col="{ span: 2 }"
            :wrapper-col="{ span: 20 }"
          >
            <config-options
              paramCode="02"
              :tags="countOption"
              @remove="handleRemoveTag"
              @change="handleNewTag"></config-options>
          </a-form-item>
          <a-form-item
            label="套餐时间"
            :label-col="{ span: 2 }"
            :wrapper-col="{ span: 20 }"
          >
            <config-options
              :applicationId="applicationId"
              paramCode="03"
              :tags="timeOption"
              @remove="handleRemoveTag"
              @change="handleNewTag"></config-options>
          </a-form-item>
        </a-form>
    </a-modal>
    <!-- <div class="flex flex-justify-end" style="padding-right:120px;">
      <a-button
        class="up-btn mr50"
        style="width:240px;height:50px"
        @click="handleBack"
      >
        <a>上一步</a>
      </a-button>
      <a-button
      type="primary"
      class="mr50"
      :loading="$store.state.spinning"
      style="width:240px;height:50px"
      html-type="submit">
        下一步
      </a-button>
    </div> -->
  </div>
</template>
<script>
import configOptions from '../ConfigOptions.vue';

/* eslint-disable */
const id = 0;
export default {
  components: { configOptions },
  props: {
    applicationId: {
      type: String,
      default() {
        return 0;
      },
    },
    info: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    const columns = [{
      title: '套餐版本',
      dataIndex: 'version',
      align: 'center',
      width: 200,
    }, {
      title: '套餐配额',
      dataIndex: 'limit',
      scopedSlots: { customRender: 'packageInvokeMax' },
      align: 'center',
      width: 200,
    }, {
      title: '套餐人数',
      dataIndex: 'count',
      scopedSlots: { customRender: 'packageUserMax' },
      align: 'center',
      width: 200,
    }, {
      title: '价格',
      dataIndex: 'price',
      align: 'center',
      width: 200,
    }, {
      title: '时间',
      dataIndex: 'time',
      scopedSlots: { customRender: 'packageTime' },
      align: 'center',
      width: 200,
    }];

    return {
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          sm: { span: 15, offset: 2 },
        },
      },
      form: this.$form.createForm(this),
      optionsForm: this.$form.createForm(this),
      columns,
      plainOptions: this.$selectOptions.packageColumns,
      checkedList: ['version', 'limit', 'count', 'price', 'time'],
      version: [],
      versionOption: [],
      limit: [],
      limitOption: [],
      count: [],
      countOption: [],
      price: [],
      time: [],
      timeOption: [],
      keys: [0],
      canTrail: -1,
      trialData: {
        version: '试用版',
        limit: null,
        count: null,
        price: 1,
        time: null,
      },
      // trialCheckedList: ['version', 'limit', 'count', 'price', 'time'],
      visible: false,
      // versionTags: [],
      trialTimeOption: [1, 3, 4, 7, 15],
    };
  },
  computed: {
    dataList: {
      get() {
        const arr = [];

        this.keys.forEach((item) => {
          arr.push({
            key: item,
            version: this.version[item],
            limit: this.limit[item],
            count: this.count[item],
            price: this.price[item],
            time: this.checkedList.indexOf('time') !== -1 ? this.time[item] : 0,
          });
        });
        return arr;
      },
      set(newValue) {
        // if (newValue.length > 5) {
        //   this.$message.warning('最多只能添加5个套餐版本');
        // } else {
        newValue.forEach((item) => {
          this.version.push(item.packageVersion);
          this.limit.push(item.packageInvokeMax);
          this.count.push(item.packageUserMax);
          this.price.push(String(item.packagePrice));
          this.time.push(item.packageTimeUnit === 3 && Number(item.packageTime)
            !== -1
            ? String(item.packageTime * 12) : String(item.packageTime));
        });
        // }
      },
    },
  },
  watch: {
    applicationId() {
      this.getPackageOption();
    },
    info(val) {
      this.fillFormDate(val);
    },
  },
  mounted() {
    this.getPackageOption();
  },
  methods: {
    handleSetOption() { // 点击参数值修改获取选项值
      this.getPackageOption(() => {
        console.log(this.versionOption)
        this.visible = true;
      });
    },
    fillFormDate(info) { // 填充表单
      this.canTrail = info.canTrail || -1;

      this.keys = [];
      const list = info.packageList.filter(ele => ele.isTrail === -1);
      if (list.length) {
        this.dataList = list;
        list.forEach((item, index) => {
          this.keys.push(index);
        });
      } else {
        this.keys = [0];
      } // 填充非试用版的套餐信息
      const trialData = info.packageList.filter(ele => ele.isTrail === 1);
      if (trialData.length) {
        this.trialData = {
          version: '试用版',
          limit: trialData[0].packageInvokeMax,
          count: trialData[0].packageUserMax,
          price: 1,
          time: String(trialData[0].packageTime),
        };
      } // 填充试用版的套餐信息

      if (info.packageColumns) { // 回显从接口获取的类标签选择项
        const packageColumns = JSON.parse(info.packageColumns);
        this.checkedList = [];
        this.columns = [];
        packageColumns.forEach((item) => {
          if (item.value === 1) {
            switch (item.id) {
              case 1:
                this.checkedList.push('version');
                this.columns.push({
                  title: '套餐版本',
                  dataIndex: 'version',
                });
                break;
              case 2:
                this.checkedList.push('limit');
                this.columns.push({
                  title: '套餐配额',
                  dataIndex: 'limit',
                  scopedSlots: { customRender: 'packageInvokeMax' },
                });
                break;
              case 3:
                this.checkedList.push('count');
                this.columns.push({
                  title: '套餐人数',
                  dataIndex: 'count',
                  scopedSlots: { customRender: 'packageUserMax' },
                });
                break;
              case 4:
                this.checkedList.push('price');
                this.columns.push({
                  title: '价格',
                  dataIndex: 'price',
                });
                break;
              case 5:
                this.checkedList.push('time');
                this.columns.push({
                  title: '时间',
                  dataIndex: 'time',
                  scopedSlots: { customRender: 'packageTime' },
                });
                break;
              default:
                break;
            }
          }
        });
      }
    },
    transformTimeUnit(value) { // 处理日月年的时间枚举
      let result = '';
      switch (value) {
        case '天':
          result = 1;
          break;
        case '月':
          result = 2;
          break;
        case '年':
          result = 3;
          break;
        default:
          break;
      }
      return result;
    },
    getPackageOption(cb) { // 通过接口获取参数值修改的选择项
      this.$api.app.getPackageOption(this.applicationId).then((res) => {
        if (res.code === 200) {
          const versionOption = res.result['00'];
          const limitOption = res.result['01'];
          const countOption = res.result['02'];
          const timeOption = res.result['03'];
          this.versionOption = [];
          this.limitOption = [];
          this.countOption = [];
          this.timeOption = [];
          versionOption.forEach((item) => {
            this.versionOption.push({ label: item.paramValue, value: item.paramValue });
          });
          limitOption.forEach((item) => {
            this.limitOption.push({
              label: Number(item.paramValue) === -1 ? '无上限' : `${item.paramValue}次`,
              value: item.paramValue,
            });
          });
          countOption.forEach((item) => {
            this.countOption.push({
              label: Number(item.paramValue) === -1 ? '无上限' : `${item.paramValue}人`,
              value: item.paramValue,
            });
          });
          timeOption.forEach((item) => {
            this.timeOption.push({
              label: Number(item.paramValue) === -1 ? '无上限' : item.paramValue + this.$getters.timeUnit(Number(item.paramUnit)),
              value: Number(item.paramUnit) === 3
              && Number(item.paramValue) !== -1 ? item.paramValue * 12 : item.paramValue,
            });
          });
          if (cb) { cb(); }
        }
      });
    },
    add() { // 添加套餐版本
      const { keys } = this;
      if (this.keys.length >= 5) {
        this.$message.warning('最多只能添加5个套餐版本');
      } else {
        const nextKeys = keys.concat(this.keys.length);
        this.keys = nextKeys;
      }
    },
    remove(k) { // 删除套餐版本
      const { keys } = this;
      if (keys.length === 1) {
        return;
      }
      this.keys = keys.filter(key => key !== k);
    },
    onItemChange(e) { // 选择或取消列标签选择的操作
      const { value } = e.target; // 操作的复选框名称
      const { checked } = e.target; // 是否选中
      if (checked) { // 列标签选中时，在index位插入对应的column列
        let index;
        this.plainOptions.forEach((item, i) => {
          if (item.value === value) {
            index = i;
          }
        });
        this.columns.splice(index, 0, {
          title: this.$getters.packageColumns(value),
          dataIndex: value,
          scopedSlots: { customRender: this.customRender(value) },
        });
      } else { // 列标签取消时，在column删除响应的项
        let index;
        this.columns.forEach((item, i) => { // 根据操作的复选框名称遍历column得到index
          if (item.dataIndex === value) {
            index = i;
          }
        });
        this.columns.splice(index, 1);
      }
    },
    customRender(value) { // 渲染column的customRender字段
      let result = '';
      switch (value) {
        case 'limit':
          result = 'packageInvokeMax';
          break;
        case 'count':
          result = 'packageUserMax';
          break;
        case 'time':
          result = 'packageTime';
          break;
        default:
          break;
      }
      return result;
    },
    indexOfLabel(name) { // 列标签选择是否包选中name字段
      let result = false;
      this.columns.forEach((item) => {
        if (item.dataIndex === name) {
          result = true;
        }
      });
      return result;
    },
    handleSubmit(e) { // 套餐信息提交
      e.preventDefault();
      const packageList = [];
      if (this.dataList[0].version) { // 套餐信息不为空
        if (this.canTrail === 1 && this.trialData.time === null) {
          this.$message.error('试用套餐信息未填写');
        } else {
          const packageColumnList = [ // 根据列标签选择情况构造一个数据传给后端选中列标签的情况
            {
              id: 1,
              name: '套餐版本',
              value: 1,
            }, {
              id: 2,
              name: '套餐配额',
              value: 1,
            }, {
              id: 3,
              name: '套餐人数',
              value: 1,
            }, {
              id: 4,
              name: '价格',
              value: 1,
            }, {
              id: 5,
              name: '时间',
              value: 1,
            },
          ];
          if (this.checkedList.indexOf('version') === -1) {
            packageColumnList[0].value = 0;
          }
          if (this.checkedList.indexOf('limit') === -1) {
            packageColumnList[1].value = 0;
          }
          if (this.checkedList.indexOf('count') === -1) {
            packageColumnList[2].value = 0;
          }
          if (this.checkedList.indexOf('price') === -1) {
            packageColumnList[3].value = 0;
          }
          if (this.checkedList.indexOf('time') === -1) {
            packageColumnList[4].value = 0;
          }
          this.dataList.forEach((item) => { // 根据datalist构造packageList字段传递给后端套餐信息
            packageList.push({
              isTrail: -1,
              packageVersion: this.indexOfLabel('version') ? item.version : '',
              packageInvokeMax: this.indexOfLabel('limit') ? Number(item.limit) : -1,
              packageUserMax: this.indexOfLabel('count') ? Number(item.count) : -1,
              packagePrice: this.indexOfLabel('price') ? Number(item.price) : 0,
              packageTime: this.indexOfLabel('time') ? item.time : -1,
              // packageTimeUnit:
            });
          });
          if (this.canTrail === 1) {
            packageList.push({
              isTrail: 1,
              packageVersion: this.indexOfLabel('version') ? this.trialData.version : '',
              packageInvokeMax: this.indexOfLabel('limit') ? this.trialData.limit : -1,
              packageUserMax: this.indexOfLabel('count') ? this.trialData.count : -1,
              packagePrice: this.indexOfLabel('price') ? this.trialData.price : 0,
              packageTime: this.indexOfLabel('time') ? this.trialData.time : -1,
            });
          }
          const params = { // 封装接口所需参数
            applicationId: this.applicationId,
            packageList,
            canTrail: this.canTrail,
            packageColumnList,
          };
          this.$emit('save', params);
        }
      } else {
        this.$message.error('信息未填写完整');
      }
    },
    handleRemoveTag(removeTagId) { // 参数值修改删除添加的选项
      this.$api.app.removeTag(removeTagId).then((res) => {
        if (res.code === 200) {
          this.getPackageOption();
          this.$message.success('操作成功');
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handleNewTag(paramCode, newTag, paramUnit) { // 参数值修改添加选项
      let paramName = '';
      switch (paramCode) {
        case '00':
          paramName = '套餐版本';
          break;
        case '01':
          paramName = '套餐配额';
          break;
        case '02':
          paramName = '套餐人数';
          break;
        case '03':
          paramName = '套餐时间';
          break;
        default:
          break;
      }
      const params = {
        applicationId: this.applicationId,
        paramCode,
        paramName,
        paramUnit,
        paramValue: newTag,
      };
      this.$api.app.addPackageOption(params).then((res) => {
        if (res.code === 200) {
          this.getPackageOption();
          this.$message.success('操作成功');
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handleBack() {
      this.$emit('back');
    },
  },
};
</script>
<style lang="scss">
.up-btn {
  border: 1px solid #1890ff!important;
  margin-right: 60px;
  a{
    color: #1890ff!important;
  }
}
  .remark{
    padding-top: 15px;
    line-height: 20px;
    // color: #1890ff;
  }
  .info-wrap{
    margin: 10px 0;
  }
</style>
