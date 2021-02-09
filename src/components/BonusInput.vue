<template>
  <a-row :gutter="10">
    <a-col :span="12">
      <a-select
        :value="type"
        @change="handleTypeChange"
        placeholder="请选择">
        <a-select-option
          v-for="item in $selectOptions.bonusType"
          :value="item.value"
          :key="item.value">{{item.label}}
        </a-select-option>
      </a-select>
    </a-col>
    <a-col :span="12">
      <a-input
        type="number"
        min="0" max="1000"
        :value="amount"
        @change="handleAmountChange"
        addonAfter="元/每个"
      />
    </a-col>
  </a-row>
</template>
<script>
const hasProp = (instance, prop) => {
  const $options = instance.$options || {};
  const propsData = $options.propsData || {};
  return prop in propsData;
};
export default {
  props: ['value'],
  data() {
    const value = this.value || {};
    return {
      type: value.type,
      amount: value.amount,
    };
  },
  watch: {
    value(val = {}) {
      this.type = val.type;
      this.amount = val.amount;
    },
  },
  methods: {
    handleTypeChange(val) {
      const type = val;
      if (isNaN(type)) {
        return;
      }
      if (!hasProp(this, 'value')) {
        this.type = type;
      }
      this.triggerChange({ type });
    },
    handleAmountChange(e) {
      const amount = parseInt(e.target.value || 0, 10);
      if (isNaN(amount)) {
        return;
      }
      if (!hasProp(this, 'value')) {
        this.amount = amount;
      }
      this.triggerChange({ amount });
    },
    triggerChange(changedValue) {
      this.$emit('change', Object.assign({}, this.$data, changedValue));
    },
  },
};
</script>
