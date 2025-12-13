@echo off
setlocal enabledelayedexpansion

title Starstrip Windows 启动器
echo ==============================================
echo   Starstrip 项目 Windows 启动器 (.bat)
echo   使用:  start_windows.bat [dev|prod] [PORT]
echo   示例:  start_windows.bat dev 3001
echo          start_windows.bat prod 3000
echo ==============================================

rem 读取参数: MODE(默认 dev) 与 PORT(默认 3000)
if "%1"=="" (
  set MODE=dev
) else (
  set MODE=%1
)

set DEFAULT_PORT=3000
if not "%2"=="" (
  set PORT=%2
)
if "%PORT%"=="" (
  set PORT=%DEFAULT_PORT%
)

echo [信息] 模式: %MODE%  端口: %PORT%

rem 检查 Node 与 npm 是否可用
where node >nul 2>&1
if errorlevel 1 (
  echo [错误] 未检测到 Node.js。请安装: https://nodejs.org/
  goto :PAUSE_EXIT
)

where npm >nul 2>&1
if errorlevel 1 (
  echo [错误] 未检测到 npm。请安装 Node.js 或改用 pnpm/yarn。
  goto :PAUSE_EXIT
)

echo.
echo [步骤] 安装依赖...
npm install
if errorlevel 1 (
  echo [错误] 依赖安装失败，请检查网络或重试。
  goto :PAUSE_EXIT
)

if /I "%MODE%"=="prod" goto :PROD
goto :DEV

:DEV
echo.
echo [步骤] 启动开发服务器 (next dev)...
set PORT=%PORT%
rem 确保 NextAuth URL 与端口一致（环境变量优先于 .env.local）
set NEXTAUTH_URL=http://localhost:%PORT%
if "%NEXTAUTH_SECRET%"=="" set NEXTAUTH_SECRET=dev-secret-please-change
echo [提示] 将在浏览器打开: http://localhost:%PORT%/
start "" http://localhost:%PORT%/
npm run dev
goto :END

:PROD
echo.
echo [步骤] 构建生产包 (next build)...
npm run build
if errorlevel 1 (
  echo [错误] 构建失败，请检查错误输出。
  goto :PAUSE_EXIT
)
echo.
echo [步骤] 启动生产服务器 (next start)...
set PORT=%PORT%
set NEXTAUTH_URL=http://localhost:%PORT%
if "%NEXTAUTH_SECRET%"=="" set NEXTAUTH_SECRET=dev-secret-please-change
echo [提示] 将在浏览器打开: http://localhost:%PORT%/
start "" http://localhost:%PORT%/
npm run start
goto :END

:PAUSE_EXIT
echo.
pause
exit /b 1

:END
endlocal