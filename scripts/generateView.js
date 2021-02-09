#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const read = require('read');
require('colors');

const jsFilePath = './src/router/path.js';
const fileCharset = 'utf8';
let selectedDir = '';

const pageCreater = {
  projectRoot: path.resolve(__dirname, './'),
  renderYesNo: (data) => {
    if (data === 'yes') { return true; } if (data === 'no') { return false; }
    return data;
  },
  errorHander: (error) => { // 错误处理
    if (error) {
      if (error.message === 'canceled') {
        console.log('\n\n您已取消该操作!'.yellow);
        process.exit(0);
      } else if (error.message === 'timed out') {
        console.log('等待已超时, 请重新输入!'.yellow);
        process.exit(0);
      } else {
        throw error;
      }
    }
  },
  handleCopyFile: (source, dest, cb) => { // 拷贝文件
    fs.readFile(source, fileCharset, (err, data) => {
      if (err) throw err;
      // eslint-disable-next-line
      data = data.replace(/\${TITLE}/g, '');
      fs.writeFile(dest, data, fileCharset, (errIn) => {
        if (errIn) throw errIn;
        cb(dest);
      });
    });
  },
  handleCreateDir: (prompt) => { // 创建文件夹
    read({
      prompt: prompt || '请输入文件夹名: ',
      timeout: 60000,
    }, (error, result) => {
      pageCreater.errorHander(error);
      const resultFlag = pageCreater.renderYesNo(result);
      console.log(resultFlag);
      const targetDir = path.resolve(pageCreater.projectRoot, `../src/views/${resultFlag}`);
      const exists = fs.existsSync(targetDir);
      if (exists) {
        pageCreater.handleCreateDir('文件夹已存在，换个名字吧: ');
      } else {
        fs.mkdirSync(targetDir);
        selectedDir = resultFlag;
        pageCreater.handleCreateFile();
      }
    });
  },
  handleSelectDir: (prompt) => { // 选择一个文件夹
    read({
      prompt: prompt || '请选择存放文件夹: ',
      timeout: 60000,
    }, (error, result) => {
      pageCreater.errorHander(error);
      const resultFlag = pageCreater.renderYesNo(result);
      selectedDir = resultFlag;
      const targetDir = path.resolve(pageCreater.projectRoot, `../src/views/${selectedDir}`);
      const exists = fs.existsSync(targetDir);
      if (!exists) {
        pageCreater.handleSelectDir('文件夹不存在，重新选一个吧: ');
      } else {
        pageCreater.handleCreateFile();
      }
    });
  },
  handleCreateFile: (prompt) => { // 创建文件
    read({
      prompt: prompt || '请输入文件名: ',
      timeout: 60000,
    }, (error, result) => {
      pageCreater.errorHander(error);
      const resultFlag = pageCreater.renderYesNo(result);
      const targetFile = path.resolve(pageCreater.projectRoot, `../src/views/${selectedDir}/${resultFlag}`);
      const exists = fs.existsSync(`${targetFile}.vue`);
      if (exists) {
        pageCreater.handleCreateFile('文件已存在，换个名字吧: ');
      } else {
        const sourceVue = path.resolve(pageCreater.projectRoot, './template.vue');
        const destVue = path.resolve(`../src/views/${selectedDir}`, `${targetFile}.vue`);
        pageCreater.handleCopyFile(sourceVue, destVue, () => {
          pageCreater.handleCreatRouterPath(`/${selectedDir}/${result}`, result);
        });
      }
    });
  },
  handleCreatRouterPath: (filePath, fileName) => { // 创建路由
    fs.readFile(path.join(jsFilePath), fileCharset, (err, data) => {
      if (err) throw err;
      let dataTemp = data;
      dataTemp = dataTemp.split('}, {');
      dataTemp.splice(3, 0, `\n       path: '${filePath}',\n       name: '${fileName}',\n       component: () => import('../views${filePath}.vue'),\n    `);
      dataTemp = dataTemp.join('}, {');
      fs.writeFile(jsFilePath, dataTemp, fileCharset, (errWrite) => {
        if (errWrite) throw errWrite;
        console.log('成功自动更新Router（详见21行处）,菜单栏处请手动修改Login.vue文件'.green);
      });
    });
  },
  ifCreateDir: (prompt) => { // 询问创建文件夹
    read({
      prompt: prompt || '是否创建新文件夹[yes/no]: ',
      timeout: 60000,
    }, (error, result) => {
      pageCreater.errorHander(error);
      const resultFlag = pageCreater.renderYesNo(result);
      if (resultFlag === true) {
        pageCreater.handleCreateDir();
      } else if (resultFlag === false) {
        pageCreater.handleSelectDir();
      } else {
        console.log('other');
      }
    });
  },
};

pageCreater.ifCreateDir();
// pageCreater.handleCreatRouterPath();
