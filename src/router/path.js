
const routes = [
  {
    path: '/PreRelease/:id',
    name: 'PreRelease',
    meta: { requiresAuth: false },
    component: () => import('../views/PreRelease.vue'),
  },
  {
    path: '/PreviewDetail/:id',
    name: 'PreviewDetail',
    meta: { requiresAuth: false },
    component: () => import('../views/PreviewDetail.vue'),
  },
  {
    path: '/',
    name: 'index',
    component: () => import('../views/Index.vue'),
    children: [
      {
        path: '/userManage/customUserList',
        name: 'customUserList',
        meta: { requiresAuth: true },
        component: () => import('../views/UserManage/CustomUserList.vue'),
      }, {
        path: '/userManage/serverUserList',
        name: 'serverUserList',
        meta: { requiresAuth: true },
        component: () => import('../views/UserManage/ServerUserList.vue'),
      }, {
        path: '/UserManage/ServerUserDetail/:id',
        name: 'ServerUserDetail',
        meta: { requiresAuth: true },
        component: () => import('../views/UserManage/ServerUserDetail.vue'),
      }, {
        path: '/FinanceManage/SettleAuditList',
        name: 'SettleAuditList',
        component: () => import('../views/FinanceManage/SettleAuditList.vue'),
      }, {
        path: '/appManage/appHasPublish',
        name: 'appHasPublish',
        meta: { requiresAuth: true },
        component: () => import('../views/AppManage/AppHasPublish.vue'),
      }, {
        path: '/MyExamine/AuthExamineDetail/:id',
        name: 'AuthExamineDetail',
        meta: { requiresAuth: true },
        component: () => import('../views/MyExamine/AuthExamineDetail.vue'),
      }, {
        path: '/ExamineManage/AppAnnuled',
        name: 'AppAnnuled.vue',
        meta: { requiresAuth: true },
        component: () => import('../views/ExamineManage/AppAnnuled.vue'),
      }, {
        path: '/ExamineManage/ProviderAuth',
        name: 'ProviderAuth',
        meta: { requiresAuth: true },
        component: () => import('../views/ExamineManage/ProviderAuth.vue'),
      }, {
        path: '/MyExamine/MyAuthExamine',
        name: 'MyAuthExamine',
        meta: { requiresAuth: true },
        component: () => import('../views/MyExamine/MyAuthExamine.vue'),
      }, {
        path: '/MyExamine/MyAppExamine',
        name: 'MyAppExamine',
        meta: { requiresAuth: true },
        component: () => import('../views/MyExamine/MyAppExamine.vue'),
      }, {
        path: '/FinanceManage/ProviderSettle',
        name: 'ProviderSettle',
        meta: { requiresAuth: true },
        component: () => import('../views/FinanceManage/ProviderSettle.vue'),
      }, {
        path: '/AppManage/AppExamine',
        name: 'AppExamine',
        meta: { requiresAuth: true },
        component: () => import('../views/AppManage/AppExamine.vue'),
      }, {
        path: '/AppManage/AppExamineDetail/:id',
        name: 'AppExamineDetail',
        meta: { requiresAuth: true },
        component: () => import('../views/AppManage/AppExamineDetail.vue'),
      }, {
        path: '/MailManage/CloudRecomend',
        name: 'CloudRecomend',
        meta: { requiresAuth: true },
        component: () => import('../views/MailManage/CloudRecomend.vue'),
      }, {
        path: '/CustomerManage/AppliationList',
        name: 'AppliationList',
        meta: { requiresAuth: true },
        component: () => import('../views/CustomerManage/AppliationList.vue'),
      }, {
        path: '/CustomerManage/my_customer_orders',
        name: 'my-customer-orders',
        meta: { requiresAuth: true },
        component: () => import('../views/CustomerManage/MyCustomerOrders/index.vue'),
      },
      {
        path: '/CustomerManage/help_customer_orders',
        name: 'my-customer-orders',
        meta: { requiresAuth: true },
        component: () => import('../views/CustomerManage/HelpCustomerOrders/index.vue'),
      },
      {
        path: '/FinanceManage/AccountFlow',
        name: 'AccountFlow',
        meta: { requiresAuth: true },
        component: () => import('../views/FinanceManage/AccountFlow.vue'),
      }, {
        path: '/MailManage/ProviderList',
        name: 'ProviderList',
        meta: { requiresAuth: true },
        component: () => import('../views/MailManage/ProviderList.vue'),
      }, {
        path: '/OperationManage/AdDetail/:id',
        name: 'AdDetail',
        meta: { requiresAuth: true },
        component: () => import('../views/OperationManage/AdDetail.vue'),
      }, {
        path: '/OperationManage/ActivityDetail',
        name: 'ActivityDetail',
        meta: { requiresAuth: true },
        component: () => import('../views/OperationManage/ActivityDetail.vue'),
      }, {
        path: '/OperationManage/AdSetting',
        name: 'AdSetting',
        meta: { requiresAuth: true },
        component: () => import('../views/OperationManage/AdSetting.vue'),
      }, {
        path: '/OperationManage/CouponsList',
        name: 'CouponsList',
        meta: { requiresAuth: true },
        component: () => import('../views/OperationManage/CouponsList.vue'),
      }, {
        path: '/OperationManage/ActivityList',
        name: 'ActivityList',
        meta: { requiresAuth: true },
        component: () => import('../views/OperationManage/ActivityList.vue'),
      }, {
        path: '/MailManage/HotIndustryList',
        name: 'HotIndustryList',
        meta: { requiresAuth: true },
        component: () => import('../views/MailManage/HotIndustryList.vue'),
      }, {
        path: '/MailManage/TopList',
        name: 'TopList',
        meta: { requiresAuth: true },
        component: () => import('../views/MailManage/TopList.vue'),
      }, {
        path: '/MailManage/HotList',
        name: 'HotList',
        meta: { requiresAuth: true },
        component: () => import('../views/MailManage/HotList.vue'),
      }, {
        path: '/MailManage/NewOnline',
        name: 'NewOnline',
        meta: { requiresAuth: true },
        component: () => import('../views/MailManage/NewOnline.vue'),
      }, {
        path: '/orderManage/orderDetail/:id',
        name: 'orderDetail',
        meta: { requiresAuth: true },
        component: () => import('../views/OrderManage/OrderDetail.vue'),
      }, {
        path: '/OrderManage/OrderList',
        name: 'OrderList',
        meta: { requiresAuth: true },
        component: () => import('../views/OrderManage/OrderList.vue'),
      }, {
        path: '/UserManage/CustomUserDetail/:id',
        name: 'CustomUserDetail',
        meta: { requiresAuth: true },
        component: () => import('../views/UserManage/CustomUserDetail.vue'),
      }, {
        path: '/MailManage/NavLabels',
        name: 'NavLabels',
        meta: { requiresAuth: true },
        component: () => import('../views/MailManage/NavLabels.vue'),
      }, {
        path: '/',
        name: 'Dashboard',
        meta: { requiresAuth: true },
        component: () => import('../views/Dashboard/Index.vue'),
      }, {
        path: '/Setting/Role',
        name: 'Role',
        meta: { requiresAuth: true },
        component: () => import('../views/Setting/Role.vue'),
      }, {
        path: '/Setting/Account',
        name: 'Account',
        meta: { requiresAuth: true },
        component: () => import('../views/Setting/Account.vue'),
      }, {
        path: '/WebsiteManage/CaseDetail/:id',
        name: 'WebsiteCaseDetail',
        meta: { requiresAuth: true },
        component: () => import('../views/WebsiteManage/CaseDetail.vue'),
      }, {
        path: '/WebsiteManage/TemplateDetail/:id',
        name: 'TemplateDetail',
        meta: { requiresAuth: true },
        component: () => import('../views/WebsiteManage/TemplateDetail.vue'),
      }, {
        path: '/WebsiteManage/CaseList',
        name: 'WebsiteCaseList',
        meta: { requiresAuth: true },
        component: () => import('../views/WebsiteManage/CaseList.vue'),
      }, {
        path: '/WebsiteManage/TemplateList',
        name: 'TemplateList',
        meta: { requiresAuth: true },
        component: () => import('../views/WebsiteManage/TemplateList.vue'),
      }, {
        path: '/AppletTemplate/CaseDetail/:id',
        name: 'AppletCaseDetail',
        meta: { requiresAuth: true },
        component: () => import('../views/AppletTemplate/CaseDetail.vue'),
      }, {
        path: '/AppletTemplate/templateDetail/:id',
        name: 'AddTemplate',
        meta: { requiresAuth: true },
        component: () => import('../views/AppletTemplate/AddTemplate.vue'),
      }, {
        path: '/AppManage/AppDetail/:id',
        name: 'AppDetail',
        meta: { requiresAuth: true },
        component: () => import('../views/AppManage/AppDetail.vue'),
      }, {
        path: '/setting/resetPwd',
        name: 'ResetPwd',
        meta: { requiresAuth: true },
        component: () => import('../views/Setting/ResetPwd.vue'),
      }, {
        path: '/AppManage/AppAdd/:id',
        name: 'AppAdd',
        meta: { requiresAuth: true },
        component: () => import('../views/AppManage/AppAdd.vue'),
      }, {
        path: '/AppletTemplate/CaseList',
        name: 'AppletCaseList',
        meta: { requiresAuth: true },
        component: () => import('../views/AppletTemplate/CaseList.vue'),
      }, {
        path: '/appManage/appHasAnnuled',
        name: 'appHasAnnuled',
        meta: { requiresAuth: true },
        component: () => import('../views/AppManage/AppHasAnnuled.vue'),
      },
      {
        path: '/appletTemplate/templateList',
        name: 'templateList',
        meta: { requiresAuth: true },
        component: () => import('../views/AppletTemplate/TemplateList.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    meta: { requiresAuth: false },
    component: () => import('../views/Login.vue'),
  },
];

export default routes;
