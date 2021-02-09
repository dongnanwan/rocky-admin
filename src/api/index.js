import qs from 'qs';
import fetch from './fetch';

export default {
  common: {
    loginAfter(params) {
      return fetch('/muc/account/loginAfter', params);
    },
    getImgCode() {
      return fetch('/muc/auth/code/image');
    },
    resetPwd(params) {
      return fetch('/muc/account/modifyPwd', params);
    },
    getLabelTree() {
      return fetch('/mdc/mall/label/get-label-tree');
      // return fetch('/mdc/mall/label/get-application-type-label-list');
    },
    recommendEnable(applicationId) {
      return fetch(`/mdc/application/manage/judge-can-set-application-recommend/${applicationId}`);
    },
    getProviderList() { // 获取所有服务商
      return fetch('/muc/provider/user/query/all/provider');
    },
    getProviderByType(type) {
      return fetch(`/mdc/provider/get-provider-list-by-type/${type}`);
    },
    getProviceCode(pid) { // 获取所有省市编码
      return fetch(`/opc/ll-config/city-codes?pid=${pid}`);
    },
    getIndustry() { // 获取所有行业
      return fetch('/mdc/mall/label/get-industry-label-list');
    },
  },
  user: {
    costomUserList(params) {
      return fetch('/muc/admin/user/list', params);
    },
    customUserDetail(accountId) {
      return fetch(`/muc/admin/user/${accountId}`);
    },
    customerUserExcel: '/muc/admin/user/export',
    getViewData(params) { // 获取浏览应用列表
      return fetch('/mdc/admin/user/application/views', params);
    },
    getTrialData(params) { // 获取试用应用列表
      return fetch('/mdc/admin/user/application/trails', params);
    },
    getChargeData(params) {
      return fetch('/mdc/admin/user/application/charges', params);
    },
    getFavourate(params) {
      return fetch('/mdc/admin/user/application/favourate', params);
    },
    viewDetail(applicationId, params) {
      return fetch(`/mdc/admin/user/application/view/${applicationId}`, params);
    },
    // getBonusList(params) {
    //   return fetch('/moc/my/bonus/bonusList', params);
    // },
    serverUserList(params) {
      return fetch('/muc/provider/user/query/list', params); // 服务商用户列表
    },
    serverUserDetail(providerId) { // 服务商用户详情
      return fetch(`/muc/provider/user/info/${providerId}`);
    },
    providerAppList(params) { // 服务商应用列表
      return fetch('/mdc/provider/get-application-list', params);
    },
    profitSetting(params) { // 分润设置
      return fetch('/mdc/provider/save-application-profit', params);
    },
    providerAccountInfo(providerId) { // 服务商账户概览
      return fetch(`/mtc/provider/financial/${providerId}`);
    },
    providerAccountList(params) { // 服务商账户提现列表
      return fetch('/mtc/provider/withdraw/list', params);
    },
    providerAuthInfo(providerId) { // 服务商认证信息
      return fetch(`/muc/provider/user/auth/${providerId}`);
    },
    getBindRecord(params) { // 获取服务商手机绑定历史
      return fetch('/muc/provider/user/bind/list', params);
    },
    serverUserExcel: '/muc/provider/user/list/exp', // 服务商用户导出列表
  },
  app: {
    hasPublishList(params) {
      return fetch('/mdc/application/manage/get-released-application-list', params);
    },
    hasUnderlineList(params) {
      return fetch('/mdc/application/manage/get-dismount-application-list', params);
    },
    setApplicationRecommend(params) {
      return fetch('/mdc/application/manage/set-application-recommend', params);
    },
    updateStatus(params) {
      return fetch('/mdc/application/manage/set-application-status', params);
    },
    getAppDetail(applicationId) { // 获取应用详情
      return fetch(`/mdc/application/manage/get-application-detail/${applicationId}`);
    },
    updateViewCount(params) {
      return fetch('/mdc/application/manage/update-application-viewer-count-fake', params);
    },
    getComment(params) {
      return fetch('/mdc/application/manage/get-review-list', params);
    },
    getViewUser(params) {
      return fetch('/mdc/application/manage/get-application-view-list', params);
    },
    getTrailUserList(params) {
      return fetch('/mdc/application/manage/get-application-trail-list', params);
    },
    getPayUserList(params) {
      return fetch('/mdc/application/manage/get-application-pay-list', params);
    },
    ifEditedApp(params) { // 判断当前登录用户是否存在发布中的应用
      return fetch('/mdc/application/manage/judge-whether-have-in-release-application', params);
    },
    addAppFirst(params) {
      return fetch('/mdc/application/manage/add-application-step-first', params);
    },
    addAppSecond(params) {
      return fetch('/mdc/application/manage/add-application-step-second', params);
    },
    addAppThird(params) {
      return fetch('/mdc/application/manage/add-application-step-third', params);
    },
    addAppFour(params) {
      return fetch('/mdc/application/manage/add-application-step-fourth', params);
    },
    appInfoOne(applicationId) {
      return fetch(`/mdc/application/manage/get-add-application-step-first-echo-display/${applicationId}`);
    },
    appInfoTwo(applicationId) {
      return fetch(`/mdc/application/manage/get-add-application-step-second-echo-display/${applicationId}`);
    },
    appInfoThree(applicationId) {
      return fetch(`/mdc/application/manage/get-add-application-step-third-echo-display/${applicationId}`);
    },
    appInfoFour(applicationId) {
      return fetch(`/mdc/application/manage/get-add-application-step-fourth-echo-display/${applicationId}`);
    },
    getPackageOption(applicationId) { // 获取套餐配置列表
      return fetch(`/mdc/application/package/config/get-application-package-config-list-map/${applicationId}`);
    },
    addPackageOption(params) { // 添加套餐配置
      return fetch('/mdc/application/package/config/add-application-package-config', params);
    },
    removeTag(configId) { // 删除套餐配置
      return fetch(`/mdc/application/package/config/delete-application-package-config/${configId}`);
    },
    commentDelete(reviewId) { // 删除评论
      return fetch(`/mdc/application/manage/delete-review/${reviewId}`);
    },
    appDelete(applicationId) {
      return fetch(`/mdc/application/manage/delete-application/${applicationId}`);
    },
    auditList(params) { // 应用审核列表
      return fetch('/mdc/application/manager/audit/get-application-audit-list', params);
    },
    appAuditDetail(applicationId) { // 应用审核详情
      return fetch(`/mdc/application/manager/audit/get-application-audit-detail/${applicationId}`);
    },
    appAuditRecord(params) { // 历史平台审核
      return fetch('/mdc/application/manager/audit/get-application-history-audit-list', params);
    },
    auditor(actionId) { // 获取审核员
      return fetch(`/mdc/application/manager/audit/get-applications-auditors-list/${actionId}`);
    },
    distribute(params) { // 应用审核列表转派
      return fetch('/mdc/application/manager/audit/get-applications-tranafer', params);
    },
  },
  myExamine: { // 我的审核
    appAudiyList(params) { // 我的应用审核
      return fetch('/mdc/application/manager/audit/get-myaudit-application-query-list', params);
    },
    appPublish(params) { // app发布
      return fetch('/mdc/application/manager/audit/get-myaudit-application-release', params);
    },
    appExamine(params) { // app审核
      return fetch('/mdc/application/manager/audit/get-myaudit-application-audit', params);
    },
    authExamineList(params) { // 服务商认证审核列表
      return fetch('/mdc/provider/audit/get-provider-Verified-list', params);
    },
    authExamine(params) { // 服务商认证审核
      return fetch('/mdc/provider/audit/get-myaudit-provider-verified', params);
    },
    authExamineDetail(providerId) { // 服务商认证审核详情
      return fetch(`/mdc/provider/audit/get-provider-verified-detail/${providerId}`);
    },
    authAuditRecord(params) { // 服务商认证历史审核记录
      return fetch('/mdc/provider/audit/get-provider-verified-history-audit-list/', params);
    },
    platformAuditRecord(params) {
      return fetch('/mdc/provider/audit/get-provider-verified-tripartite-history-audit-list/', params);
    },
  },
  examineManage: { // 审核管理
    providerAuthList(params) { // 服务商认证列表
      return fetch('/mdc/provider/audit/get-provider-Verified-list', params);
    },
    providerAuthDistribute(params) { // 服务商认证转派
      return fetch('/mdc/provider/audit/get-provider-verified-tranafer', params);
    },
    appAnnuledApply(params) { // 应用下架申请--列表查询
      return fetch('/mdc/provider/audit/get-application-offshelve-audit-list', params);
    },
    appAnunledDetail(params) {
      return fetch('/mdc/provider/audit/get-application-offshelve-audit-detail', params);
    },
    appAnnuledAudit(params) { // 应用下架申请--应用下架审核
      return fetch('/mdc/provider/audit/get-application-offshelve-audit', params);
    },
    appAnunledExcel: '/mdc/provider/audit/applicatiosofflistexp',
    providerAuthExcel: '/mdc/provider/audit/providerverifiedlistexp',
  },
  miniProgram: {
    templateList(params) {
      return fetch('/mdc/miniprogram/template/get-miniprogram-template-list', params);
    },
    getAppTypeOptions() { // 获取所有应用标签列表
      return fetch('/mdc/mall/label/get-application-type-label-list');
    },
    addApplet(params) {
      return fetch('/mdc/miniprogram/template/add-miniprogram-template', params);
    },
    editApplet(params) {
      return fetch('/mdc/miniprogram/template/update-miniprogram-template', params);
    },
    deleteApplet(templateId) {
      return fetch(`/mdc/miniprogram/template/delete-miniprogram-template/${templateId}`);
    },
    getTemplateDetail(templateId) {
      return fetch(`/mdc/miniprogram/template/get-miniprogram-template-detail/${templateId}`);
    },
    appletCaseList(params) {
      return fetch('/mdc/miniprogram/case/get-miniprogram-case-list', params);
    },
    addCase(params) {
      return fetch('/mdc/miniprogram/case/add-miniprogram-case', params);
    },
    deleteCase(caseId) {
      return fetch(`/mdc/miniprogram/case/delete-miniprogram-case/${caseId}`);
    },
    editCase(params) {
      return fetch('/mdc/miniprogram/case/update-miniprogram-case', params);
    },
    getCaseDetail(caseId) {
      return fetch(`/mdc/miniprogram/case/get-miniprogram-case-detail/${caseId}`);
    },
    updateCaseSort(params) {
      return fetch('/mdc/miniprogram/case/sort-adjust', params);
    },
  },
  website: {
    templateList(params) { // 获取网站建设模板-商城模板列表
      return fetch('/mdc/website/template/get-website-template-tist', params);
    },
    addTemplate(params) { // 添加网站建设模板
      return fetch('/mdc/website/template/add-website-template', params);
    },
    editTemplate(params) { // 修改网站建设模板
      return fetch('/mdc/website/template/update-website-template', params);
    },
    getTemplateDetail(templateId) { // 网站建设信息回显
      return fetch(`/mdc/website/template/get-website-template-detail/${templateId}`);
    },
    deleteTemplate(templateId) { // 删除建设信息
      return fetch(`/mdc/website/template/delete-website-template/${templateId}`);
    },
    caseList(params) { // 获取网站建设模板-商城案例列表
      return fetch('/mdc/website/case/get-website-case-list', params);
    },
    addCase(params) { // 添加网站建设案例
      return fetch('/mdc/website/case/add-website-case', params);
    },
    deleteCase(caseId) { // 删除网站建设案例
      return fetch(`/mdc/website/case/delete-website-case/${caseId}`);
    },
    editCase(params) { // 修改网站建设案例
      return fetch('/mdc/website/case/update-website-case', params);
    },
    getCaseDetail(caseId) { // 修改网站建设案例，回显信息接口
      return fetch(`/mdc/website/case/get-website-case-detail/${caseId}`);
    },
    updateCaseSort(params) {
      return fetch('/mdc/website/case/sort-adjust', params);
    },
  },
  mailManage: {
    labelSave(params) { //   商城管理-删除保存
      return fetch('/mdc/mall/manage/sava-label', params);
    },
    labelDelete(params) { //   商城管理-删除标签
      return fetch('/mdc/mall/manage/delete-label', params);
    },
    newOnlineList(params) { // 获取新品上架列表
      return fetch('/mdc/mall/manage/get-new-application-list', params);
    },
    appDelete(params) {
      return fetch('/mdc/mall/manage/delete-application-show-list', params);
    },
    appFilterClassify(params) { // 根据
      return fetch('/mdc/application/manage/get-application-for-application-show', params);
    },
    newAppSave(params) { // 上架产品到不同类型列表
      return fetch('/mdc/mall/manage/add-application-show', params);
    },
    hotList(params) { // 获取热门应用列表
      return fetch('/mdc/mall/manage/get-hot-application-list', params);
    },
    cloudRecomend(params) {
      return fetch('/mdc/mall/manage/get-cloud-market-recommend-list', params);
    },
    sortAdjust(params) { // 调整排序接口
      return fetch('/mdc/mall/manage/sort-adjust', params);
    },
    topList(params) {
      return fetch('/mdc/mall/manage/get-excellent-application-list', params);
    },
    // hotIndustryList(params) {  已废弃
    //   return fetch('/mdc/mall/manage/get-hot-industry-application-list', params);
    // },
    initIndustryOptions(type) { // 获取行业标签列表-行业排序回显接口 已废弃
      return fetch(`/mdc/industry/order/get-industry-order-list/${type}`);
    },
    labelOption(type) { // 应用类型排序回显
      return fetch(`/mdc/label/order/get-label-order-list/${type}`);
    },
    sortIndustryLabel(params) { // 应用类型排序
      return fetch('/mdc/label/order/label-sort', params);
    },
    providerList(params) {
      return fetch('/mdc/mall/manage/get-provider-show-list', params);
    },
    providerAdjust(params) {
      return fetch('/mdc/mall/manage/provider-show-sort-adjust', params);
    },
    addProvider(params) {
      return fetch('/mdc/mall/manage/add-provider-show', params);
    },
    updateProvider(params) {
      return fetch('/mdc/mall/manage/update-provider-show', params);
    },
    getProviderDetail(providerShowId) {
      return fetch(`/mdc/mall/manage/get-provider-show-detail/${providerShowId}`);
    },
    providerDelete(providerShowIds) {
      return fetch(`/mdc/mall/manage/delete-provider-show-list/${providerShowIds}`);
    },
  },
  setting: {
    accountExcel: '/muc/account/export-account-list',
    accountList(params) {
      return fetch('/muc/account/query/list', params);
    },
    addAccount(params) {
      return fetch('/muc/account/add', params);
    },
    editAccount(params) {
      return fetch('/muc/account/edit', params);
    },
    cancelAccount(params) {
      return fetch('/muc/account/cancel', params);
    },
    resetAccount(params) {
      return fetch('/muc/account/restore', params);
    },
    allRoleList() {
      return fetch('/muc/role/list/ADMIN');
    },
    resetPwd(params) {
      return fetch('/muc/account/password/reset', params);
    },
    roleList(params) {
      return fetch('/muc/role/query/list', params);
    },
    permisionTree(params) {
      return fetch('/muc/account/get/action-tree', params);
    },
    saveRole(params) {
      return fetch('/muc/role/save', params);
    },
    fetchTreeById(roleId) {
      return fetch(`/muc/role/getActionTreeByRoleId/${roleId}`);
    },
    deleteRole(id) {
      return fetch(`/muc/role/delete/${id}`);
    },
  },
  dashboard: {
    historyData() {
      return fetch('/mdc/workbench/query/history');
    },
    todayData() {
      return fetch('/mdc/workbench/query/today');
    },
    trend(params) {
      return fetch('/mdc/workbench/query/trend', params);
    },
    portrait(params) {
      return fetch('/mdc/workbench/query/portrait', params);
    },
  },
  orders: {
    orderList(params) {
      return fetch('/mtc/order/management/list', params);
    },
    orderDetail(orderNo) {
      return fetch(`/mtc/order/management/${orderNo}`);
    },
  },
  operation: {
    activityList(params) {
      return fetch('/moc/operation/activity/activityList', params);
    },
    activityExport(params) {
      return fetch('/moc/operation/activity/activityListExp', params);
    },
    activityAdd(params) {
      return fetch('/moc/operation/activity/insertActivity', params);
    },
    updateActivityStatus(params) {
      return fetch('/moc/operation/activity/updateActivityStatus', params);
    },
    couponList(params) {
      return fetch('/moc/operation/bonus/bonusList', params);
    },
    couponExcel: '/moc/operation/bonus/bonusListExp',
    adSetting(params) { // 广告位列表
      return fetch('/moc/operation/spread/spread-list', params);
    },
    updateAdStatus(params) { // 修改广告位状态
      return fetch('/moc/operation/spread/update-spread-status', params);
    },
    advertiseEdit(params) { // 添加广告位
      return fetch('/moc/operation/spread/spread-edit', params);
    },
    activityExcel: '/moc/operation/activity/activityListExp',
    sortAdjust(params) { // 广告位排序
      return fetch('/moc/operation/spread/update-spread-sort', params);
    },
    advertiseDetail(params) {
      return fetch('/moc/operation/spread/spread-detail', params);
    },
    // advertiseEdit(params) {
    //   return fetch('', params);
    // },
  },
  customerManage: {
    applicationList(params) {
      return fetch('/mdc/customer-manage/query-trial-apply-list', params);
    },
    myCustomerOrderList(params) {
      return fetch('/mtc/customer/management/list', params);
    },
    myCustomerOrderDetail(orderNo) {
      return fetch(`/mtc/order/management/${orderNo}`);
    },
    helpCustomerOrdersList(params) {
      return fetch('/mdc/application/manage/get-released-application-list', params);
    },
    getPackageInfo(id) {
      return fetch(`/mdc/mall/application/package/${id}`);
    },
    checkPhone(phone) {
      return fetch(`/muc/admin/user/mobile/check/${phone}`);
    },
    helpOrder(params) {
      return fetch('/mtc/customer/management/admin/create/order', params, 'nojson');
    },
    applicationExcel: '/mdc/customer-manage/exp-trial-apply-list',
  },
  financeManage: {
    accountFlow(params) { // 商城入账流水列表
      return fetch('/mtc/serial/management/list', params);
    },
    total(params) { // 商城入账流水总计
      return fetch('/mtc/serial/management/list/collect', params);
    },
    flowExcel: '/mtc/serial/management/exp', // 商城入账流水导出
    providerSettle(params) { // 服务商结算列表
      return fetch('/mtc/manage/financial-management/settlement/list', params);
    },
    providerSettleTotal(params) { // 服务商结算求和
      return fetch('/mtc/manage/financial-management/settlement/total', params);
    },
    providerSettleExcel: '/mtc/manage/financial-management/settlement/exp', // 服务商结算导出
    providerSettleDeatilExcel: '/mtc/manage/financial-management/settlement/detail-exp', // 服务商结算明细导出
    settleAuditList(params) {
      return fetch('/mtc/manage/financial-management/settlement/audit/list', params);
    },
    settleAuditExcel: '/mtc/manage/financial-management/settlement/audit/exp',
    processData(params) {
      return fetch('/mtc/manage/financial-management/settlement/audit/settle-list', params);
    },
    settleAuditSubmit(params) {
      return fetch('/mtc/manage/financial-management/settlement/audit/confirm', params);
    },
  },
};
