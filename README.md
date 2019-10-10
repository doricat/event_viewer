# event_viewer
---
## 这个项目是干啥的？
这只是一个新手学习react.js所写的demo；实现了一个简单的事件（日志）查看器，包括：
- 实时推送
- 历史日志查看
- 日志（分类）统计
- 应用程序、个人资料管理等

## 如何运行？
如果不修改任何设置，请使用visual studio 2019打开，编译后在项目根目录（Viewer.Web）运行  
`dotnet ef database update`  
创建数据库，使用项目根目录的seed_data.sql填充基本数据。  

客户端代码在Viewer.Web/ClientApp 中，提交的时候是通过代理访问api，可以使用  
`yarn start`  
来启动客户端，如果没意外就可以访问了。。。  

对了，预设的用户名和密码分别是  
123qwe@1231qwe.com   
123Qwe?  

## 最后
出于演示目的，当前只有本系统的日志可以写入，实现了一个fake logger，直接将日志推送到本地hosted service处理
