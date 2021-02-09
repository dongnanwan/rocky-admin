<template>
  <div>
    <div class="form_line">
      <label>{{auditStatus.slice(2)}}原因：</label>
      <a-button
        icon="plus"
        style="height:42px;"
        @click="handleRuleVisable(true)">
          添加违反的规则类型
      </a-button>
    </div>
    <a-modal
      width="60vw"
      title="审核规则大纲"
      :visible="visible"
      @cancel="visible = false"
      @ok="handleOk">
      <a-tree checkable @check="onCheck" :selectable="false" defaultExpandAll>
        <a-tree-node v-for="item in ruleData" :key="item.key">
          <span slot="title">{{item.title}}</span>
          <a-tree-node :key="subItem.key" v-for="subItem in item.children">
          <span slot="title">
            <span>
              {{subItem.title}}</span><br/>
            <span>
            {{subItem.desc}}</span>
          </span>
          </a-tree-node>
        </a-tree-node>
      </a-tree>
    </a-modal>
  </div>
</template>
<script>
export default {
  props: {
    auditStatus: {
      type: String,
      default: '',
    },
    ruleData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      checkedKeys: [],
      textArr: [],
      visible: false,
    };
  },
  methods: {
    handleRuleVisable(visible) {
      this.visible = visible;
      if (visible) {
        this.textArr = [];
      }
    },
    onCheck(checkedKeys, info) {
      this.checkedKeys = info.halfCheckedKeys.concat(checkedKeys);
      const index = this.checkedKeys.indexOf('0-1');
      this.checkedKeys.splice(index, 1);
    },
    handleOk() {
      const { textArr } = this;
      this.ruleData.forEach((item) => { // 根据选中的id取出对应的文本值
        this.reduceArr(item, textArr);
        if (item.children.length > 0) {
          item.children.forEach((subItem) => {
            this.reduceArr(subItem, textArr);
          });
        }
      });
      this.visible = false;
      const text = textArr.join('。');
      this.checkedKeys = []; // 清空树组件选项
      this.$emit('submit', text);
    },
    reduceArr(item, textArr) {
      this.checkedKeys.forEach((val) => {
        if (val === item.key) {
          textArr.push(item.title);
          // textArr.push(item.desc);
        }
      });
    },
  },
};
</script>
