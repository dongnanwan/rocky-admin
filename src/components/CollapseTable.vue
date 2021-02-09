<template>
  <div>
    <div class="ant-table ant-table-body p10" v-if="myDataSource.length>0">
      <table class="dataTabble">
        <thead>
          <tr>
            <th class="ant-table-align-center"
              v-for="(col, i) in columns" :key="i"> {{col.title}}</th>
          </tr>
        </thead>
        <tbody class="ant-table-tbody">
          <template v-for="(item,index) in myDataSource">
            <tr
              class="ant-table-row ant-table-row-level-0"
              :data-row-key="index"
              :key="index"
              @click="handleExpand(index)">
              <td v-for="(col, j) in columns" :key="j" :style="{'width': col.width}">
                <div v-if="col.scopedSlots">
                  <slot :name="col.scopedSlots.customRender" :data="item"></slot>
                </div>
                <div v-else>{{item[col.dataIndex]}}</div>
              </td>
              <td class="ant-table-row-expand-icon-cell">
                <a-icon
                  type="caret-right"
                  :rotate="item.expend ? 90 : 0"
                  class="cursor"/>
              </td>
            </tr>
            <tr
              :data-row-key="index+'-extra-row'"
              class="ant-table-expanded-row ant-table-expanded-row-level-1"
              :key="index+'-extra-row'">
              <transition name="slide-fade">
                <td :colspan="columns.length+1" v-show="item.expend">
                  <slot name="expandedRowRender" :data="item"></slot>
                </td>
              </transition>
            </tr>
          </template>
        </tbody>
      </table>
      <div class="flex flex-justify-end pt10" v-if="pagination !== false">
        <a-pagination
          :showTotal="total => `共 ${total} 条`"
          v-model="pagination.current"
          :total="pagination.total" @change="onChange"/>
      </div>
    </div>
    <div v-else>暂无数据</div>
  </div>
</template>
<script>

export default {
  props: {
    columns: {
      type: Array,
      default() {
        return [];
      },
    },
    dataSource: {
      type: Array,
      default() {
        return [];
      },
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    pagination: {},
  },
  computed: {
    myDataSource: {
      get() {
        return this.dataSource;
      },
      set(val) {
        this.$emit('update', val);
      },
    },
  },
  methods: {
    onChange(current) {
      this.$emit('change', current);
    },
    handleExpand(index) {
      const temp = this.myDataSource;
      temp[index].expend = !temp[index].expend;
      this.myDataSource = temp;
    },
  },
};
</script>
<style lang="scss">
.ant-table tr th {
  color: #1585FF;
}
.ant-table tr td, th{
  padding:  15px 20px;
  color: #2B303B;
}
.block {
  display: block;
}
.none {
  display: none;
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to{
  transform: translateY(10px);
  opacity: 0;
}
</style>
