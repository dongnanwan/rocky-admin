<template>
  <div class="footer-out">
    <div class="footer-wapper">
      <div class="line border-bottom">
        <span>
          <i class="icon icon-db"></i>
          担保交易
        </span>
        <span>
          <i class="icon icon-fw"></i>
          服务全程监管
        </span>
        <span>
          <i class="icon icon-ty"></i>
          一站式体验服务
        </span>
        <span>
          <i class="icon icon-jx"></i>
          精选优质服务商
        </span>
      </div>
      <div class="line-down">
        <div class="list">
          <span class="title">
            <a>服务商入驻流程</a>
            <!-- <router-link to="/entryProcess">服务商入驻流程</router-link> -->
          </span>
        </div>
        <div class="list">
          <span class="title">
            <a>服务商入驻条件</a>
            <!-- <router-link to="/settlementConditions">服务商入驻条件</router-link> -->
          </span>
        </div>
        <div class="list">
          <span class="title">
            <a>申请成为服务商</a>
            <!-- <router-link to="/settlementConditions">申请成为服务商</router-link> -->
          </span>
        </div>
        <div class="list">
          <span class="title">
            <a>关于我们</a>
            <!-- <a href="http://www.rockysaas.com/about" target="_blank">关于我们</a> -->
          </span>
        </div>
      </div>
      <div class="copy-right">
        Copyright © 2004-2019 浙江盘兴信息技术有限公司及 All Rights Reserved 浙ICP备18048879号-2
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'the-footer',
  data() {
    return {

    };
  },
  mounted() {

  },
  methods: {

  },
  components: {

  },
};
</script>


<style lang="stylus" scoped>
.footer-out
  display flex
  flex-direction column
  justify-content flex-start
  align-items center
  height 330px
  background-color #2B303B
  .copy-right
    font-size 12px
    color #707580
    text-align center
    margin-top 50px
  .footer-wapper
    width 1200px
    .line-down
      display flex
      flex-direction row
      justify-content space-between
      align-items center
      .list
        display flex
        flex-direction column
        margin-top 50px
        width 25%
        text-align center
        span
          color #707580
          font-size 14px
          margin-bottom 10px
        .title
          a
            color white
            font-size 16px
            margin-bottom 20px
            &:hover
              opacity .7

    .border-bottom
      border-bottom 1px solid white
    .line
      display flex
      flex-direction row
      justify-content space-between
      align-items center
      color white
      padding 40px 0 30px 0
      span
        font-size 16px
        width 25%
        display flex
        flex-direction row
        justify-content flex-start
        align-items center
        i
          display inline-block
          height 56px
          width 56px
          margin-right 20px
        .icon-db
          background-image url('../assets/img/db.png')
        .icon-fw
          background-image url('../assets/img/fw.png')
        .icon-ty
          background-image url('../assets/img/ty.png')
        .icon-jx
          background-image url('../assets/img/jx.png')
  a
    cursor not-allowed
</style>
