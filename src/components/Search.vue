<template>
  <div class="wrap">
    <div class="page_border white-bg filter_bar">
      <!-- 遍历筛选项 -->
      <div v-for="(item, i) in searchDataReal" :key="i" class="filter_wapper">
        <div v-if="item.type === 'input'" class="flex flex-align-center">
          <span :class="{highlight:item.value!==''}">{{item.label}}：</span>
          <span>
            <!-- <s-input
              class='common_filter_input_width'
              :width="item.width || 190"
              v-model="item.value"
              :maxlength="item.maxlength"
              onKeyUp="value=value.replace(/[^\d]/g,'') "
              onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))"
              v-if="item.ifnum"/> -->
            <s-input
              class='common_filter_input_width'
              :width="item.width || 190"
              v-model="item.value"
              :maxlength='item.maxlength'/>
          </span>
        </div>
        <div v-if="item.type === 'select'" class="flex flex-align-center">
          <span :class="{highlight:item.value!==''}">{{item.label}}：</span>
          <s-select v-model="item.value" class='common_filter_input_width' @change="item.onChange" :options="item.option" v-if="item.onChange">
          </s-select>
          <s-select v-model="item.value" class='common_filter_input_width' :options="item.option" v-else>
          </s-select>
        </div>
        <div v-if="item.type === 'rangePicker'">
          <span :class="{highlight:item.value.length!==0}">{{item.label}}：</span>
          <s-range-picker
            class="common_filter_daterange_width"
            v-model="item.value" format="YYYY-MM-DD"/>
        </div>
        <div v-if="item.type === 'doubleInput'">
          <span :class="{highlight:item.value[0]!==''}">{{item.label}}：</span>
          <span>
            <s-input class='common_filter_input_width_small' v-model="item.value[0]" maxlength='4'/>
          </span>
          <span class="ml10 mr10">-</span>
          <span>
            <s-input class='common_filter_input_width_small' v-model="item.value[1]" maxlength='4'/>
          </span>
        </div>
      </div>
      <!-- 按钮 -->
      <div class="filter_wapper">
        <a-button type="primary" icon="search" @click="search" :style="{height: '40px', width:'130px'}">
          <span>查询</span>
        </a-button>
        <a-button class="ml20" icon="retweet" @click="clearFilter" :style="{height: '40px', width:'130px'}">
          <span>重置</span>
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
// import { SaaSButton, SaaSInput } from 'rockysaasui';
export default {
  // components: {
  //   saasInput: SaaSInput,
  // },
  data() {
    return {
      searchDataReal: [],
    };
  },
  props: {
    searchData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    filter(val, oldVal) {
      this.$emit('change', val, oldVal);
    },
    searchData(val) {
      this.$nextTick(() => {
        this.searchDataReal = val;
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.searchDataReal = this.searchData;
    });
  },
  computed: {
    filter() {
      const obj = {};
      this.searchDataReal.forEach((item) => {
        obj[item.attr] = item.value;
      });
      return obj;
    },
  },
  methods: {
    clearFilter() {
      const data = this.searchDataReal;

      Object.keys(data).forEach((key) => {
        if (data[key].type === 'select') {
          data[key].value = '';
          if (data[key].label === '应用类型') {
            data[key].option = [];
          }
        } else if (data[key].type === 'rangePicker') {
          data[key].value = [];
        } else if (data[key].type === 'doubleInput') {
          data[key].value = ['', ''];
        } else {
          data[key].value = '';
        }
      });
      this.search();
    },
    search() {
      this.$emit('search', this.filter);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../assets/css/mixin.scss';
.highlight{
  color: $mainColor;
}
.filter_bar{
  .filter_wapper{
    span:nth-child(1){
      display: inline-block;
    }
    display: inline-block;
    font-size: 13px;
    margin: 6px 15px;
  }
}
// .common_filter_input_width {
//     width: 190px !important;
// }
</style>
