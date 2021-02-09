/* eslint-disable no-restricted-syntax */
import Vue from 'vue';
import axios from 'axios';
import store from '../../store';

const downloadFile = (data, fileName) => {
  if (!data) {
    return;
  }
  const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
};

const putExcel = (url, options, cb) => {
  const params = new URLSearchParams();
  for (const key in options) {
    if (options[key]) {
      params.append(key, options[key]);
    }
  }
  axios({
    method: 'post',
    url,
    headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
    data: params,
  }).then((response) => {
    if (!response.headers['content-disposition']) {
      store.commit('setEnable', true);
      console.error('文件名为空');
    }
    let fileName = response.headers['content-disposition'].split(';')[1].split('filename=')[1];
    fileName = decodeURI(fileName);
    downloadFile(response.data, fileName);
    cb();
  }).catch(() => {
    store.commit('setEnable', true);
  });
};


Vue.prototype.$excel = putExcel;

export default putExcel;
