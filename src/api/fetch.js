import Vue from 'vue';
import QS from 'qs';
import axios from 'axios';
import { message } from 'ant-design-vue';
import store from '../store';
import router from '../router';
import baseHeader from '../assets/js/baseHeader';


setTimeout(() => {
  baseHeader.clientVersion = global.config.version;
  Vue.prototype.$base = baseHeader;
}, 0);

axios.defaults.timeout = 30000;
axios.interceptors.request.use((config) => {
  // this.$store.commit('setEnable', false);
  store.commit('setSpinning', true);
  if (store.state.token) {
    // eslint-disable-next-line
    config.headers.Authorization = store.state.token;
  }
  // eslint-disable-next-line
  config.headers.deviceId = baseHeader.deviceId;
  return config;
}, (error) => {
  window.location.reload();
  return Promise.reject(error);
});

// http响应拦截器
axios.interceptors.response.use((res) => {
  // console.log(res.status);
  store.commit('setSpinning', false);
  // this.$store.commit('setEnable', true);
  // 请求成功
  switch (res.data.code) {
    case 10011041:
      sessionStorage.clear();
      store.commit('setPwdFlag', null);
      store.commit('setToken', null);
      setTimeout(() => {
        router.push({
          path: '/login',
        });
      }, 1000);
      return (res);
    default:
      return (res);
  }
}, (error) => {
  if (error.response) {
    message.error(error.response.data.message);
  }
  if (error.response.data.code === 10011041) {
    sessionStorage.clear();
    store.commit('setPwdFlag', null);
    store.commit('setToken', null);
    setTimeout(() => {
      router.push({
        path: '/login',
      });
    }, 1000);
    return false;
  }
  if (error.response.data.error_description) {
    const str = 'Access token expired';
    const flag = error.response.data.error_description.indexOf(str);
    if (flag !== -1) {
      if (sessionStorage.getItem('refresh_token')) {
        const params = {
          accessToken: sessionStorage.getItem('access_token'),
          refreshToken: sessionStorage.getItem('refresh_token'),
        };
        const url = '/muc/auth/account/refreshToken';
        axios.post(global.config.requestUrl + url, params).then((res) => {
          // console.log(res);
        });
      } else {
      // sessionStorage.clear();
      // store.commit('setPwdFlag', null);
      // store.commit('setToken', null);
      // setTimeout(() => {
      //   router.push({
      //     path: '/login',
      //   });
      // }, 1000);
      }
    }
  }
  store.commit('setSpinning', false);
  return Promise.reject(error);
});

function fetch(url = '', params = {}, type = '') {
  let option = {
    header: {
      ...baseHeader,
    },
    ...params,
  };
  if (type === 'nojson') {
    option = QS.stringify(params);
  }
  return new Promise((resolve, reject) => {
    const requestUrl = global.config.requestUrl + url;
    axios.post(requestUrl, option).then((response) => {
      resolve(response.data);
    }).catch((err) => {
      reject(err);
    });
  });
}

export default fetch;
