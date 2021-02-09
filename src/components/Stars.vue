<template>
  <span class="stars">
    <b class="single" v-for="(item, index) in Math.floor(this.star)" :key="'t'+index">
      <i class="full"></i>
      <i></i>
    </b>
    <b v-if="star !== number" class="single">
      <i class="full" :style="{ width: float * 20 + 'px' }"></i>
      <i></i>
    </b>
    <template v-if="star !== number">
      <b class="single" v-for="(item, index) in number - 1 - Math.floor(this.star)" :key="'b'+index">
        <i></i>
      </b>
    </template>
  </span>
</template>

<script>
export default {
  name: 'stars',
  props: {
    number: {
      default: 5,
      type: Number,
    },
    star: {
      default: 1,
      type: Number,
    },
  },
  computed: {
    float() {
      return parseFloat(this.star - Math.floor(this.star)).toFixed(2);
    },
  },
};
</script>

<style lang="stylus" scoped>
.stars
  display flex
  flex-direction row
  justify-content flex-start
  align-items center
  margin-left 10px
  .single
    margin-right 5px
    i
      display inline-block
      height 20px
      width 20px
      background-image url('../assets/img/grey_star.png')
      background-repeat no-repeat
    .full
      background-image url('../assets/img/star.png')
      position absolute
</style>
