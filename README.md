# 说明

## 运行说明

- 安装 nodejs (版本需要大于 4.0), 安装 python2 (windows 还需要安装 visual studio 来编译 c++ 模块)
- 安装依赖 `npm install`
- 开启后端服务器 `npm start`
- 客户端开启 socket 连接 `npm run client`

## 常见问题

### windows 安装问题

由于代码中用到了 raw-socket 模块, 该模块需要编译之后才可以使用, 所以在 windows 下安装依赖的时候, 需要先安装编译工具(通常安装 visual studio 就可以), 以及 python2
   
如果同时安装了 python2 与 python3, 可能需要指定 python 2 版本, 如 `npm install --python=path/to/python2`

###windows 运行问题
   
windows 中, 由于某些权限问题, 在调用 ping 功能的时候, 需要有管理权限, 既需要再管理员模式下运行 `npm start`
   

## 结构说明

```
├── README.md               - 说明文档
├── app.js                  - 配置文件
├── bin                     
│   └── www                 - 服务器运行的脚本文件
├── client
│   └── app.js              - 客户端运行的脚本文件
├── models                  - 数据库模型
│   ├── client.js           - 主机表模型
│   ├── db.js               - 数据库连接实例
│   └── user.js             - 用户表模型
├── package.json            - 依赖文件
├── public                  - 静态文件
│   ├── images
│   ├── javascripts
│   └── styles
├── routes                  - 路由文件
│   ├── api.js
│   ├── client.js
│   ├── index.js
│   ├── middleware.js
│   ├── session.js
│   └── user.js
├── socket                  - 服务器 socket 模块
│   └── index.js
└── views                   - 服务器前端模板
    ├── client.ejs
    ├── error.ejs
    ├── home.ejs
    ├── index.ejs
    └── ping.ejs

```
