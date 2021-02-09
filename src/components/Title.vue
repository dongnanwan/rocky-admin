<template>
<div class="wrap" :class="!enablePageTabs?'title-card':''">
  <div class="breadcrumb">
    <a-breadcrumb>
      <a-breadcrumb-item
        class="f16"
        v-for="(item, index) in titleList"
        :key="index"
        :class="{current_breadcrumb:index===titleList.length-1}">
          {{item}}
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
  <div v-if="enablePageTabs">
    <div class="page_border mt15" v-if="!closeOpenMenu" ref="page_border">
      <span
        @click="goPath(item)"
        @contextmenu.prevent="rightClick(index, item, $event)"
        class="cp menu_x"
        :class="[{active:currentPath.split('?')[0]===item.path.split('?')[0]}]"
        v-for="(item, index) in pages"
        :key="index" ref="page_tab">{{item.name}}
        <a-icon
          v-if="pages.length !== 1"
          @click="closePage(item.path, item.subKey, item.key, $event)"
          class="ml5 close" type="close" />
      </span>
    </div>
    <div v-if="rightMenu" class="right_menu" :style="menuStyle">
      <ul>
        <li @click="closeOthers">关闭其它标签页</li>
      </ul>
    </div>
  </div>
</div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['pages', 'currentPath', 'docClickEleClass']),
    menuStyle() {
      return {
        left: this.menuData.left,
        top: this.menuData.top,
      };
    },
  },
  data() {
    return {
      enablePageTabs: global.config.enablePageTabs,
      rightMenu: false,
      menuData: {
        left: '',
        top: '',
        path: '',
        name: '',
        key: '',
        subKey: '',
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.page_tab) {
        let spanTotalWidth = 0;
        this.$refs.page_tab.forEach((item) => {
          spanTotalWidth += item.offsetWidth;
        });
        if (spanTotalWidth > window.innerWidth - 400) {
          this.closeFirstPage();
        }
      }
    });
  },
  watch: {
    docClickEleClass(val) {
      if (this.enablePageTabs) {
        if (val.indexOf('menu_x') === -1) {
          this.rightMenu = false;
        }
      }
    },
  },
  props: {
    titleList: {
      type: Array,
      default() {
        return [];
      },
    },
    closeOpenMenu: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    goPath(item) {
      this.$router.push(item.path);
      const menuLevel = [
        item.subName, item.name,
      ];
      sessionStorage.setItem('menuLevel', JSON.stringify(menuLevel));
      this.$store.commit('setMenuLevel', menuLevel);
      this.$store.dispatch('updateNaviData', { key: item.subKey, subKey: item.key });
    },
    rightClick(index, item, e) { // 右键菜单
      if (this.pages.length !== 1) {
        this.rightMenu = true;
        this.menuData = {
          left: `${e.pageX}px`,
          top: `${e.pageY}px`,
          path: item.path,
          name: item.name,
          key: item.key,
          subKey: item.subKey,
        };
      }
    },
    closeFirstPage() { // 关闭第一个页面
      const pages = JSON.parse(localStorage.getItem('pages'));
      pages.splice(0, 1);
      localStorage.setItem('pages', JSON.stringify(pages));
      this.$store.commit('setPages', pages);
      // this.$message.info('已关闭不常用的页面')
    },
    closeOthers() { // 关闭其他页面
      const pages = JSON.parse(localStorage.getItem('pages'));
      let theLeftPage = {};
      pages.forEach((item) => {
        if (item.path === this.menuData.path) {
          theLeftPage = item;
        }
      });
      localStorage.setItem('pages', JSON.stringify([theLeftPage]));
      this.$store.commit('setPages', [theLeftPage]);
      // eslint-disable-next-line
      this.goPath({ path: this.menuData.path, key: this.menuData.key, subKey: this.menuData.subKey });
    },
    closePage(path, key, subKey, e) { // 关闭页面
      e.stopPropagation();
      const localPage = JSON.parse(localStorage.getItem('pages'));
      Object.keys(localPage).forEach((x) => {
        if (typeof localPage[x] !== 'undefined') {
          if (localPage[x].path === path) {
            localPage.splice(x, 1);
            localStorage.setItem('pages', JSON.stringify(localPage));
            this.$store.commit('setPages', localPage);
            if (this.currentPath === path.split('?')[0]) { // 关闭当前页
              const localPageTempFlag = typeof localPage[x - 1] !== 'undefined';
              this.$router.push(localPageTempFlag ? localPage[x - 1].path : localPage[x].path);
              const keyTemp = localPageTempFlag ? localPage[x - 1].key : localPage[x].key;
              const subKeyTemp = localPageTempFlag ? localPage[x - 1].subKey : localPage[x].subKey;
              this.$store.dispatch('updateNaviData', { key: subKeyTemp, subKey: keyTemp });
            }
          }
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
@import '../styles/theme/variables.less';

.right_menu{
  position: absolute;
  z-index: 100;
  border-radius: 5px;
  user-select: none;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, .1);
  ul{
    padding: 0;
    margin: 0;
    li{
      list-style: none;
      display: inline-block;
      padding: 5px 8px;
      border-radius: 5px;
      transition: .3s all ease-in;
      cursor: pointer;
      &:hover{
        background-color: #eff0ff;
      }
    }
  }
}
.title-card{
  box-sizing: border-box;

  color: rgba(0,0,0,.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: "tnum";
  position: relative;
  padding: 5px 0;
  // background: #fff;
  // box-shadow: 0 1px 4px rgba(0,21,41,.08);
}
.breadcrumb{
  padding: 10px 0;
  .span{
    margin-top: 2px;
  }
  // @include center(row, flex-start);
  .ant-breadcrumb-link{
    color: #B7BDC9;
  }
  .current_breadcrumb{
    color: #2B303B;
    // color: @primary-color;
  }
}
.page_title{
  font-size: 20px;
  font-weight: 300;
  color: @primary-color;
  // @include center(row, flex-start);
  border-radius: 5px;
  padding: 5px 5px 5px 0;
}
.page_border{
  // @include center(row, flex-start);
  background-color: transparent !important;
  padding: 0 !important;
  span{
    margin-right: 3px;
    display: inline-block;
    border-radius: 5px 5px 0 0;
    box-sizing: border-box;
    padding: 10px;
    background-color: #e9ecef;
    color: #B7BDC9;
    user-select: none;
    // @include center(row, flex-start);
    font-weight: 300;
    height: 41px;
    .close{
      transition: .3s all ease-in;
      border-radius: 50%;
      &:hover{
        background-color: #dadada;
        color: white;
      }
    }
  }
  .active{
    background-color: white;
    color: @primary-color;
  }
}
</style>
