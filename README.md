# swk-cpanel-vue
> 带有权限控制的后台系统基础模板

## 安装向导
```bash
# 克隆项目
git clone http://git.swk.hk.cn/swk_base/swk-cpanel-vue.git

# 安装依赖
cd swk-cpanel-vue
npm install

# 开发阶段热加载运行在本地 localhost:9528 上
npm run dev

# build for production with minification(生成环境构建)
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## 项目架构与参考
这个后台基础模板项目主要是参考 github 上的一个项目 [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin), 结合自己另一个后台接口基项目[swk-cpanel-vue-api](http://git.swk.hk.cn/swk_base/swk-cpanel-vue-api.git)搭建的.

前序准备:  
你的本地环境需要安装 node 和 git。项目的技术栈基于 [ES2015+](http://es6.ruanyifeng.com/)、[vue](https://cn.vuejs.org/index.html)、[vuex](https://vuex.vuejs.org/zh-cn/)、[vue-router](https://router.vuejs.org/zh-cn/) 和 [element-ui](https://github.com/ElemeFE/element)，提前了解和学习这些知识会对使用本项目有很大的帮助。

目录结构:  
```bash
  ├── build                      // 构建相关,这些文件都是配置好的,一般不需要改  
  ├── config                     // 配置相关,里面包含dev(开发)和prod(生产)环境的相关配置,如api的请求域名在开发和生产环境通常不一样,可在此配置
  ├── src                        // 源代码
  │   ├── api                    // 所有api请求
  │   ├── assets                 // 主题 字体等静态资源
  │   ├── components             // 全局公用组件
  │   ├── icons                  // 项目所有 svg icons
  │   ├── router                 // 路由
  │   ├── store                  // 全局 store管理
  │   ├── styles                 // 全局样式
  │   ├── utils                  // 全局公用方法
  │   ├── views                  // 视图,对应路由跳转的页面
  │   ├── App.vue                // 入口页面
  │   ├── main.js                // 入口 加载组件 初始化等
  │   └── permission.js          // 权限管理
  ├── static                     // 第三方不打包资源
  │   └── Tinymce                // 富文本
  ├── .babelrc                   // babel-loader 配置
  ├── eslintrc.js                // eslint 配置项
  ├── .gitignore                 // git 忽略项
  ├── favicon.ico                // favicon图标
  ├── index.html                 // html模板
  └── package.json               // package.json
