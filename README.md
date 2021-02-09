# RockySaaS生态云管理后台


## 技术栈
@vue/cli + ant-design-vue + vue + vuex + vue-router + axios

本项目采用vue框架进行开发，关于相关知识可以查看文档

[Vue 2.x： 渐进式JavaScript 框架](https://cn.vuejs.org/)   

[Vuex：专为 Vue.js 应用程序开发的状态管理模式](https://vuex.vuejs.org/zh/)   

[Vue Router：Vue.js 官方的路由管理器](https://router.vuejs.org/zh/)   

[Vue CLI：Vue.js 开发的标准工具](https://cli.vuejs.org/zh/)   


### 关于@vue/cli脚手架配置
本项目使用的脚手架 vue cli 3
构建于 webpack，webpack-dev-server 之上，可以使用下列任一命令安装这个新 vue-cli 的包：
```
npm install -g @vue/cli
# OR
yarn global add @vue/cli
```
通过命令
```
vue create <projectName>
```
新建一个vue项目
在命令行界面，会要求你输入一些选项来初始化这个项目
默认选项配置了babel转译和eslint语法校验，也可以通过手动选择需要的自定义配置， 
```
? Please pick a preset: Manually select features
? Check the features needed for your project: 
 ◉ Babel
 ◯ TypeScript
 ◯ Progressive Web App (PWA) Support
 ◉ Router
 ◉ Vuex
 ◉ CSS Pre-processors
 ◉ Linter / Formatter
 ◯ Unit Testing
 ◯ E2E Testing
```
本项目使用的选项如下，集成了Babael，Vuex，Router，Eslint作为格式校验方式，保存时校验格式。stylus作为css预处理器，PostCSS, Autoprefixer 和 CSS Modules 是默认被提供支持的。选择独立文件作为babel,eslint等的配置文件。vue.config.js 是一个可选的配置文件，如果项目的 (和 package.json 同级的) 根目录中存在这个文件，那么它会被 @vue/cli-service 自动加载。

项目默认的 Eslint 以及 PostCSS 配置直接写在 package.json 中对应的 eslintConfig 以及 postcss 字段中，具体可以打开 package.json 文件进行查看，或者修改配置

### 关于ui框架
本项目引用了 [ant-design-vue](https://www.antdv.com/docs/vue/introduce-cn/) 作为项目集成的的ui框架，ant-design-vue作为 Ant Design 的 Vue 实现，一般用于开发和服务于企业级后台产品。拥有开箱即用的高质量 Vue 组件，共享Ant Design of React设计工具体系，提炼自企业级中后台产品的交互语言和视觉风格，满足开发中的一般要求。


#### 在 vue cli 3 中定制主题 

本项目在 ant-design-vue 的基础上实现了自定义主题，antd 的样式使用了 Less 作为开发语言，并定义了一系列全局/组件的样式变量，我们可以根据需求进行相应调整。

项目根目录下新建文件vue.config.js
```
// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#3171ff',
          'link-color': '#3171ff',
          'border-radius-base': '4px',
        },
        javascriptEnabled: true,
      },
    },
  },
};
```
#### 按需加载
加载全部的 antd 组件的样式对前端性能是个隐患，因此我们需要对 vue-cli 的默认配置进行自定义。

使用 babel-plugin-import
babel-plugin-import 是一个用于按需加载组件代码和样式的 babel 插件（原理）。
```
yarn add babel-plugin-import --dev
```

修改babel.config.js文件，配置 babel-plugin-import
```
 module.exports = {
  presets: ["@vue/app"],
  plugins: [
    [
      "import",
      { libraryName: "ant-design-vue", libraryDirectory: "es", style: true }
    ]
  ]
};
```

最后在main.js引入模块
```
import { Button } from 'ant-design-vue';
...
Vue.component(Button.name, Button)
```

### config配置全局变量

关于项目全局变量配置在根目录的config.js文件夹，可以根据需要暴露全局变量
本项目的全局变量配置如下，可以作为一般化的全局变量配置
```
  version: 'v2.0',       // 当前版本号
  pageSize: 15,          // 列表单页数据条数
  enablePageTabs: true,  // 是否开启标签页面
  mutiLanguage: true,    // 是否开启多语言
  defaultLanguage: 'en', // 默认语言 cn en id 只有在开启mutiLanguage下有效
  domain,                // 站点当前域名
  websocketHost,         // 接口域名
```

### 数据交互

使用[Axios](https://www.kancloud.cn/yunye/axios/234845)发起接口请求，实现数据交互，Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。

本项目在vue的原型链上扩展了axios方法，在方法在axios的基础上进行了二次封装。

1. 统一处理了axios请求头部公共信息。
2. 区分了需要登录的路由以及不需要登录的路由。
3. 对于需要登录的路由， 手动解决了token两个小时后失效的问题，具体实现方式：axios响应拦截器里，在sessionStorage中写入登录时间t的参数，在axios的请求拦截器中读取现在时间与写入的登录时间做比较如果大于2小时，则重定向到login页面，清空sessionStorage变量。
4. 响应拦截器根据响应状态码对响应进行统一处理。

### 登录及用户校验

每个请求都会在header里带Authorization，Authorization的值由登录接口返回，状态管理中对应的是token，如需更改，提交mutations中的setToken方法，为了XX天免登陆功能，以及防止刷新页面丢失，token还存cookie中，可根据需要改为存sessionStorage或localStorage，注意assets/js/axios.js也需要更改。
登录判断只要判断store里的token有没有值就行了。if(!this.$store.token){do someThing}
Authorization由程序做对称加密或者由OAuth服务提供，如果加密算法需要其他字段请直接与token拼接，比如用户id为86232，则Authorization为token_86232。
除了非必要登录的接口程序需获取header里的Authorization对用户进行校验。

### 命令行自动化流程



#### 安装依赖
```
yarn install
```

#### 开发环境上进行编译和热加载
```
yarn run serve
```

#### 生产环境上进行打包
```
yarn run build
```

#### 检查格式语法
```
yarn run lint
```
- 每次build前先运行风格检查npm run lint，没有报错则表示没问题，npm run lint:fix会修复一些错误，但很多还得自己改

#### 新增一个模版页面
由于后台管理页面过多，且页面结构多具有相似性。故自定义Node Script命令
运行如下命令
```
npm run new
```
1. 命令行询问是否创建新文件夹
如果为yes，则会继续要求输入新文件夹名称
如果为no，则会要求选择一个文件夹作为页面的存放路径
2. 命令行要求输入文件名:
文件名输入成功后，命令行提示“成功自动更新Router（详见xx行处）,菜单栏处请手动修改Login.vue文件”
查看views文件夹的特定路径下生成了所需要的页面，并且这个页面在router.js中注册了路由

