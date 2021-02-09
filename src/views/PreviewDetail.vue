<template>
  <div>
    <Header :id="appId" :publish="publish"/>
    <div class="detail-out">
    <div class="detail-wapper">
      <div class="bread-crumb" id="bread-crumb">
        <i>首页</i>  >  <i>企业应用</i>  >  <span>{{appDetail.name}}</span>
      </div>
      <div class="detail-content">
        <div class="d-left">
          <div class="d-left-top">
            <div class="product">
              <div
                class="product-image"
                :style="{backgroundImage: 'url(' + appDetail.applicationImage + ')' }">
              </div>
              <div class="product-detail">
                <div class="title">
                  {{appDetail.name}}
                  <i v-if="!liked" >喜欢收藏</i>
                  <i v-else v-waves class="active" >已收藏</i>
                </div>
                <p>{{appDetail.introduce}}</p>
                <div class="price-wapper">
                    <div class="price">
                      价格： <span>¥ {{currentPackageIdAndPrice.packagePrice}}</span>
                    </div>
                    <div class="star">
                      用户评分： <Stars :star='appDetail.mark' />
                    </div>
                </div>
              </div>
            </div>

            <div class="choice-wapper" v-if="JSON.stringify(packageList) !== '[{}]'">
              <div class="choice-line">
                <div class="title">套餐版本：</div>
                <div class="option">
                  <span
                    @click="changePackage(1, index)"
                    :class="{'active': index === activePackage}"
                    v-for="(item, index) in packageTree" :key="index">{{item.packageVersion}}</span>
                </div>
              </div>
              <div class="choice-line">
                <div class="title">套餐配额：</div>
                <div class="option">
                    <span
                    @click="changePackage(2, index)"
                    :class="{'active': index === packageInvokeMaxIndex}"
                    v-for="(item, index) in packageTree[activePackage].children"
                    :key="index">
                      {{Number(item.packageInvokeMax) === -1?'无上限':item.packageInvokeMax+'套'}}
                    </span>
                </div>
              </div>
              <div class="choice-line">
                <div class="title">购买时间：</div>
                <div class="option">
                  <span
                   @click="changePackage(3, index)"
                   :class="{'active': index === packageTimeIndex}"
                   v-for="(item, index) in
                   packageTree[activePackage].children[packageInvokeMaxIndex].children"
                   :key="index">
                    {{Number(item.packageTime) === -1?'无上限':item.packageTime}}
                    {{$getters.timeUnit(Number(item.packageTimeUnit))}}</span>
                </div>
              </div>
              <div class="choice-line">
                <div class="title">使用人数：</div>
                <div class="option">
                  <span
                    @click="changePackage(4, index)"
                    :class="{'active': index === packageUserMaxIndex}"
                    v-for="(item, index) in packageTree[activePackage]
                      .children[packageInvokeMaxIndex].children[packageTimeIndex].children"
                    :key="index">
                    {{Number(item.packageUserMax) === -1?'无上限':item.packageUserMax+'人'}}
                  </span>
                </div>
              </div>
              <div class="buy-info">
                <div class="btn" v-waves
                >
                  <template v-if="!comfirming">立即购买</template>
                  <template v-else><a-icon type="loading" /></template>
                </div>
                <div class="info">生成备案号条件：必须同时满足订购周期大于12个月和实付金额大于99元</div>
              </div>
            </div>
            <div class="package-not-found" v-else>
              <a-icon type="frown" /> 未找到套餐信息
            </div>
          </div>

          <div class="warning">
              <span class="left">
                <i></i>服务保障
              </span>
              <span class="right">
                <i></i>请勿线下交易！90％的诈骗、纠纷、资金盗取均由线下交易导致
              </span>
          </div>

          <a-affix class="detail" :offsetTop="0" @change="onAffixChange">
            <a-tabs
            defaultActiveKey="1"
            :tabBarStyle="{'paddingLeft':'30px'}"
            v-model="activeTabKey"
            @change="onActiveTabChange">
              <a-tab-pane tab="产品详情" key="1"></a-tab-pane>
              <a-tab-pane tab="系统视频演示" key="2"></a-tab-pane>
              <a-tab-pane tab="套餐介绍" key="3"></a-tab-pane>
              <!-- <a-tab-pane :tab="'评论详情（'+commentsTotal+'）'" key="4"></a-tab-pane> -->
              <div slot="tabBarExtraContent">
                <div class="btn" v-show="affix" v-waves @click="toTop">立即购买</div>
              </div>
            </a-tabs>
          </a-affix>

          <div class="z-tab" id="tab1">
            <h2>产品详情</h2>
            <p class="app-detail" v-html="appDetail.detailInfo"></p>
            <template v-if="appDetail.guideFile">
              <h2 class="mt35">使用指南</h2>
              <a
              :href="appDetail.guideFile"
              target="_blank">
                <div class="btn" v-waves>
                  <i></i>立即下载
                </div>
              </a>
            </template>
            <h2 class="mt35" v-if="appDetail.afterSaleInstruction !== ''">售后范围</h2>
            <div class="aftersale-instruction" v-html="appDetail.afterSaleInstruction"></div>
          </div>
          <div class="z-tab" id="tab2">
            <h2 class="mt15">系统视频演示</h2>
            <video-player
              class="video-player-box vjs-big-play-centered"
              ref="videoPlayer" :options="playerOptions" :playsinline="true">
              </video-player>
          </div>
          <div class="z-tab" id="tab3">
            <h2 class="mt15">套餐介绍</h2>
            <table
              class="table"
              v-if="JSON.stringify(packageList.filter(x => x.isTrail !== 1)) !== '[{}]'">
              <tr class="table-title">
                <td>套餐版本</td>
                <td>配额</td>
                <td>购买方式</td>
                <td>购买周期</td>
                <td>使用人数</td>
                <td>套餐价格</td>
              </tr>
              <tr
                class="table-line"
                v-for="(item, index) in packageList.filter(x => x.isTrail !== 1)" :key="index">
                <td><b>{{item.packageVersion}}</b></td>
                <td>{{item.packageInvokeMax}}</td>
                <td>按次</td>
                <td>{{item.packageTime}}</td>
                <td>{{item.packageUserMax}}</td>
                <td>{{item.packagePrice}}</td>
              </tr>
            </table>
            <div class="no-message" v-else>
              暂无套餐信息
            </div>
            <div class="p30"></div>
          </div>
        </div>
        <div class="d-right">
          <div class="r-provider">
            <img :src="appDetail.providerLogo" alt="">
            <p>{{appDetail.providerName}}</p>
            <div
              class="r-info"
              v-if="appDetail.customerServiceLine !== ''
                && appDetail.customerServiceEmail !== ''
                && appDetail.onlineServiceTime !== ''">
              <div class="r-info-title" v-if="appDetail.customerServiceLine !== ''">
                客服电话：
                <span>{{appDetail.customerServiceLine}}</span>
              </div>
              <div class="r-info-title" v-if="appDetail.customerServiceEmail !== ''">
                客服邮箱：
                <span>{{appDetail.customerServiceEmail}}</span>
              </div>
              <div class="r-info-title" v-if="appDetail.onlineServiceTime !== ''">
                在线时间：
                <span>{{appDetail.onlineServiceTime}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Footer />

 </div>
</template>


<script>
import { videoPlayer } from 'vue-video-player';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'video.js/dist/video-js.css';
import '../assets/css/video-theme.css';
import moment from 'moment';
import axios from 'axios';
import Stars from '@/components/Stars.vue';
import Header from '@/components/PreviewHeader.vue';
import Footer from '@/components/PreviewFooter.vue';


// eslint-disable-next-line import/no-extraneous-dependencies
window.videojs = require('video.js');
// eslint-disable-next-line import/no-extraneous-dependencies
// require('video.js/dist/lang/zh-CN.js');

export default {
  name: 'detail',
  data() {
    return {
      activeTabKey: '1',
      affix: false,
      appId: this.$route.params.id,
      publish: Boolean(this.$route.query.publish) || false,
      appDetail: {},
      canTrail: 0,
      packageList: [{}],

      activePackage: 0,
      packageInvokeMaxIndex: 0,
      packageTimeIndex: 0,
      packageUserMaxIndex: 0,

      packageTree: [{
        children: [{
          children: [{
            children: [{
            }],
          }],
        }],
      }],

      trailFlag: false,

      playerOptions: {
        // language: 'zh-CN',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [],
        poster: '',
      },

      comfirming: false,

      onlyMe: 0,
      liked: false,
      commentsPageNum: 1,
      commentsTotal: 0,
      commentsList: [],
      commentsContent: '',
      commentsStar: 0,
      commentsStarFlag: false,

      alipayCodeUrl: '',
      wechatShareUrl: '',

      recommendList: [],


      requestCount: 2,

      windowWidth: 0,

    };
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    },
    currentPackage() { // 返回当前选中套餐
      const currentPackage = {};
      currentPackage.packageVersion = this.packageTree[this.activePackage].packageVersion;
      // 取得packageVersion
      this.packageTree.forEach((item) => {
        if (currentPackage.packageVersion === item.packageVersion) {
          currentPackage.packageInvokeMax = item.children[this.packageInvokeMaxIndex]
            .packageInvokeMax;
          currentPackage.packageTime = item.children[this.packageInvokeMaxIndex]
            .children[this.packageTimeIndex].packageTime;
          currentPackage.packageUserMax = item.children[this.packageInvokeMaxIndex]
            .children[this.packageTimeIndex].children[this.packageUserMaxIndex].packageUserMax;
        }
      });
      return currentPackage;
    },
    currentPackageIdAndPrice() { // 返回当前选中套餐ID 价格
      let packageId = 0;
      let packagePrice = 0;
      this.packageList.forEach((item) => {
        if (item.packageVersion === this.currentPackage.packageVersion
          && Number(item.packageInvokeMax) === Number(this.currentPackage.packageInvokeMax)
          && Number(item.packageUserMax) === Number(this.currentPackage.packageUserMax)
          && Number(item.packageTime) === Number(this.currentPackage.packageTime)) {
          packageId = item.id;
          // eslint-disable-next-line prefer-destructuring
          packagePrice = item.packagePrice;
        }
      });
      return {
        packageId, packagePrice,
      };
    },
  },
  mounted() {
    this.getAppDetail();
    this.getAppPackages();
    // this.getAppRecommends();

    this.windowWidth = window.screen.width;

    window.onresize = () => {
      this.windowWidth = window.screen.width;
    };
  },
  methods: {
    createPayCode(orderNo) {
      const alipay = axios.post(`${global.config.domain}/mtc/pay/ali_face_pay?orderNo=${orderNo}`);
      const wechatShare = axios.post(`${global.config.domain}/mtc/share/wechat?orderNo=${orderNo}&url=${window.location.href}`);
      Promise.all([alipay, wechatShare]).then((res) => {
        this.trailFlag = true;
        this.comfirming = false;
        this.alipayCodeUrl = res[0].result.url;
        this.wechatShareUrl = window.location.href;
      });
    },
    onCheckBoxChange(e) { // 是否只看自己评论
      this.onlyMe = e.target.checked ? 1 : 0;
    },
    getAppDetail() { // 获取App详情
      axios.post(`${global.config.requestUrl}/mdc/application/manage/get-application-for-preview/${this.appId}`).then((res) => {
        res = res.data;
        this.appDetail = res.result;
        this.canTrail = res.result.canTrail;
        this.liked = res.result.isFavourate === 1;
        this.currentRequestCount += 1;

        this.playerOptions.sources = [{
          src: this.appDetail.presentVideoUrl,
        }];
      });
    },
    commentsStarChange(value) {
      this.commentsStar = value;
      this.commentsStarFlag = true;
    },
    getAppPackages() { // 获取App套餐
      axios.post(`${global.config.requestUrl}/mdc/mall/application/package/${this.appId}`).then((res) => {
        res = res.data;
        this.currentRequestCount += 1;
        if (res.result.length > 0) {
          this.packageList = res.result;
          this.packageList.forEach((item, index) => {
            if (item.isTrail === 1) {
              item.packageVersion = '免费试用';
              this.packageList.splice(index, 1);
              this.packageList.unshift(item);
            }
          });

          const packageListTree = [];
          for (let index = 0; index < this.packageList.length; index += 1) {
            const item = this.packageList[index];
            if (packageListTree.length === 0 || !packageListTree.find(item_1 => item_1.packageVersion === item.packageVersion)) { // 不存在packageVersion
              packageListTree.push({
                packageVersion: item.packageVersion,
                children: [{
                  packageInvokeMax: item.packageInvokeMax,
                  children: [{
                    packageTime: item.packageTime,
                    children: [{
                      packageUserMax: item.packageUserMax,
                    }],
                  }],
                }],
              });
            } else { // 存在了packageVersion,在新节点继续判断下一个（packageInvokeMax）
              packageListTree.forEach((item_2) => {
              // eslint-disable-next-line
              if (item_2.packageVersion == item.packageVersion) {
                  const newItem_2 = item_2.children;
                  if (!newItem_2.find(item_x => item_x.packageInvokeMax === item.packageInvokeMax)) { // 不存在packageInvokeMax
                    newItem_2.push({
                      packageInvokeMax: item.packageInvokeMax,
                      children: [{
                        packageTime: item.packageTime,
                        children: [{
                          packageUserMax: item.packageUserMax,
                        }],
                      }],
                    });
                  } else { // 存在了packageInvokeMax,在新节点继续判断下一个（packageTime）
                    newItem_2.forEach((item_3) => {
                      if (Number(item_3.packageInvokeMax) === Number(item.packageInvokeMax)) {
                        const newItem_3 = item_3.children;
                        if (!newItem_3.find(item_x => item_x.packageTime === item.packageTime)) { // 不存在packageUserMax
                          newItem_3.push({
                            packageTime: item.packageTime,
                            children: [{
                              packageUserMax: item.packageUserMax,
                            }],
                          });
                        } else {
                          newItem_3.forEach((item_4) => { // 存在了packageTime,在新节点继续判断下一个（packageUserMax）
                            if (Number(item_4.packageTime) === Number(item.packageTime)) {
                              const newItem_4 = item_4.children;
                              if (!newItem_4.find(item_x => item_x.packageUserMax === item.packageUserMax)) { // 不存在packageUserMax
                                newItem_4.push({
                                  packageUserMax: item.packageUserMax,
                                });
                              }
                            }
                          });
                        }
                      }
                    });
                  }
                }
              });
            }
          }
          this.packageTree = packageListTree;
        }
      });
    },
    timeRender(data) {
      return moment(data).format('YYYY-MM-DD hh:mm:ss');
    },
    stringRender(data) {
      return `${data.substring(0, 3)}****${data.substring(data.length - 3, data.length)}`;
    },
    changePackage(type, index) {
      switch (type) {
        case 1:
          this.activePackage = index;
          break;
        case 2:
          this.packageInvokeMaxIndex = index;
          break;
        case 3:
          this.packageTimeIndex = index;
          break;
        case 4:
          this.packageUserMaxIndex = index;
          break;
        default:
          break;
      }
    },
    toTop() {
      this.$scrollTo('#bread-crumb', 500);
    },
    onActiveTabChange(key) {
      this.$scrollTo(`#tab${key}`, 500);
    },
    onAffixChange(affix) {
      this.affix = affix;
    },
  },
  components: {
    Stars,
    Footer,
    Header,
    videoPlayer,
  },
};
</script>


