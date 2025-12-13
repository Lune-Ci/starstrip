# 启动开发服务器指南

## 方法 1：使用 npm（推荐）

在终端中运行以下命令：

```bash
cd 项目目录
npm install
npm run dev
```

## 方法 2：如果 npm install 失败，使用 pnpm

```bash
cd 项目目录
npm install -g pnpm
pnpm install
pnpm dev
```

## 访问地址

服务器启动后，访问：

- `http://localhost:3000`

如果 3000 端口被占用，Next.js 会自动使用下一个可用端口（如 3001、3002 等），请查看终端输出确认。

## Windows 启动（推荐）

在资源管理器中右键以管理员打开终端或 PowerShell，进入项目目录后执行：

```
start_windows.bat dev 3000
```

- 可选端口：`start_windows.bat dev 3001` 等。脚本会自动设置 `NEXTAUTH_URL=http://localhost:<端口>` 并启动浏览器。

## 验证代码更新

确保以下文件已更新：

- ✅ app/attractions/page.tsx - 响应式布局（手机 2 列，平板 3-4 列）
- ✅ app/esg-data/page.tsx - 折叠的 Trip History 和图标化 Tips
- ✅ app/route-planner/page.tsx - 从第一步开始
- ✅ app/route-planner/itinerary/page.tsx - 保存路线和 PDF 功能
- ✅ app/user-center/page.tsx - 历史路线查看
- ✅ lib/attractions-data.ts - 新增乌镇、广州、香港、澳门
- ✅ lib/translations.ts - 完善法语翻译

## 如果遇到问题

1. 清理缓存：
   - macOS/Linux：`rm -rf .next`
   - Windows：`rmdir /s /q .next`
2. 重新安装依赖：`npm install` 或 `pnpm install`
3. 检查端口占用：`lsof -ti:3000`
4. 使用不同端口：

   - macOS/Linux：`PORT=3001 npm run dev`
   - Windows：`set PORT=3001 && npm run dev`

5. 环境变量：确保 `NEXTAUTH_URL` 与当前端口一致
   - macOS/Linux：`export NEXTAUTH_URL=http://localhost:3000`
   - Windows：`set NEXTAUTH_URL=http://localhost:3000`

## 第三方登录（NextAuth）配置

项目当前保留了 Google 登录，并新增了 Facebook 登录；Apple 登录已移除（可选）。

### 环境变量（`.env.local`）示例

```
# NextAuth 基础
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=replace_with_a_long_random_string

# Google OAuth（免费）
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Facebook OAuth（免费）
FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret

# GitHub OAuth（免费）
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# LinkedIn OAuth（免费）
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# 开发查看用户后台数据（仅开发环境启用）
ENABLE_ADMIN_API=true
```

> 说明：YouTube 登录属于 Google 生态，使用 Google Provider 即可；Instagram 并非通用的站点登录 OAuth，且需审核，建议优先使用 Google/Facebook。

### Apple 登录（可选）

如果未来需要启用 Apple 登录，可在保留的 NextAuth 路由中重新添加 Apple Provider，并配置：

### 1) Apple 开发者后台配置

- 创建 Service ID（作为 `APPLE_CLIENT_ID`，例如 `com.starstrip.web`）。
- 在 Keys 中创建并勾选 Sign In with Apple，关联到你的 Service ID（得到 `.p8` 私钥、`APPLE_KEY_ID`）。
- 记录 `APPLE_TEAM_ID`（团队 ID）。
- 在 Service ID 的 Return URLs 中添加你的站点回调：
  - 开发（本地）允许 HTTP 的 `localhost`：
    - `http://localhost:3000/api/auth/callback/apple`
    - `http://localhost:3001/api/auth/callback/apple`
  - 生产环境（需 HTTPS 且域名验证）：
    - `https://你的正式域名/api/auth/callback/apple`

### Apple 环境变量（启用时）

```
APPLE_CLIENT_ID=your_service_id
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
APPLE_TEAM_ID=YOUR_TEAM_ID
APPLE_KEY_ID=YOUR_KEY_ID
```

注意：项目已支持将 `APPLE_PRIVATE_KEY` 中的 `\n` 转换为真实换行，因此可以安全地把 `.p8` 内容以转义换行的方式写入 `.env.local`。

### 3) 启动与验证

- 启动开发服务器（例如 3001 端口）：
  - macOS/Linux：`export NEXTAUTH_URL=http://localhost:3001 && PORT=3001 npm run dev`
  - Windows：`start_windows.bat dev 3001`（脚本会自动设置 `NEXTAUTH_URL`）
- 访问登录页：`http://localhost:3001/api/auth/signin`，应显示 Apple 登录按钮。
- 完成授权后，检查会话：`http://localhost:3001/api/auth/session`，应返回包含 `user` 的 JSON。

### 4) 常见问题

- “Apple OAuth disabled” 日志：表示缺失 Apple 相关环境变量，请补齐 `APPLE_CLIENT_ID / APPLE_PRIVATE_KEY / APPLE_TEAM_ID / APPLE_KEY_ID`。
- 回调不匹配错误：确认 Apple 后台的 Return URLs 与实际访问的协议/域名/端口完全一致（包含 `http/https` 与端口）。
- 生产环境需要 HTTPS 与域名验证；本地仅 `localhost` 允许使用 HTTP。
