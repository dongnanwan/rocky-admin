<template>
    <div>
        <h2>111</h2>
        <button @click="$emit('click')">add</button>
    </div>
</template>

<script>
import Bus from './bus';

export default {
  mounted() {
    Bus.$on('onmymethod', (val) => {
      console.log(val);
    });
  },
};
</script>

<style>

</style>