<style lang="stylus" scoped>
.trail-code
  display flex
  flex-direction row
  justify-content space-around
  align-items center
  padding 30px 0 0 0
  p
    font-size 14px
    text-align center
    margin-top 10px
    font-weight 400
    color rgba(129,129,129,1)
  .qrcode
    height 168px
    width 168px
    position: relative
    display: inline-block
    .alipay
      position: absolute
      top: 50%
      left: 50%
      width:42px
      height:42px
      margin-left: -21px
      margin-top: -21px
    .wechart
      position: absolute
      top 50%
      left 50%
      width:42px
      height:42px
      margin-left: -21px
      margin-top: -21px
      border 4px solid white
      border-radius 10px

.trail-content
  font-size 14px
  padding-bottom 20px
  border-bottom 1px solid rgba(0,0,0,0.06)
  span
    font-size 24px
    color #FF665B
.trail-title
  font-weight normal
  span
    font-size 12px
    color #FF7777
    display inline-block
    background-color rgba(255,244,244,1)
    padding 0 15px
    border-radius 4px
.submit-comment
  .text-area
    textarea
      border:2px solid #e7e7e7
      border-radius 0
      outline none
    .rest-number
      font-size 12px
      color #BABABA
      text-align right
      position absolute
      z-index 1000
      margin-top: -26px
      margin-left: 717px
      width: 120px
  .submit-comment-btn
    width:78px
    height:30px
    background:rgba(49,113,255,1)
    border-radius:4px
    text-align center
    line-height 30px
    color white
    font-size 12px
    float right
  h3
    font-size 14px
