<template>
  <div class="common_page_wapper white-bg">
    <Back></Back>
    <a-form
      :form="form"
      @submit="handleSubmit"
    >
      <a-form-item
        label="活动名称"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 8 }"
      >
        <a-input
          v-decorator="[
            'name',
            {rules:$mixRule.execute($mixRule.rules.whitespace, $mixRule.message.requiredInput)}
          ]"
          placeholder="请输入活动名称"
        />
      </a-form-item>
      <a-form-item
        label="活动奖励"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 8 }"
      >
        <bonus-input
          @change="handleInputChange"
          v-decorator="[
            'bonus',
            {
              initialValue: { type: 1, amount: 10 },
              rules: [{ validator: checkValue, required: true, message: '格式错误或未输入' }],
            }
          ]"
        ></bonus-input>
      </a-form-item>
      <a-form-item
        label="有效天数"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 8 }"
        v-if="bounsType === 2"
      >
        <a-input
          v-decorator="[
            'validDays',
          ]"
          addonAfter="天"
          placeholder="请输入有效天数"
        />
      </a-form-item>
      <a-form-item
        label="使用门槛"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 8 }"
         v-if="bounsType === 2"
      >
        <a-input
          v-decorator="[
            'amountStart',
          ]"
          addonAfter="元"
          placeholder="请输入使用门槛"
        />
      </a-form-item>
      <a-form-item
        label="每日发送上限"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 8 }"
      >
        <a-input
          v-decorator="[
            'quantityLimit',
            {rules:$mixRule.execute($mixRule.rules.whitespace, $mixRule.message.requiredInput)}
          ]"
          placeholder="请输入每日发送上限"
        />
      </a-form-item>
      <a-form-item
        label="活动时间"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 8 }"
      >
        <a-range-picker
          v-decorator="[
            'time',
            {rules:$mixRule.execute($mixRule.rules.required, $mixRule.message.requiredSpecial)}
          ]"
        />
      </a-form-item>
      <a-form-item
        label="用户对象"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 8 }"
      >
        <a-select
          v-decorator="[
            'targetUser',
            {rules:$mixRule.execute($mixRule.rules.required, $mixRule.message.requiredSpecial)}
          ]"
          placeholder="请选择">
          <a-select-option
            v-for="item in $selectOptions.targetUser"
            :value="item.value"
            :key="item.value">{{item.label}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="指定服务商"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 8 }"
      >
        <a-select
          v-decorator="[
            'targetProviderId',
          ]"
          @change="handleChange"
          placeholder="请选择">
          <a-select-option
            v-for="item in [{value: '', label: '请选择'}].concat(providerList)"
            :value="item.value"
            :key="item.value">{{item.label}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="指定类别"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 8 }"
      >
         <a-cascader
          v-decorator="['type',
           {rules: [{ validator: checkType, }, ]},
           ]"
          expandTrigger="hover"
          :options="options"
          :loadData="loadData"
          @change="onChange"
          placeholder="请选择"
          changeOnSelect
        />
      </a-form-item>
      <a-form-item
        label="指定应用"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 8 }"
      >
        <a-select
          v-decorator="[
            'targetApplicationId'
          ]"
          placeholder="请选择">
          <a-select-option
            v-for="item in appList"
            :value="item.value"
            :key="item.value">{{item.label}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="活动链接"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 8 }"
      >
        <a-input
          v-decorator="[
            'activityLink'
          ]"
          placeholder="请输入活动链接"
        />
      </a-form-item>
      <a-form-item
        :wrapper-col="{ span: 8, offset:7 }"
      >
        <a-button
          size="large" style="width:180px"
          type="primary"
          html-type="submit"
        >
          保存
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import moment from 'moment';
import { mapState } from 'vuex';
import Back from '../../components/Back.vue';
import BonusInput from '../../components/BonusInput.vue';

export default {
  components: { Back, BonusInput },
  data() {
    return {
      // providerList: '',
      form: this.$form.createForm(this),
      targetProductTypeLabel: '',
      targetApplicationTypeLabel: '',
      targetIndustryLabel: '',
      appList: [{ value: '', label: '请选择' }],
      bounsType: 1,
      providerName: '',
      dateString: [],
    };
  },
  computed: {
    ...mapState(['moduleOptions', 'classifyOptions', 'industryOptions', 'optionsFetched', 'providerList']),
    options: {
      get() {
        const result = [];
        this.moduleOptions.forEach((element) => {
          result.push({ label: element.label, value: element.value, isLeaf: false });
        });
        return result;
      },
      set() {},
    },
  },
  mounted() {


  },
  methods: {
    moment,
    // handleTimeChange(date, dateString) {
    //   this.dateString= dateString;
    // },
    checkType(rule, value, callback) {
      if (!value || value.length === 2 || value.length === 3) {
        callback();
        return;
      }
      callback('必须选择应用类型');
    },
    displayRender({ labels }) {
      return labels[labels.length - 1];
    },
    handleChange(val) {
      const res = this.providerList.filter(item => item.value === val);
      if (res.length > 0) {
        this.providerName = res[0].label;
      }
    },
    handleInputChange(val) {
      if (val.type) {
        this.bounsType = val.type;
      }
    },
    checkValue(rule, value, callback) {
      if (value.type && value.amount > 0) {
        callback();
        return;
      }
      callback('输入错误或格式不正确');
    },
    onChange(value) {
      /* eslint-disable */
      this.targetProductTypeLabel = value[0];

      this.targetApplicationTypeLabel = value[1];

      this.targetIndustryLabel = value[2];
      if (this.targetProductTypeLabel && this.targetApplicationTypeLabel) {
        this.fetchAppList();
      }
    },
    loadData(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;
      if (selectedOptions.length === 1) {
        this.$store.dispatch('fetchClassifyOptions', targetOption.value);
        targetOption.loading = false;
        /* eslint-disable */
        this.classifyOptions.forEach((item) => { item.isLeaf = false; });
        targetOption.children = this.classifyOptions;
        this.options = [...this.options];
      } else if (selectedOptions.length === 2) {
        targetOption.loading = false;
        targetOption.children = this.industryOptions;
        this.options = [...this.options];
      }
    },
    fetchAppList() {
      const params = {
        type: 0,
        productTypeLabelId: this.targetProductTypeLabel,
        applicationTypeLabelId: this.targetApplicationTypeLabel,
        industryLabelId: this.targetIndustryLabel,
      };
      this.appList = [{ value: '', label: '请选择' }];
      this.$api.mailManage.appFilterClassify(params).then((res) => {
        if (res.code === 200) {
          res.result.forEach((item) => {
            this.appList.push({ value: item.applicationId, label: item.applicationName });
          });
        }
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          const params = {
            ...values,
            bonusType: values.bonus.type,
            amount: values.bonus.amount,
            activityStartTime: this.$utils.dateRangeFormat(values.time, 'begin'),
            activityEndTime: this.$utils.dateRangeFormat(values.time, 'end'),
            // activityStartTime:this.dateString[0],
            // activityEndTime:this.dateString[1],
            targetProductTypeLabel: this.targetProductTypeLabel,
            targetApplicationTypeLabel: this.targetApplicationTypeLabel,
            targetIndustryLabel: this.targetIndustryLabel,
            targetProviderName: this.providerName,
          };
          delete params.bonus;
          delete params.time;
          this.$api.operation.activityAdd(params).then((res) => {
            if (res.code === 200) {
              this.$router.go(-1);
            } else {
              this.$message.error(res.message);
            }
          });
        }
      });
    },
  },
};
</script>
