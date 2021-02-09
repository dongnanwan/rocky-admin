export default {
  setSpinning(state, spinning) {
    state.spinning = spinning;
  },
  setContentType(state, key) {
    state.token = key;
  },
  setToken(state, key) {
    state.token = key;
  },
  setPwdFlag(state, key) {
    state.pwdFlag = key;
  },
  setPages(state, pages) {
    state.pages = pages;
  },
  setCurrentPath(state, path) {
    state.currentPath = path;
  },
  setDocClass(state, classStr) {
    state.docClickEleClass = classStr;
  },
  setNaviKey(state, key) {
    state.naviKey = key;
  },
  setNaviSubKey(state, key) {
    state.naviSubKey = key;
  },
  setMenuLevel(state, key) {
    state.menuLevel = key;
  },
  setNaviItems(state, obj) {
    state.naviItems = obj;
  },
  setIndustryOptions(state, key) {
    state.industryOptions = key;
  },
  setModuleOptions(state, key) {
    state.moduleOptions = key;
  },
  setClassifyOptions(state, key) {
    state.classifyOptions = key;
  },
  optionsFetchedDone(state, value) {
    state.optionsFetched = value;
  },
  setProviderList(state, value) {
    state.providerList = value;
  },
  setEnable(state, value) {
    state.enable = value;
  },
  setAuditorOptions(state, value) {
    state.auditorOptions = value;
  },
  setAllIndustryOptions(state, value) {
    state.allIndustryOptions = value;
  },
};