.comments-wapper
  .comment
    border-bottom 1px solid #F0F0F0
    padding 15px 0
    .comment-response
      background rgba(244,244,244,1)
      border-radius 4px
      margin-top 15px
      font-size 12px
      color #A3A3A3
      padding 10px 20px
    .comment-bottom
      font-size 12px
      color #333
      margin-top 15px
    .comment-top
      display flex
      flex-direction row
      justify-content space-between
      align-items center
      .comment-left
        display flex
        flex-direction row
        justify-content space-between
        align-items center
        .star-wapper
          margin-left 80px
          font-size 12px
          display flex
          flex-direction row
          justify-content space-between
          align-items center
        span
          font-size 12px
      .comment-right
        font-size 12px
        color #BABABA
.z-tab
  background-color white
  padding 20px 30px 0 30px
  .aftersale-instruction
    color #A8A8A8
  .app-detail
    p
      word-break break-all
      margin-bottom 0
      img
        max-width 100%
  .table
    width 100%
    display flex
    flex-direction column
    justify-content space-between
    align-items center
    font-size 12px
    border 2px solid rgba(231,231,231,1)
    color #7E7E7E
    .wapper-1
      display flex
      flex-direction row
      justify-content space-around
      align-items center
      .wapper-2
        display flex
        flex-direction row
        justify-content space-around
        align-items center
        .wapper-3
          display flex
          flex-direction row
          justify-content space-around
          align-items center
          .wapper-4
            display flex
            flex-direction row
            justify-content space-around
            align-items center
    .table-line
      width 100%
      display flex
      flex-direction row
      justify-content space-around
      align-items center
      height 38px
      &:nth-child(even)
        background-color #F9F9F9
      td
        width calc(100% / 6)
        text-align center
        &:nth-child(1)
          color #FF8B46
    .table-title
      width 100%
      background-color white
      height 38px
      display flex
      flex-direction row
      justify-content space-around
      align-items center
      td
        width calc(100% / 6)
        text-align center
  .btn
    width 132px
    height 46px
    background rgba(49,113,255,1)
    border-radius 4px
    color white
    line-height 46px
    text-align center
    display flex
    flex-direction row
    justify-content center
    align-items center
    cursor not-allowed
    i
      display inline-block
      width 24px
      height 26px
      background-image url('../assets/img/download.png')
      background-repeat no-repeat
      background-size 100%
      margin-right 5px
  h2
    font-size 18px
    margin-bottom 20px
    padding 0
    font-weight 400
    display flex
    flex-direction row
    justify-content space-between
    align-items center

  p
    margin 0
    padding 0

