import Vue from 'vue';

// import Antd from 'ant-design-vue';
import 'normalize.css';
import {
  SaaSButton,
  SaaSInput,
  SaaSSelect,
  SaaSRangePicker,
  SaaSTabbar,
  SaaSUpload,
} from 'rockysaasui';

import {
  Affix,
  Input,
  Button,
  Layout,
  Menu,
  Breadcrumb,
  Icon,
  Badge,
  Dropdown,
  Select,
  DatePicker,
  Table,
  Tag,
  Modal,
  Checkbox,
  Tabs,
  Upload,
  Form,
  Radio,
  Tooltip,
  Row,
  Col,
  Message,
  Popconfirm,
  LocaleProvider,
  Carousel,
  Tree,
  Rate,
  Pagination,
  Cascader,
  Switch,
  Collapse,
  Card,
  Steps,
} from 'ant-design-vue';
import VueCookies from 'vue-cookies';
import VueScrollTo from 'vue-scrollto';

import App from './App.vue';
import router from './router/index';
import store from './store/index';
import './config';
import './assets/js/directives';
import './assets/css/base.scss';
import './assets/css/mixin.scss';
import './assets/js/excel';

import api from './api';
import Options from './assets/js/options';
import Utils from './assets/js/utils';
import Getters from './assets/js/getters';
import mixRule from './assets/js/mixRule';


Vue.use(VueScrollTo);
Vue.use(VueCookies);
Vue.use(Affix);
Vue.use(Tabs);
Vue.use(Upload);
Vue.use(Form);
Vue.use(Input);
Vue.use(Tag);
Vue.use(Radio);
Vue.use(Tooltip);
Vue.use(Row);
Vue.use(Col);
Vue.use(Popconfirm);
Vue.use(LocaleProvider);
Vue.use(Carousel);
Vue.use(Tree);
Vue.use(Rate);
Vue.use(Pagination);
Vue.use(Cascader);
Vue.use(Switch);
Vue.use(Collapse);
Vue.use(Card);
Vue.use(Steps);

Vue.use(SaaSButton);
Vue.use(SaaSInput);
Vue.use(SaaSSelect);
Vue.use(SaaSTabbar);
Vue.use(SaaSRangePicker);
Vue.use(SaaSUpload);


Vue.prototype.$message = Message;
Vue.prototype.$mixRule = mixRule;

Vue.component(Button.name, Button);
Vue.component(Layout.name, Layout);
Vue.component(Layout.Header.name, Layout.Header);
Vue.component(Layout.Footer.name, Layout.Footer);
Vue.component(Layout.Sider.name, Layout.Sider);
Vue.component(Layout.Content.name, Layout.Content);
Vue.component(Menu.name, Menu);
Vue.component(Menu.Item.name, Menu.Item);
Vue.component(Menu.SubMenu.name, Menu.SubMenu);
Vue.component(Menu.Divider.name, Menu.Divider);
Vue.component(Menu.ItemGroup.name, Menu.ItemGroup);
Vue.component(Breadcrumb.name, Breadcrumb);
Vue.component(Breadcrumb.Item.name, Breadcrumb.Item);
Vue.component(Icon.name, Icon);
Vue.component(Badge.name, Badge);
Vue.component(Dropdown.name, Dropdown);
Vue.component(Select.name, Select);
Vue.component(Select.Option.name, Select.Option);
Vue.component(Select.OptGroup.name, Select.OptGroup);
Vue.component(DatePicker.name, DatePicker);
Vue.component(DatePicker.MonthPicker.name, DatePicker.MonthPicker);
Vue.component(DatePicker.RangePicker.name, DatePicker.RangePicker);
Vue.component(DatePicker.WeekPicker.name, DatePicker.WeekPicker);
Vue.component(Table.name, Table);
Vue.component(Table.Column.name, Table.Column);
Vue.component(Table.ColumnGroup.name, Table.ColumnGroup);
Vue.component(Modal.name, Modal);
Vue.component(Checkbox.name, Checkbox);
Vue.component(Checkbox.Group.name, Checkbox.Group);

Vue.prototype.$api = api;
Vue.prototype.$selectOptions = Options;
Vue.prototype.$utils = Utils;
Vue.prototype.$getters = Getters;
Vue.prototype.$confirm = Modal.confirm;

Vue.config.productionTip = false;

const token = sessionStorage.getItem('token');
store.commit('setToken', token);
const pwdFlag = sessionStorage.getItem('pwdFlag');
store.commit('setPwdFlag', pwdFlag);
const list = JSON.parse(sessionStorage.getItem('list'));
store.commit('setNaviItems', list);


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
