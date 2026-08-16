# v1.0.2

首个公开测试版本，面向 OpenWrt / iStoreOS 的江苏移动 `wlan.jsyd139.com` Captive Portal 自动认证。

## 主要功能

- LuCI 网页配置界面
- 支持有线 WAN 场景
- 自动触发 Captive Portal
- 自动获取动态 `paramStr`
- 自动维护 `JSESSIONID` / `X-LB`
- 支持浏览器“记住密码”Cookie 登录模式
- 定时检测联网状态并自动重登
- 显示认证状态、WAN IPv4 和最近日志
- `Architecture: all`，不包含特定 CPU 架构二进制文件

## 1.0.2 变更

- LuCI 前端改为现代 JavaScript View
- 使用 `menu.d` + rpcd ACL
- 不再依赖旧式 Lua CBI / `luci-compat`
- 修复 iStoreOS 24.10 菜单可见但页面无法正常打开的问题
- 增加状态、日志及立即认证等操作入口

## 兼容性

主要在 iStoreOS / OpenWrt 24.10 环境开发。其他 OpenWrt / LuCI 大版本请以实机测试结果为准。

## SHA256

`luci-app-cmcc-portal_1.0.2-1_all.ipk`

`5592ca978f676b788a6f8139cfaab18cee17b83b29b02d913981f170a7f78847`

> 注意：当前认证逻辑专门针对 `wlan.jsyd139.com` 已知 Portal 流程，不代表支持所有中国移动或其他运营商 Portal。