.detail-out
  display flex
  flex-direction column
  justify-content flex-start
  align-items center
  background-color #F9F9F9
  .detail-wapper
    width 1200px
    padding-top 20px
    padding-bottom 30px
    color #333333
    display flex
    flex-direction column
    justify-content flex-start
    align-items flex-start
    .detail-content
      display flex
      flex-direction row
      justify-content space-between
      align-items flex-start
      width 100%
      margin-top 15px
      .d-left
        // flex 1
        width 912px
        margin-right 15px
        .detail
          margin-top 20px
          background-color white
          .btn
            width 88px
            height 30px
            background rgba(49,113,255,1)
            border-radius 4px
            color white
            text-align center
            line-height 30px
            font-size 14px
            user-select none
            margin-right 20px
            margin-top 11px
            cursor not-allowed
            opacity 1
            transform translateY(0)
            &:hover
              opacity 0.95
        .warning
          height 50px
          background rgba(245,252,255,1)
          display flex
          flex-direction row
          justify-content space-between
          align-items center
          font-size 12px
          .left
            flex 1
            display flex
            flex-direction row
            justify-content flex-start
            align-items center
            padding-left 45px
            i
              display inline-block
              margin-right 10px
              height 18px
              width 18px
              background-image url('../assets/img/baozhang.png')
              background-repeat no-repeat
          .right
            border-left 1px solid #E7E9EE
            flex 1
            display flex
            flex-direction row
            justify-content flex-start
            align-items center
            padding-left 20px
            color #3171FF
            i
              display inline-block
              margin-right 10px
              height 20px
              width 20px
              background-image url('../assets/img/zhuyi.png')
              background-repeat no-repeat
        .d-left-top
          padding 30px 40px
          background-color white
          .package-not-found
            font-size 30px
            color #e8e8e8
            padding 80px 20px
            text-align center
          .choice-wapper
            margin-top 30px
            .buy-info
              display flex
              flex-direction row
              justify-content flex-start
              align-items center
              margin-top 20px
              .btn
                width 160px
                height 46px
                background rgba(49,113,255,1)
                border-radius 4px
                margin-left 80px
                color white
                text-align center
                line-height 46px
                font-size 14px
                user-select none
                cursor not-allowed
                &:hover
                  opacity 0.95
              .info
                margin-left 30px
                font-size 14px
                font-weight 400
                color rgba(166,166,166,1)
            .choice-line
              display flex
              flex-direction row
              justify-content flex-start
              align-items flex-start
              font-size 12px
              margin-bottom 10px
              .title
                width 70px
                color #707070
                margin-right 20px
                margin-bottom 10px
                line-height 30px
                flex-shrink 0
              .option
                span
                  display inline-block
                  user-select none
                  width 100px
                  height 30px
                  border-radius 4px
                  border 1px solid rgba(221,221,221,1)
                  font-size 12px
                  font-weight 400
                  color rgba(51,51,51,1)
                  margin-right 10px
                  text-align center
                  line-height 30px
                  margin-bottom 10px
                  cursor not-allowed
                .active
                  border-color #3171FF
                  color #3171FF
                  &:after
                    content ''
                    display block
                    height 18px
                    width 18px
                    position absolute
                    background-image url('../assets/img/corner.png')
                    margin-top -19px
                    margin-left 81px

          .product
            display flex
            flex-direction row
            justify-content flex-start
            align-items flex-start
            .product-image
              width 280px
              height 190px
              flex-shrink 0
              background-size contain
              background-position center center
              background-repeat no-repeat
            .product-detail
              margin-left 20px
              display flex
              flex-direction column
              justify-content space-between
              align-items flex-start
              width 100%
              height 190px
              p
                font-size 12px
                font-weight 400
                color rgba(166,166,166,1)
                line-height 1.5
                display -webkit-box
                -webkit-box-orient vertical
                -webkit-line-clamp 2
                overflow hidden
              .price-wapper
                background-image url('../assets/img/price_bg.png')
                height 100px
                width 100%
                background-size cover
                display flex
                flex-direction column
                justify-content center
                align-items flex-start
                color #707070
                font-size 12px
                padding-left 40px
                box-sizing border-box
                .price
                  span
                    font-size 22px
                    color #FF665B
                    font-weight 500
                    margin-left 10px
                .star
                  margin-top 20px
                  display flex
                  flex-direction row
                  justify-content center
                  align-items center
              .title
                font-size 22px
                display flex
                flex-direction row
                justify-content flex-start
                align-items center
                i
                  display inline-block
                  cursor not-allowed
                  width 70px
                  height 24px
                  line-height 24px
                  border-radius 4px
                  border 1px solid rgba(255,139,70,1)
                  font-size 12px
                  color #FF8B46
                  text-align center
                  margin-left 20px
                  user-select none
                  font-style normal
                .active
                  background-color rgba(255,139,70,1)
                  color white

      .d-right
        flex-basis 272px
        .r-provider
          display flex
          flex-direction column
          justify-content center
          align-items center
          margin-bottom 20px
          background-color white
          .r-info
            width 100%
            padding 0 20px 15px
            font-size 12px
            .r-info-title
              margin-top 10px
              span
                color #8e8e8e
          img
            width 234px
            border 1px solid rgba(227,227,227,1)
            margin-top 30px
          p
            font-size 12px
            margin-top 12px
        .r-recommend
          background-color white
          padding-top 18px
          padding-bottom 1px
          .card-split
            height 1px
            border-top 1px dashed #E3E3E3
            width 235px
            margin 0 auto
          .card
            display flex
            flex-direction row
            justify-content flex-start
            align-items center
            margin 14px
            cursor pointer
            transition .3s all ease
            &:hover
              background-color rgba(0,0,0,.03)
            .cover
              background-repeat no-repeat
              background-size contain
              background-position center center
              width 108px
              height 68px
              margin-right 10px
            .card-right
              display flex
              flex-direction column
              justify-content space-around
              align-items flex-start
              .c-title
                font-size 12px
                font-weight 400
              .c-star
                color #A5A5A5
                font-size 12px
                margin-top 2px
              .c-price
                color #FF665B
                font-size 14px
                margin-top 7px
          h2
            font-size 14px
            font-weight 400
            display flex
            flex-direction row
            justify-content flex-start
            align-items center
            i
              display inline-block
              width 28px
              height 20px
              background-image url('../assets/img/recommend.png')
              background-repeat no-repeat
              margin-right 10px
    .bread-crumb
      color #9A9A9A
      font-size 14px
      padding-left 40px
      span
        color black
      i
        cursor pointer
        font-style normal
        &:hover
          color #3171ff
</style>
<style>
  .ant-tabs-nav-scroll{
    background: #fff!important;
  }
</style>
