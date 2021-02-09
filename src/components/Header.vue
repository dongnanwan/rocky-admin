<template>
  <a-layout-header
    class="header-wrap">
    <!-- <a-icon
      class="trigger"
      :type="collapsed ? 'menu-unfold' : 'menu-fold'"
      @click="statusChange"
    /> -->
    <div class="info-right">
      <!-- <a-dropdown> -->
        <span class="avatar-wrap hover">
          <span class="avatar">
            <img src="../assets/img/avatar.png" alt="avatar">
          </span>
          <span class="name btn">
            {{loginName}}!
          </span>
        </span>
        <!-- <a-menu slot="overlay">
          <a-menu-item>
            <router-link to="/setting/resetPwd">修改密码</router-link>
          </a-menu-item>
          <a-sub-menu title="更换主题" key="test">
            <a-menu-item>
              <span class="flex flex-align-center" @click="changeTheme('#F5222D')">
                <i  class="block" style="background: #F5222D"></i>日暮
              </span>
            </a-menu-item>
            <a-menu-item>
              <span class="flex flex-align-center"  @click="changeTheme('#13C2C2')">
                <i class="block" style="background: #13C2C2"></i>明清
                </span>
            </a-menu-item>
            <a-menu-item>
              <span class="flex flex-align-center"  @click="changeTheme('#52C41A')">
                <i class="block" style="background: #52C41A"></i>极光绿
                </span>
            </a-menu-item>
            <a-menu-item>
              <span class="flex flex-align-center"  @click="changeTheme('#1890FF')">
                <i class="block" style="background: #1890FF"></i>拂晓蓝
              </span>
            </a-menu-item>
            <a-menu-item>
              <span class="flex flex-align-center"  @click="changeTheme('#2F54EB')">
                <i class="block" style="background: #2F54EB"></i>极客蓝
              </span>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-dropdown> -->

      <!-- <span class="setting hover">
        <a-dropdown>
          <a class="ant-dropdown-link" href="#">
           <a-icon type="setting"/>
          </a>
          <a-menu slot="overlay">

          </a-menu>
        </a-dropdown>
      </span> -->
      <span class="hover btn">
        <span style="text-align: center;">
          <router-link to="/setting/resetPwd"><span class="btn">修改密码</span></router-link>
        </span>
      </span>
      <span class="hover btn" @click="logout">
        <span style="text-align: center;">
          退出
          <!-- <a-icon type="logout" /> -->
        </span>
      </span>
    </div>
  </a-layout-header>
</template>
<script>
export default {
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    loginName() {
      return sessionStorage.getItem('loginName') || '真实姓名';
    },
    sayHiMsg() {
      const now = new Date();
      const hour = now.getHours();
      if (hour < 12) {
        return 'morning';
      } if (hour < 19) {
        return 'afternoon';
      }
      return 'night';
    },
  },
  mounted() {
    this.$store.dispatch('commonOptions', this);
  },
  methods: {
    statusChange() {
      this.$emit('statusChange');
    },
    changeTheme(primaryColor) {
      window.less.modifyVars({
        '@primary-color': primaryColor,
      });
    },
    logout() {
      sessionStorage.clear();
      localStorage.clear();
      this.$store.commit('setPwdFlag', null);
      this.$store.commit('setToken', null);
      this.$router.push('/login');
    },
  },
};
</script>

<style lang="scss" scoped>
.header-wrap{
  background: #2B303B;
  padding: 0;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  z-index:9;
  .info-right{
    float: right;
    height: 100%;
    display: flex;
    align-content: flex-end;
    .dashboard{
      padding: 0 10px;
      display: flex;
      align-items: center;
      .icon{
         font-size: 25px;
         margin: 6px;
      }
    }
    .notify{
      padding: 0 10px;
      display: flex;
      align-items: center;
      .notify-icon{
        font-size: 18px;
        display: flex;
        align-items: center;
        position: relative;
        .ant-badge{
          position: absolute;
          top: -14px;
          right: -15px;
        }
      }
    }
    .avatar-wrap{
      // width: 140px;
      height: 100%;
      padding: 0 12px;
      cursor: pointer;
      transition: all .3s;
      display: flex;
      align-items: center;
      .avatar{
        display: block;
        width: 30px;
        height: 30px;
        line-height: 30px;
        border-radius: 50%;
        img{
          display: block;
          height: 100%;
          object-fit: contain;
        }
      }
      .name{
        padding:0 30px 0 10px;
      }
    }
    .setting,.btn{
      // width: 40px;
      text-align: center;
      cursor: pointer;
      color: #fff;
      font-size:14px;
      font-weight:400;
      // color:rgba(185,185,185,1);
      padding-right: 20px;
    }
    // .logout{
    //   text-align: center;
    //   cursor: pointer;
    // }
  }
}
.block{
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  margin-right: 10px;
}
</style>
