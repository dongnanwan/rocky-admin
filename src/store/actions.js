import Utils from '../assets/js/utils';

export default {
  onOpenPagesClear({ commit }) { // 清空打开的标签页
    localStorage.setItem('pages', JSON.stringify([]));
    commit('setPages', []);
  },
  onOpenPagesChange({ commit }, { // 控制打开的标签页
    path, name, init, key, subName, subKey, belongPath = null,
  }) { // 更新标签页
    const localPage = localStorage.getItem('pages');
    const openPagesArry = localPage !== null ? JSON.parse(localPage) : [];
    if (belongPath !== null) {
      openPagesArry.forEach((item) => {
        if (item.path === belongPath) {
          // eslint-disable-next-line
          subKey = item.subKey;
          // eslint-disable-next-line
          key = item.key;
        }
      });
    }
    if (!init) {
      let repeatTimes = 0;
      openPagesArry.forEach((item) => {
        const itemPathArry = item.path.split('?');
        const pathArry = path.split('?');
        if (itemPathArry[0] === pathArry[0] || item.name === name) {
          /* eslint no-param-reassign: ["error", { "props": false }] */
          item.name = name;
          repeatTimes += 1;
          if (itemPathArry[1] !== pathArry[1]) {
            item.path = path;
          }
        }
      });
      if (repeatTimes === 0 && name !== '工作台') {
        openPagesArry.push({
          id: Utils.randomString(6),
          path,
          name,
          key,
          subName,
          subKey,
        });
      }
    }
    localStorage.setItem('pages', JSON.stringify(openPagesArry));
    if (subName || name) {
      commit('setMenuLevel', [subName, name]);
    }
    commit('setPages', openPagesArry);
  },
  updateNaviData({ commit }, data) { // 控制选中的菜单项
    if (data.key !== false) {
      commit('setNaviKey', data.key);
      sessionStorage.setItem('openKeys', data.key);
    }
    if (data.subKey !== false) {
      commit('setNaviSubKey', data.subKey);
      sessionStorage.setItem('selectedKey', data.subKey);
    }
  },
  async commonOptions({ commit }, vue) { // 获取产品类型并存储在vuex中
    commit('optionsFetchedDone', false);
    const labelTree = await vue.$api.common.getLabelTree();
    const provider = await vue.$api.common.getProviderList();
    const auditorOptions = await vue.$api.app.auditor(2312);
    const industry = await vue.$api.common.getIndustry();
    Promise.all([labelTree, provider, auditorOptions, industry]).then((res) => {
      if (res) {
        commit('optionsFetchedDone', true);
        const moduleOptions = [];
        const providerList = [];
        const auditorList = [];
        const allIndustryList = [];
        res[0].result.forEach((item) => {
          moduleOptions.push({
            label: item.name,
            value: item.labelId,
            labelList: item.labelList,
            industryList: item.industryList,
          });
        });
        commit('setModuleOptions', moduleOptions);
        res[1].result.forEach((item) => {
          providerList.push({ value: item.id, label: item.name });
        });
        commit('setProviderList', providerList);
        res[2].result.forEach((item) => {
          auditorList.push({
            label: item.name,
            value: item.accountId,
          });
        });
        commit('setAuditorOptions', auditorList);
        res[3].result.forEach((item) => {
          allIndustryList.push({
            label: item.name,
            value: item.labelId,
          });
        });
        commit('setAllIndustryOptions', allIndustryList);
      }
    }).catch(() => {
      // vue.$message.error(error);
    });
  },
  async fetchClassifyOptions({ commit, state }, val) {
    state.moduleOptions.forEach((item) => {
      if (item.value === val) {
        const arr = [];
        if (item.labelList) {
          item.labelList.forEach((ele) => {
            arr.push({ value: ele.labelId, label: ele.name });
          });
        }
        commit('setClassifyOptions', arr); // 填充应用类型
        const industryOptions = [];
        if (item.industryList) {
          item.industryList.forEach((ele) => {
            industryOptions.push({ label: ele.name, value: Number(ele.labelId) });
          });
        }
        commit('setIndustryOptions', industryOptions); // 填充行业类型
      }
    });
  },
};
