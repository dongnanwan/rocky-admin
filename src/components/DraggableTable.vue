<template>
  <div class="ant-table ant-table-body">
    <table class="dataTabble">
      <thead class="ant-table-thead">
      <tr>
        <th class="ant-table-align-center" v-for="(col, i) in columns" :key="i"> {{col.title}}</th>
      </tr>
      </thead>
      <draggable
        class="ant-table-tbody"
        v-model="myDataSource"
        element="tbody"
        :move="getdata"
        @update="datadragEnd"
        v-if="draggable">
        <tr
          class="ant-table-row ant-table-row-level-0"
          v-for="(item,i) in myDataSource" :key="i" id="i">
          <td v-for="(col, j) in columns" :key="j" :style="{'width': col.width}">
            <div v-if="col.scopedSlots">
              <slot :name="col.scopedSlots.customRender" :data="item"></slot>
            </div>
            <div v-else>{{item[col.dataIndex]}}</div>
          </td>
        </tr>
      </draggable>
      <tbody class="ant-table-tbody" v-else>
        <tr
          class="ant-table-row ant-table-row-level-0"
          v-for="(item,i) in myDataSource" :key="i">
          <td v-for="(col, j) in columns" :key="j" :style="{'width': col.width}">
            <div v-if="col.scopedSlots">
              <slot :name="col.scopedSlots.customRender" :data="item"></slot>
            </div>
            <div v-else>{{item[col.dataIndex]}}</div>
          </td>
        </tr>
      </tbody>

    </table>
    <div class="flex flex-justify-end pt10">
      <a-pagination
        :showTotal="total => `共 ${total} 条`"
        v-model="pagination.current"
        :total="pagination.total" @change="onChange"/>
    </div>

  </div>
</template>
<script>
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
  },
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
    pagination: {
      type: Object,
      default() {
        return {};
      },
    },
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
    getdata(evt) {
      this.targetId = evt.draggedContext.element.applicationId;
    },
    datadragEnd() {
      // this.$message.info("成功将【应用" + this.targetId+'】从'+evt.oldIndex+'位置更新到'+evt.newIndex+'位置');
    },
    onChange(current) {
      this.$emit('change', current);
    },
  },
};
</script>
