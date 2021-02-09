const domainDEV = 'http://test.admin.store.rockysaas.com'; // 测试环境
const domainPRO = 'http://admin.store.rockysaas.com'; // 生产环境

let domain = '';
let requestUrl = '';
const fullCurrentDomain = window.location.href;
if (fullCurrentDomain.indexOf(domainDEV) > -1) { // 测试环境
  domain = `${domainDEV}`;
  requestUrl = 'http://test.api.store.rockysaas.com';
} else if (fullCurrentDomain.indexOf(domainPRO) > -1) { // 生产环境
  domain = `${domainPRO}`;
  requestUrl = 'http://api.store.rockysaas.com';
} else { // 本地调试
  domain = 'http://192.168.40.141:7979';
  // domain = 'http://localhost:8080'; // 本地接口
  // requestUrl = 'http://10.0.41.110:7979'; // 开发

  // requestUrl = 'http://test.api.store.rockysaas.com'; // 测试接口
  // requestUrl = 'http://10.0.42.95:7979'; // 本地
  requestUrl = 'http://192.168.40.141:7979';
}

global.config = {
  clientId: 'rockysaas-browser',
  clientSecret: 'rockysaasClientSecret',
  version: 'v1.0', // 当前版本号
  pageSize: 10, // 列表单页数据条数
  themeChangeEnable: true, // 是否开启一键换肤功能
  enablePageTabs: false, // 是否开启标签页面
  domain: `${domain}`,
  requestUrl: `${requestUrl}`, // 请求地址
  exportExcel: `${requestUrl}/admin/user/exportExcel`, // Excel导出地址
  uploadUrl: `${requestUrl}/mdc/opc/uploadFile`,
};
