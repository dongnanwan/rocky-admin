<template>
    <div>
        <!-- <keep-alive> -->
            <component @ondetail="handleDetail" :is="current" :id="id"></component>
        <!-- </keep-alive> -->

        <!-- <button @click="current='Detail'">toggle</button> -->
    </div>
</template>

<script>
import List from './List';
import Detail from './Detail';

export default {
  data() {
    return {
      current: 'List',
      id: 0,
    };
  },
  methods: {
    handleDetail(val, id) {
      this.current = val;
      this.id = id;
    },
  },
  components: {
    List,
    Detail,
  },
  mounted() {
    console.log(this.$route.meta);
  },
};
</script>

<style>
</style>
