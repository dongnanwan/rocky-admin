<template>
<div class="preview-wrap">
  <div class="img-wrap" @click="handlePreview">
    <img class="img" :src="imgPath" alt="">
    <div class="mask"></div>
    <div class="text">
      <img src="../assets/img/ck@2x.png" alt="" width="18" height="18" v-if="imgPath">
      <p class="ml5">{{imgPath?'点击查看':'无数据'}}</p>
    </div>
  </div>
  <a-modal :visible="visible" :footer="null" @cancel="visible=false">
    <img alt="example" style="width: 100%" :src="imgPath" />
  </a-modal>
</div>
</template>
<script>
export default {
  props: {
    imgPath: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    handlePreview() {
      if (this.imgPath) {
        this.visible = true;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
  .preview-wrap{
    display: inline-block;
    width: 122px;
    height: 50px;
  }
  .img-wrap{
    width: 122px;
    height: 50px;
    display: inline-block;
    position: relative;
    overflow: hidden;
    border-radius:4px;
    cursor: pointer;
  }
  .img{
    width: 122px;
    height: 50px;
  }
  .mask{
    position: absolute;
    top: 0;
    left: 0;
    width: 122px;
    height: 50px;
    background:rgba(31,29,29,1);
    border-radius:4px;
    opacity:0.59;
  }
  .text{
    position: absolute;
    top: 0;
    left: 0;
    width: 122px;
    height: 50px;
    color: #fff;
    text-align: center;
    line-height: 50px;
    font-size:12px;
    font-family: MicrosoftYaHei;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
