# luci-app-cmcc-portal

用于 OpenWrt / iStoreOS 的江苏移动 `wlan.jsyd139.com` Captive Portal 自动认证 LuCI 插件。

> 当前版本：`1.0.2`

## 功能

- LuCI 网页配置
- 支持有线 WAN 场景
- 自动触发 Captive Portal
- 自动获取动态 `paramStr`
- 自动维护 `JSESSIONID` / `X-LB` 会话 Cookie
- 支持浏览器“记住密码”Cookie 登录模式
- 支持普通账号密码实验模式
- 定时检测联网状态
- 认证失效后自动重新登录
- 显示 WAN IPv4、认证状态和最近日志
- 纯 Shell + LuCI JavaScript，无架构相关二进制文件

## 适用范围

本项目当前针对以下 Portal 流程开发：

```text
http://wlan.jsyd139.com/
http://wlan.jsyd139.com/style/default_szlan/index.jsp?paramStr=...
http://wlan.jsyd139.com/authServlet
```

目前主要在 iStoreOS / OpenWrt 24.10 环境下开发和测试。

软件包本身为 `Architecture: all`，不包含特定 CPU 架构二进制文件，因此可用于 x86_64、ARM64、ARM、MIPS 等架构；但不同 OpenWrt / LuCI 大版本的前端兼容性仍需要实际测试。

## 依赖

```text
curl
luci-base
```

## 安装

### 方式一：安装 IPK

将编译好的 IPK 上传到路由器后执行：

```sh
opkg update
opkg install curl luci-base
opkg install /tmp/luci-app-cmcc-portal_1.0.2-1_all.ipk
```

安装完成后进入：

```text
网络 → 江苏移动认证
```

如果菜单未立即出现，可尝试：

```sh
rm -f /tmp/luci-indexcache
/etc/init.d/rpcd restart
/etc/init.d/uhttpd restart
```

### 方式二：加入 OpenWrt SDK / Buildroot 编译

将本仓库放入 OpenWrt 源码树的 `package/` 下，例如：

```sh
cd openwrt/package
git clone https://github.com/ErrorCode36459/luci-app-cmcc-portal.git
```

然后：

```sh
cd ..
make menuconfig
```

在 LuCI 应用中选择 `luci-app-cmcc-portal` 后编译。

## 配置说明

### 登录模式

#### 1. 记住密码 Cookie 模式（推荐）

从浏览器已经成功登录的 `authServlet` 请求中复制 Cookie 字符串，插件至少需要以下字段：

```text
UserName=...
province=...
UserType=...
PassWord=...
```

可以直接粘贴完整 Cookie，例如：

```text
UserName=xxx; province=xxx; UserType=xxx; PassWord=xxx; JSESSIONID=xxx; X-LB=xxx
```

插件会自动忽略旧的 `JSESSIONID` 和 `X-LB`，因为这两个会话 Cookie 必须在每次 Portal 会话中动态重新获取。

#### 2. 普通账号密码模式（实验）

该模式按照登录页默认表单字段提交，但部分 Portal 版本可能在 JavaScript 中额外处理参数，因此不保证可用。

## 后台命令

```sh
/usr/bin/cmcc-portal login
/usr/bin/cmcc-portal check
/usr/bin/cmcc-portal status
/usr/bin/cmcc-portal logs
/usr/bin/cmcc-portal restart
```

后台服务：

```sh
/etc/init.d/cmcc-portal start
/etc/init.d/cmcc-portal stop
/etc/init.d/cmcc-portal restart
/etc/init.d/cmcc-portal enable
```

## 工作流程

```text
检测互联网
   ↓
未认证
   ↓
访问 HTTP 地址触发 Portal
   ↓
获取 wlan.jsyd139.com 页面
   ↓
解析 index.jsp?paramStr=...
   ↓
加载认证页面并建立 JSESSIONID / X-LB
   ↓
读取动态 paramStr
   ↓
提交 /authServlet
   ↓
检测互联网是否放行
```

## 安全提示

- 不要把真实账号、密码或 Cookie 提交到 GitHub。
- `/etc/config/cmcc_portal` 中可能包含登录凭据，请限制文件权限。
- 浏览器抓包中的 `PassWord`、`UserName` Cookie 也属于敏感信息。

## 已知限制

- 当前仅针对 `wlan.jsyd139.com` 的已知 Portal 页面结构进行适配。
- Portal 页面结构、字段或认证策略变化后可能需要更新代码。
- 同一账号的并发数量、共享限制、设备限制等服务端策略无法由插件绕过。
- 不保证适配其他省份移动、校园网、酒店 Portal 或其他运营商认证系统。

## 版本记录

### 1.0.2

- LuCI 前端改为现代 JavaScript View
- 使用 `menu.d` + rpcd ACL
- 不再依赖旧式 Lua CBI / `luci-compat`
- 修复 iStoreOS 24.10 菜单可见但页面无法打开的问题
- 增加 LuCI 状态、日志和操作按钮

## License

MIT
