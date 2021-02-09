<template>
<div class="full_page">
  <div class="login">
    <div class="left"></div>
    <div class="right">
      <img src="../assets/img/login-logo.png" alt="" width="180">
      <div>
        <div class="form_list">
          <h3>登 录</h3>
          <div class="title">RockySaaS后端管理系统</div>
          <div>
            <div class="form_item form_line flex">
              <div class="input-wrap">
                <span class="prefix">账户名</span>
                <input
                  class="login-input"
                  type="text"
                  placeholder="请输入账户名"
                  v-model="username"
                  @keyup.enter="handleLogin">
              </div>
            </div>
            <div class="form_item form_line flex">
              <div class="input-wrap">
                <span class="prefix">登录密码</span>
                <input class="login-input"
                type="password"
                placeholder="请输入登录密码"
                v-model="password"
                @keyup.enter="handleLogin">
              </div>
            </div>
            <div class="form_item form_line">
              <div class="input-wrap flex flex-align-center">
                <span class="prefix">验证码</span>
                <input class="login-input mr10" type="text" placeholder="请输入验证码" v-model="imageCode"
                  @keyup.enter="handleLogin">
                <img class="imageCode" :src="imgCodeSrc" alt="" @click="getImgCode">
              </div>
            </div>
            <div class="error_tip mt10">
                <div v-if="error !== ''">
                  * {{error}}
                </div>
            </div>
            <div class="btn_list">
              <div v-if="!logining" class="btn" @click="handleLogin" v-waves>登录</div>
              <div v-else class="btn" v-waves><a-icon type="loading"/></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';

const { Base64 } = require('js-base64');

