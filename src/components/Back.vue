<template>
  <div class="back flex flex-align-center" @click="$router.go(-1)">
    <a-icon type="left-circle" class="back-icon m10"/>
    <span>返回上一页</span>
  </div>
</template>
<style lang="scss" scoped>
.back{
  width: 180px;
  font-size: 18px;
  padding: 10px;
  // margin-bottom: 10px;
  color: #6b6b6b;
  cursor: pointer;
  .back-icon{
    font-size: 24px;
  }
}
</style>
