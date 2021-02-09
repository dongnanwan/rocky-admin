<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider
      :trigger="null"
      collapsible
      v-model="collapsed"
    >
      <div class="logo" >
        <img src="../assets/img/logo_white.png" alt="">
      </div>
      <Navi/>
    </a-layout-sider>
    <a-layout class="">
      <header-com :collapsed="collapsed" @statusChange="collapsed = !collapsed"></header-com>
      <!-- eslint-disable-next-line-->
      <a-layout-content :style="{ padding: '10px 24px 16px 24px', minHeight: '280px', overflow: 'scroll', }">
        <title-com :titleList="menuLevel" v-if="menuLevel.length"></title-com>
        <div id="main-load">
          <router-view/>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import { mapState } from 'vuex';

// import { Layout } from 'ant-design-vue';

import HeaderCom from '../components/Header.vue';
import Navi from '../components/Navi.vue';
import titleCom from '../components/Title.vue';

export default {
  components: { Navi, titleCom, HeaderCom },
  computed: mapState(['menuLevel']),
  data() {
    return {
      collapsed: false,
    };
  },
};
</script>
<style>
#components-layout-demo-custom-trigger {
  height: 100vh;
}
#components-layout-demo-custom-trigger .trigger {

  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color .3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 44px;
  /* background: rgba(255,255,255,.2); */
  margin: 12px 10px;
  margin-bottom: 5px;
  overflow: hidden;
}
#components-layout-demo-custom-trigger .logo img{
  height: 90%;
  object-fit: cover;
}
</style>