export default {
  name: 'login',
  data() {
    return {
      logining: false,
      username: '',
      password: '',
      error: '',
      version: '',
      rightPath: '',
      key: '',
      rightList: [],
      permissList: [],
      imageCode: '',
      imgCodeSrc: '',
      menuArr: [],
      navList: [],
    };
  },
  mounted() {
    this.getImgCode();
  },
  methods: {
    getImgCode() {
      this.$api.common.getImgCode().then((res) => {
        if (res.code === 200) {
          this.imgCodeSrc = `data:image/jpeg;base64,${res.result}`;
        }
      });
    },
    loginAxios(Authorization, options, callback) {
      this.$store.commit('setToken', Authorization);
      const params = new URLSearchParams();
      // eslint-disable-next-line
      for (const key in options) {
        if (options[key]) {
          params.append(key, options[key]);
        }
      }
      axios({
        method: 'post',
        url: `${global.config.requestUrl}/muc/auth/form`, // 路径
        data: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).then((res) => {
        callback(res);
      }).catch(() => {
        this.logining = false;
      });
    },
    handleLogin(e) {
      e.preventDefault();
      if (this.username === '') {
        this.error = '请输入用户名';
      } else if (this.password === '') {
        this.error = '请输入密码';
      } else if (this.imageCode === '') {
        this.error = '请输入验证码';
      } else {
        this.error = '';
        this.logining = true;
        const params = {
          username: this.username,
          password: this.password,
          imageCode: this.imageCode,
        };
        const header = `Basic ${Base64.encode(`${global.config.clientId}:${global.config.clientSecret}`)}`;
        this.loginAxios(header, params, (res) => {
          const { data } = res;
          this.logining = false;
          if (data.code === 200) {
            const accessToken = data.result.access_token;
            const tokenType = 'Bearer';
            const token = `${tokenType} ${accessToken}`;
            sessionStorage.setItem('token', token);
            this.$store.commit('setToken', token);

            const refreshToken = data.result.refresh_token;
            // const expiresIn = data.result.expires_in;
            sessionStorage.setItem('access_token', accessToken);
            sessionStorage.setItem('refresh_token', refreshToken);
            this.loginAfter();
          }
        });
      }
    },
    loginAfter() {
      const params = {
        platformCode: 'ADMIN',
      };
      this.$api.common.loginAfter(params).then((res) => {
        if (res.code === 200) {
          const { loginName } = res.result.loginAuthDto;
          sessionStorage.setItem('loginName', loginName);
          const list = res.result.menuList;
          if (list.length === 0) {
            this.$message.error('没有权限！');
          }
          sessionStorage.setItem('list', JSON.stringify(list));
          this.fetchMenu((items) => {
            sessionStorage.setItem('naviItems', JSON.stringify(items));
            this.$store.commit('setNaviItems', items);
          });
          const pwdFlag = res.result.isChangedPwd;
          sessionStorage.setItem('pwdFlag', pwdFlag);
          this.$store.commit('setPwdFlag', pwdFlag);
          if (pwdFlag === 0) {
            this.$router.push('/setting/resetPwd');
          } else {
            // this.$router.push('/');
            this.setNavi(this.navList[0]);
          }
        }
      });
    },
    arrReduce(arr) {
      arr.forEach((item) => {
        if (item.subMenu) {
          this.menuArr.push(item);
          this.arrReduce(item.subMenu);
        } else {
          this.menuArr.push(item);
        }
      });
      return this.menuArr;
    },
    fetchMenu(callback) {
      const list = JSON.parse(sessionStorage.getItem('list'));
      let res = [];
      res = this.arrReduce(list);
      // const this.navList = [];
      res.forEach((value) => {
        if (value.menuCode === 'work_bench') {
          this.navList.push({
            icon: 'dashboard', index: '1', name: '工作台', path: '/',
          });
        }

        // 用户管理;
        if (value.menuCode === 'user') {
          this.navList.push({
            icon: 'user', index: 'sub1', name: '用户管理', subs: [],
          });
        }
        this.fillSubMenuItem(value, 'user_mall', 'sub1', '/userManage/customUserList');
        this.fillSubMenuItem(value, 'user_provider', 'sub1', '/userManage/serverUserList');

        // 应用管理
        if (value.menuCode === 'app') {
          this.navList.push({
            icon: 'appstore-o', index: 'sub2', name: '应用管理', subs: [],
          });
        }
        this.fillSubMenuItem(value, 'app_release', 'sub2', '/appManage/appHasPublish');
        this.fillSubMenuItem(value, 'app_dismount', 'sub2', '/appManage/appHasAnnuled');
        this.fillSubMenuItem(value, 'app_audit_list', 'sub2', '/appManage/AppExamine');

        // 小程序模板
        if (value.menuCode === 'miniprogram') {
          this.navList.push({
            icon: 'flag', index: 'sub3', name: '小程序模板', subs: [],
          });
        }
        this.fillSubMenuItem(value, 'miniprogram_template', 'sub3', '/AppletTemplate/templateList');
        this.fillSubMenuItem(value, 'miniprogram_case', 'sub3', '/AppletTemplate/CaseList');

        // 网站建设
        if (value.menuCode === 'website') {
          this.navList.push({
            icon: 'global', index: 'sub4', name: value.menuName, subs: [],
          });
        }
        this.fillSubMenuItem(value, 'website_template', 'sub4', '/WebsiteManage/TemplateList');
        this.fillSubMenuItem(value, 'website_case', 'sub4', '/WebsiteManage/CaseList');

        // 商城管理
        if (value.menuCode === 'mall') {
          this.navList.push({
            icon: 'shop', index: 'sub5', name: value.menuName, subs: [],
          });
        }
        this.fillSubMenuItem(value, 'mall_label', 'sub5', '/MailManage/NavLabels');
        this.fillSubMenuItem(value, 'mall_newlist', 'sub5', '/MailManage/NewOnline');
        this.fillSubMenuItem(value, 'mall_hotlist', 'sub5', '/MailManage/HotList');
        this.fillSubMenuItem(value, 'mall_bestlist', 'sub5', '/MailManage/TopList');
        // this.fillSubMenuItem(value, 'mall_industrylist', 'sub5', '/MailManage/HotIndustryList')
        this.fillSubMenuItem(value, 'mall_cloud_market_recommend_list', 'sub5', '/MailManage/CloudRecomend');

        this.fillSubMenuItem(value, 'mall_providerlist', 'sub5', '/MailManage/ProviderList');

        // 订单管理
        if (value.menuCode === 'order') {
          this.navList.push({
            icon: 'file-text', index: 'sub6', name: value.menuName, subs: [],
          });
        }
        this.fillSubMenuItem(value, 'order_list', 'sub6', '/OrderManage/OrderList');

        // 财务管理 finance
        if (value.menuCode === 'finance') {
          this.navList.push({
            icon: 'pay-circle', index: 'sub7', name: value.menuName, subs: [],
          });
        }
        this.fillSubMenuItem(value, 'finance_in_serial', 'sub7', '/FinanceManage/AccountFlow');
        this.fillSubMenuItem(value, 'provider_settle_report', 'sub7', '/FinanceManage/ProviderSettle');
        this.fillSubMenuItem(value, 'provider_settle_audit', 'sub7', '/FinanceManage/SettleAuditList');


        // 客户管理
        if (value.menuCode === 'customer-manage') {
          this.navList.push({
            icon: 'user', index: 'sub11', name: value.menuName, subs: [],
          });
        }
        this.fillSubMenuItem(value, 'customer-manage-trail', 'sub11', '/CustomerManage/AppliationList');
        this.fillSubMenuItem(value, 'my_customer_orders', 'sub11', '/CustomerManage/my_customer_orders');
        this.fillSubMenuItem(value, 'help_customer_orders', 'sub11', '/CustomerManage/help_customer_orders');

        // 审核管理 audit
        if (value.menuCode === 'audit') {
          this.navList.push({
            icon: 'solution', index: 'sub8', name: value.menuName, subs: [],
          });
        }
        this.fillSubMenuItem(value, 'provider_realname_auth', 'sub8', '/ExamineManage/ProviderAuth');
        this.fillSubMenuItem(value, 'app_dismount_apply', 'sub8', '/ExamineManage/AppAnnuled');

        // 运营管理  operate  operate_activity
        if (value.menuCode === 'operate') {
          this.navList.push({
            icon: 'trademark', index: 'sub9', name: value.menuName, subs: [],
          });
        }
        this.fillSubMenuItem(value, 'operate_activity', 'sub9', '/OperationManage/ActivityList');
        this.fillSubMenuItem(value, 'operate_bonus', 'sub9', '/OperationManage/CouponsList');
        this.fillSubMenuItem(value, 'operate_advertise', 'sub9', '/OperationManage/AdSetting');


        // 系统管理  system system_account_manage
        if (value.menuCode === 'system') {
          this.navList.push({
            icon: 'setting', index: 'sub10', name: value.menuName, subs: [],
          });
        }
        this.fillSubMenuItem(value, 'system_account_manage', 'sub10', '/setting/account');
        this.fillSubMenuItem(value, 'system_role_manage', 'sub10', '/setting/role');

        // 我的审核
        if (value.menuCode === 'my_audit') {
          this.navList.push({
            icon: 'solution', index: 'sub12', name: value.menuName, subs: [],
          });
        }
        this.fillSubMenuItem(value, 'my_application_audit', 'sub12', '/MyExamine/MyAppExamine');
        this.fillSubMenuItem(value, 'my_realname_audit', 'sub12', '/MyExamine/MyAuthExamine');
      });
      this.$store.commit('setNaviItems', this.navList);
      if (callback) { callback(this.navList); }
    },
    fillSubMenuItem(item, code, index, path) {
      if (item.menuCode === code) {
        this.navList.filter(ele => ele.index === index)[0]
          .subs.push({ index: item.id, name: item.menuName, path });
      }
    },
    setNavi(arr) { // 遍历菜单，取出第一个页面的路由以及id
      const self = this;
      if (arr.subs) {
        self.$store.dispatch('updateNaviData', { key: String(arr.index), subKey: false });
        this.key = String(arr.index);
        self.setNavi(arr.subs[0]);
      } else {
        self.$store.dispatch('updateNaviData', { key: false, subKey: String(arr.index) });
        self.path = arr.path;

        this.$store.dispatch('onOpenPagesChange', {
          path: arr.path,
          name: arr.name,
          init: false,
          key: String(arr.index),
          subKey: this.key,
          belongPath: null,
        });
        // return false;
      }
      this.$router.push(this.path);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/css/mixin.scss';
// @import url('../assets/css/mixin.scss');
$borderRadius: 3px;
$borderRadiusInput: 5px;
$loginWapperHeight:764px;
.render_extra_footer{
  @include center(row, center);
  color: $mainColor
}
.full_page{
  height: 100vh;
  width: 100vw;
  @include center(row, center);
  background:rgba(247,247,247,1);
  // @include bg('../assets/img/login_bg.png');
  .login{
    height: $loginWapperHeight;
    border-radius: $borderRadius;
    width: 1280px;
    @include center(row, center);
    // @include bg('../assets/img/login1.png');
    background:url('../assets/img/login_bg1.png') no-repeat;
    box-shadow: 0 0 20px rgba($color: #000000, $alpha: .15);
    .title {
      color: #4452d5;
      font-size: 16px;
    }
    .left{
      height: $loginWapperHeight;
      width: 602px;
      border-top-left-radius: $borderRadius;
      border-bottom-left-radius: $borderRadius;
    }
    .right {
      height: $loginWapperHeight;
      flex: 1;
      border-top-right-radius: $borderRadius;
      border-bottom-right-radius: $borderRadius;
      padding: 51px;
      background-color: white;
      // display: flex;
      // flex-direction: column;
      // justify-content: space-around;
      div{
        text-align: left;
        margin: auto;
        // @include center(column, space-around);
        .form_list{
          width: 422px;
          margin-top: 50px;
          .label{
            flex: 0 0 80px;
            text-align: right;
            color: darkgrey;
          }
          .form_line{
            @include center(row, center);
            box-sizing: border-box;
            margin: 20px 0;
            .input-wrap{
              width:422px;
              position: relative;
              .prefix {
                position: absolute;
                left: 30px;
                top: 15px;
                color: #000;
              }
              input.ant-input {
                height: 68px!important;
              }
            }
            .border{
              border: 1px solid #ccc;
              border-radius: $borderRadiusInput;
              background: transparent;
            }
            .input-flex{
              width: 100%;
              box-sizing: border-box;
            }
            .input-fixed{
              width: 150px;
              margin-right: 10px;
            }
            .input{
              padding: 3px 10px;
              line-height: 28px;
              font-size: 13px;
              outline: none;
              letter-spacing: 1px;
            }
            .button{
              width: 92px;
              cursor: pointer;
              color: $mainColor;
              border: 1px solid $mainColor;
              border-radius: $borderRadiusInput;
              background: transparent;
            }
            .disable{
              border: 1px solid #ccc;
              cursor: not-allowed;
              background: #ccc;
              color: #fff;
            }
          }
        }
      }
      .version{
        color: rgba($color: #000000, $alpha: .3)
      }
      .error_tip{
        font-size: 12px;
        margin-left: 25px;
        height: 18px;
        color: crimson;
      }
      .btn_list{
         width: 442px;
        .btn{
          width: 442px;
          background: #1585FF;
          height: 50px;
          line-height: 50px;
          font-size:16px;
          // background: linear-gradient(to right, #52c41a, #1da57a );
          // background: linear-gradient(to right, #4eafe0 , #7a83ec);
          color: white;
          box-shadow: 0 0 20px rgba($color: #000000, $alpha: .1);
          text-align: center;
          // padding: 7px 5px;
          user-select: none;
          transition: .3s opacity ease-in-out;
          cursor: pointer;
          &:hover,
          &:active{
            opacity: .9;
          }
        }
      }
      h3{
        text-align: center;
        margin-top: 20px;
        font-size:32px;
        font-family:SourceHanSansCN-Regular,SourceHanSansCN;
        font-weight:400;
        color:rgba(0,0,0,1);
        line-height:48px;
      }
      .title {
        height: 38px;
        line-height: 38px;
        border-left: 6px solid #1585FF;
        padding-left: 15px;
        font-size:20px;
        margin: 30px 0;
        font-family:MicrosoftYaHei;
        color:rgba(0,0,0,1);
      }
    }
  }
}
.imageCode{
  cursor: pointer;
}
.login-input {
  width:422px;
  height:50px;
  border:1px solid rgba(231,231,231,1);
  padding-left: 120px;
  // border: none;
}
input.login-input::-webkit-input-placeholder {
  color: #000;
}
input::-moz-input-placeholder {
  color: #000;
}
input::-ms-input-placeholder {
  color: #000;
}
</style>