```

## 关于router 和vuex 说明
对于普通h5页面,一般来说点击超链接 `<a href="http://example.com/user">用户列表</a>` 会跳转到一个新页面,跳转成功后,一般会请求后台api接口返回json数据后填充数据到页面上,渲染页面.  
在单页面应用里(spa),页面跳转现在一般通过h5的history API 进行控制,页面跳转控制权从后端转移到了前端,由前端控制各个页面的相互跳转,做到尽可能的前后端分离,一般后台只需要提供api接口返回数据给前端即可.
本项目采用vue-router 进行页面路由跳转,具体体现在左侧菜单栏的点击后页面跳转,在router里,一个路由链接一般对应一个vue组件(即路由链接跳转到的页面),在vue组件里,一般在`created()`组件钩子里请求后台api数据用于给vue动态渲染页面.  
关于为什么要使用vuex:  
比如对于用户的信息(头像,昵称等) 在每个组件页面都需要用到,就适合放在一个全局的状态管理容器里,供不同的组件获取使用.而对个可能其他需要同时在多个组件共同引用的数据都可以考虑通过vuex来进行全局管理.  
对于后台开发人员来看,vuex就类似于httpSession,在多个不同页面可以从session里取出唯一的信息用于页面展示    
而不同路由链接跳转到的组件页面所需数据如果只在当前页面会使用到,就不需要存进vuex中,在当前组件里通过api动态请求即可

## 权限控制与请求说明
访问后台资源一般先需经过登录页面(用户名和密码)进行认证,然后返回一个 `token` 凭证,登录成功后将`token`保存在本地`cookie`中,之后请求后台api都在http请求头加上一行 `Authorization token` 身份凭证. 凭证有效期对于前端是在与浏览器交互的会话期间(即浏览器关闭后该token就被丢弃,再次访问后台需重新登录认证),而对于后台来说,由于使用的是基于 `JWT(json web token)` 的 token凭证,只要设置`JWT`的 `expired` 超时时间即可

对于登录认证本项目已实现,不需要再次开发  
对于请求后台api自动带上请求头**Authorization**  
实现方式:  
通过`axios`的请求拦截器在每次请求之前往http请求头里塞入从本地`cookie`取出的身份凭证`token`  
本项目已经实现,不需要再次开发

关于用户的角色与权限说明:  
本项目的权限控制基于经典的 ***用户-角色-权限*** 模型 来实现, 一个用户有多个角色,一个角色有多个权限.  
即一个用户拥有多个权限.  

分出角色这一层出来主要是为了分类管理权限,一般对于一个资源来说,会有增删改查4个操作  
举例子比如对于用户这个资源来说  
对应的权限是用户新增,用户删除,用户修改,用户查询,对应成资源标识: user:add,user:delete,user:update,user:search  

用户不直接与资源关联,因为资源操作太多,管理起来麻烦,而与角色挂钩,通过对每个不同的角色分配多个资源操作,然后对不同的用户分配不同的角色,通过对用户角色的查询,再查询出每个角色对应的权限集合,取这些权限集合的并集,就得到了用户最终拥有的权限集合,访问需要经过授权的资源时 如: 添加用户 user:add 只要用户的权限列表['user:add','user:delete','user:update','user:search']包含 user:add 即可访问  
对于本项目来说,这种细粒度的权限控制放在了后台api请求上面,不直接在前端页面上体现  
前端页面只关心用户的角色即可,需要用到角色的地方就在于左侧菜单栏的动态显示,如用户拥有某个角色,就显示某个菜单选项供用户进行操作
而左侧菜单是基于`vue路由 router`列表动态生成的,在router源信息(meta)上加入**roles**这个字段,表示这个菜单项需要拥有用户角色**roles**才显示
  
示例(直接贴代码):
```
import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    role: ['admin','editor']     will control the page role (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('404'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: '首页', icon: 'dashboard', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/form',
    component: Layout,
    children: [
      { path: 'index', name: 'Form', component: _import('page/form'), meta: { title: '表单', icon: 'form' }}
    ]
  },

  {
    path: '/user',
    component: Layout,
    name: 'User',
    redirect: '/user/index',
    meta: { title: '用户管理', icon: 'people' },
    children: [
      { path: 'index', name: 'userList', component: _import('user/index'), meta: { role: ['admin'], title: '用户列表', icon: 'user' }},
      { path: 'save', name: 'saveUser', component: _import('user/save'), meta: { title: '新增用户', icon: 'wechat' }}
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
```
关于 `constantRouterMap` 是不需要通过角色控制的路由表,而 `asyncRouterMap` 这个是要需要登录认证后获取token后再调用api拉取用户信息后,根据用户角色生成async路由后动态加入当前用户路由表中.

## 关于响应数据格式与全局异常处理
后台api接口返回数据格式统一采用以下格式,方便前后端协作
```
{
    "code": 20000, //状态码
    "message": "SUCCESS", //简要信息
    "data": 响应具体数据
}
```
当 code 为20000时,代表请求成功.  
全局异常处理:通过`axios`的响应拦截器实现, 显示错误信息或重定向到登录页面,具体逻辑见api包下的`fetch.js`文件

## 开发指南
关于怎么在此种子项目上进行开发,由于登录认证和根据路由表动态生成菜单已经实现,所以需要什么新功能只要路由表里加入新的链接和链接对应的组件即可,再在该组件上进行h5页面开发即可

## Related Project
[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)

[electron-vue-admin](https://github.com/PanJiaChen/electron-vue-admin)