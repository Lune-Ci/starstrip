# 线上部署修复指南

检测到线上环境 (Vercel) 出现 500 错误，这是因为缺少关键的环境变量配置。请按照以下步骤修复：

## 1. 登录 Vercel 后台

进入你的 Vercel 项目控制台，点击 **Settings (设置)** -> **Environment Variables (环境变量)**。

## 2. 添加以下变量

### 变量名: `NEXTAUTH_SECRET`

**值 (Value):**

```
boq9Cw5e5Iv6J2NEQRTEZSl9O4CSrXKlgLz7JkP4cWc=
```

_(这是为你生成的一个随机安全密钥)_

### 变量名: `NEXTAUTH_URL`

**值 (Value):**
请填写你实际的 Vercel 项目域名，例如：

```
https://your-project-name.vercel.app
```

_(注意：请在 Vercel 控制台的 "Domains" 页面查看分配给你的实际域名，不要直接使用 starstrip.vercel.app，除非你确定拥有该域名)_
_(请确保这是你实际访问的线上域名，不要带 /api/auth 等后缀)_

## 3. 刷新本地 DNS 缓存 (如果电脑无法访问)

如果你确定域名正确且手机能打开，但电脑打不开 (DNS_PROBE_FINISHED_NXDOMAIN)，请尝试刷新 DNS：

**Mac 终端命令 (打开 Terminal 运行):**

```bash
sudo killall -HUP mDNSResponder
```

_(注意：输入此命令后通常没有任何提示，这是正常的，代表执行成功)_

或者

```bash
dscacheutil -flushcache
```

_(同样，此命令执行成功后也不会有任何提示，直接显示下一行命令行)_

**Windows 命令行 (以管理员身份运行 CMD):**

```bash
ipconfig /flushdns
```

**尝试修改 DNS 服务器:**
如果刷新缓存无效，尝试将电脑的 DNS 服务器修改为公共 DNS：

- **Google DNS**: `8.8.8.8` 和 `8.8.4.4`
- **Cloudflare DNS**: `1.1.1.1`

## 4. 重新部署

添加完变量后，建议去 **Deployments** 页面，找到最新的部署，点击三个点 -> **Redeploy**，确保环境变量生效。

## 4. 验证

重新访问网站，应该可以正常打开了。

---

**技术说明：**
我们已更新了代码 (`app/api/auth/[...nextauth]/route.ts`)，修复了 NextAuth 的处理程序配置，增加了 POST 请求的支持，并添加了更完善的错误处理逻辑。
