<template>
  <div>
    <a-input
      v-if="inputVisible"
      ref="input"
      type="text"
      size="small"
      maxlength="20"
      :style="{ width: '78px', height: '30px' }"
      :value="inputValue"
      @change="handleInputChange"
      @blur="handleInputConfirm"
      @keyup.enter="handleInputConfirm"
    />
    <a-tag v-else @click="showInput" style="background: #fff; borderStyle: dashed;">
      <a-icon type="plus" /> 添加标签
    </a-tag>
  </div>
</template>
<script>
export default {
  props: {
    tags: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      inputVisible: false,
      inputValue: '',
    };
  },
  methods: {
    showInput() {
      this.inputVisible = true;
      this.$nextTick(function () {
        this.$refs.input.focus();
      });
    },
    handleInputChange(e) {
      this.inputValue = e.target.value;
    },
    handleInputConfirm() {
      const { inputValue } = this;
      const { tags } = this;
      if (inputValue) {
        const element = tags.filter(item => item.label === inputValue);
        if (element.length > 0) {
          // this.inputVisible = false;
          // this.inputValue = '';
          this.$message.warning('标签名重复！');
        } else {
          this.inputVisible = false;
          this.inputValue = '';
          this.$emit('submit', inputValue);
        }
      }
    },
  },
};
</script>
