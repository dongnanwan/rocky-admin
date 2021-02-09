<template>
  <div>
    <template v-for="(tag, index) in tags">
      <a-tag :key="index" :closable="Number(tag.applicationId) !== 0" :afterClose="() => handleClose(tag.configId)">
        {{Number(tag.label) === -1 ? '无上限':tag.label}}
      </a-tag>
    </template>
    <span v-if="inputVisible">
      <a-input
        ref="input"
        :type="paramCode == '00'? 'text': 'number'"
        size="small"
        :style="{ width: '78px' }"
        :value="inputValue"
        @change="handleInputChange"
        @blur="handleInputConfirm"
        @keyup.enter="handleInputConfirm"
      />
    </span>
    <a-tag v-else @click="showInput" style="width: 120px; background: #fff; borderStyle: dashed;">
      <a-icon type="plus" /> 新标签
    </a-tag>
  </div>
</template>
<script>
export default {
  props: {
    applicationId: {
      type: String,
      default: '0',
    },
    tags: {
      type: Array,
      default() {
        return [];
      },
    },
    paramCode: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      myTags: this.tags,
      inputVisible: false,
      inputValue: '',
    };
  },
  computed: {

  },
  methods: {
    unit(paramUnit) {
      let result;
      switch (this.paramCode) {
        case '01':
          result = '次调用';
          break;
        case '02':
          result = '人';
          break;
        case '03':
          result = this.$getters.timeUnit(Number(paramUnit));
          break;
        default:
          result = '';
          break;
      }
      return result;
    },
    handleClose(removedTag) {
      // const tags = this.myTags.filter(tag => tag.configId !== removedTag);
      // this.myTags = tags;
      this.$emit('remove', removedTag);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },

    handleInputChange(e) {
      if (String(e.target.value) === '-1') {
        this.$message.warning('不能输入-1');
        return;
      }
      if (this.paramCode === '03') {
        if (e.target.value > 12 && e.target.value % 12 !== 0) {
          this.$message.warning('大于年的时间请输入12月的整数倍');
          return;
        }
      }
      this.inputValue = e.target.value;
    },
    handleInputConfirm() {
      const { inputValue } = this;
      if (!inputValue) {
        return false;
      }
      Object.assign(this, {
        inputVisible: false,
        inputValue: '',
      });
      this.$emit('change', this.paramCode, inputValue);
    },
  },
};
</script>
