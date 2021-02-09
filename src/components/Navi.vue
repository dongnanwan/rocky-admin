<template>
  <a-menu theme="dark" mode="inline"
    :defaultSelectedKeys="['1']" :openKeys="openKeys" :selectedKeys="selectedKeys"
    @openChange="onOpenChange">
    <template v-for="item in items">
      <template v-if="item.subs">
        <a-sub-menu :key="item.index">
          <span slot="title">
            <a-icon :type="item.icon"/><span>{{ item.name}}</span>
          </span>
          <a-menu-item
            v-waves
            v-for="(subItem) in item.subs"
            :key="subItem.index"
            @click.native="goPath(
              subItem.path,
              subItem.index,
              subItem.name,
              item.index,
              item.name)">
            <a-badge dot v-if="subItem.done">{{ subItem.name}}</a-badge>
            <template v-else>{{ subItem.name }}</template>
          </a-menu-item>
        </a-sub-menu>
      </template>
      <template v-else>
        <a-menu-item
          :key="item.index"
          @click.native="goPath(item.path, item.index, item.name, null, null)">
          <a-icon :type="item.icon" /><span>{{ item.name}}</span>
        </a-menu-item>
      </template>
    </template>
  </a-menu>
</template>
<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      openKeys: [],
      openKeysOld: [],
      selectedKeys: [],
      items: [],
    };
  },
  watch: {
    naviKey(val) {
      if (typeof val !== 'object') {
        this.openKeys = [];
        this.openKeys.push(val);
      }
    },
    naviSubKey(val) {
      this.selectedKeys = [];
      this.selectedKeys.push(val);
    },
  },
  computed: {
    ...mapState(['naviKey', 'naviSubKey', 'naviItems']),
  },
  mounted() {
    // 页面刷新初始化vuex数据
    const openKeyInit = sessionStorage.getItem('openKeys');
    const selectedKeyInit = sessionStorage.getItem('selectedKey');
    const naviItemsInit = sessionStorage.getItem('naviItems');

    this.$store.commit('setNaviItems', JSON.parse(naviItemsInit));
    const menuLevel = sessionStorage.getItem('menuLevel') || '[]';
    this.$store.commit('setMenuLevel', JSON.parse(menuLevel));
    const openKeyInitTemp = (openKeyInit === null || openKeyInit === 'null') ? '' : openKeyInit;
    const selectedKeyInitTemp = (selectedKeyInit === null || selectedKeyInit === 'null') ? '1' : selectedKeyInit;
    this.openKeys.push(openKeyInitTemp);
    this.selectedKeys.push(selectedKeyInitTemp);
    this.$store.dispatch('updateNaviData', { key: openKeyInitTemp, subKey: selectedKeyInitTemp });
    this.fetchMenu();
    if (global.config.enablePageTabs) {
      this.$store.dispatch('onOpenPagesChange', { path: '', name: '', init: true });// 初始化tab栏已打开的页面
    }
  },
  methods: {
    fetchMenu() {
      this.items = this.naviItems;
    },
    goPath(path, key, name, subKey, subName) {
      this.$router.push(path, () => {});
      this.$store.dispatch('updateNaviData', { key: false, subKey: key });
      this.selectedKeys = [];
      this.selectedKeys.push(key);
      const menuLevel = [
        subName, name,
      ];
      sessionStorage.setItem('menuLevel', JSON.stringify(menuLevel));
      this.$store.commit('setMenuLevel', menuLevel);
      if (global.config.enablePageTabs) {
        this.$store.dispatch('onOpenPagesChange', {
          path, name, init: false, key, subName, subKey,
        });
      }
    },
    onOpenChange(openKeys) {
      if (openKeys.length > 1) {
        this.openKeys = [openKeys[1]];
      } else {
        this.openKeys = openKeys;
      }
      this.$store.dispatch('updateNaviData', { key: this.openKeys, subKey: false });
    },
  },
};
</script>
