<template>
    <div>
        <!-- <keep-alive> -->
            <component @ondetail="handleDetail" :is="current" :app="app"></component>
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
      app: {},
    };
  },
  methods: {
    handleDetail(val, app) {
      this.current = val;
      this.app = app;
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
