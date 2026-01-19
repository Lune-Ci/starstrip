# 配置第三方登录指南 (OAuth Setup Guide)

本项目使用 **NextAuth.js** 进行身份验证。要启用 Google、Facebook 等第三方登录，您需要从各自的开发者平台获取 **Client ID** 和 **Client Secret**，并将它们填入 `.env` 文件中。

Supabase 本身**不提供**这些密钥，您必须直接向服务提供商申请。

## 1. Google 登录配置

1.  访问 [Google Cloud Console](https://console.cloud.google.com/)。
2.  创建一个新项目或选择现有项目。
3.  进入 **APIs & Services** > **Credentials**。
4.  点击 **Create Credentials** > **OAuth client ID**。
5.  选择应用类型为 **Web application**。
6.  设置 **Authorized redirect URIs**（授权重定向 URI）：
    *   **本地开发**: `http://localhost:3000/api/auth/callback/google`
    *   **生产环境**: `https://您的域名.com/api/auth/callback/google`
7.  点击创建，您将获得 **Client ID** 和 **Client Secret**。
8.  填入您的 `.env` 文件：
    ```env
    GOOGLE_CLIENT_ID=您的_client_id
    GOOGLE_CLIENT_SECRET=您的_client_secret
    ```

## 2. GitHub 登录配置

1.  访问 [GitHub Developer Settings](https://github.com/settings/developers)。
2.  点击 **New OAuth App**。
3.  填写应用信息：
    *   **Homepage URL**: `http://localhost:3000` (本地) 或您的生产域名。
    *   **Authorization callback URL**:
        *   本地: `http://localhost:3000/api/auth/callback/github`
        *   生产: `https://您的域名.com/api/auth/callback/github`
4.  点击注册应用，获取 **Client ID** 和生成 **Client Secret**。
5.  填入您的 `.env` 文件：
    ```env
    GITHUB_CLIENT_ID=您的_client_id
    GITHUB_CLIENT_SECRET=您的_client_secret
    ```

## 3. Facebook 登录配置

1.  访问 [Meta for Developers](https://developers.facebook.com/)。
2.  创建新应用，选择 **Allow people to log in with their Facebook account**。
3.  在设置中找到 **App ID** 和 **App Secret**。
4.  在 **Facebook Login** > **Settings** 中，添加 **Valid OAuth Redirect URIs**：
    *   `http://localhost:3000/api/auth/callback/facebook`
5.  填入您的 `.env` 文件：
    ```env
    FACEBOOK_CLIENT_ID=您的_app_id
    FACEBOOK_CLIENT_SECRET=您的_app_secret
    ```

## 常见问题

*   **Supabase 的作用是什么？**
    Supabase 可以作为一个数据库或身份验证后端（如果您使用 Supabase Auth）。但即使使用 Supabase Auth，您仍然需要在 Supabase 的控制面板中填入上述从 Google/Facebook 获取的 ID 和 Secret。由于本项目目前直接使用 NextAuth.js 连接，所以直接在 `.env` 中配置是最简单的方式。

*   **本地开发 vs 生产环境**
    当您部署到 Vercel 或其他服务器时，记得在生产环境的 `.env` 变量设置中也添加这些密钥，并将回调地址（Callback URL）更新为您的真实域名。
