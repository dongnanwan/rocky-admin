<template>
  <div id="app">
    <a-locale-provider :locale="lang">
     <router-view v-if="isRouterAlive"></router-view>
    </a-locale-provider>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isRouterAlive: true,
      lang: {},
    };
  },
  created() {
    document.addEventListener('click', (e) => {
      this.documentClick(e);
    });
  },
  mounted() {
    this.init('cn');
  },
  watch: {
    $route: 'setCurrentPath',
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  methods: {
    documentClick(e) {
      this.$store.commit('setDocClass', e.target.className + Math.random());
    },
    setCurrentPath() {
      this.$store.commit('setCurrentPath', this.$route.path);
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },
    init(language) {
      switch (language) {
        default:
        case 'cn':
          import('ant-design-vue/lib/locale-provider/zh_CN').then((res) => {
            this.lang = res.default;
          });
          break;
      }
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
li{
  list-style-type: none;
}
</style>
