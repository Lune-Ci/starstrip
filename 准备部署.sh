#!/bin/bash

# 准备部署脚本
# 这个脚本会检查项目是否准备好部署

echo "=========================================="
echo "检查项目部署准备状态"
echo "=========================================="

# 检查大文件
echo ""
echo "【检查大文件】"
find . -type f -size +50M -not -path "./node_modules/*" -not -path "./.next/*" -not -path "./.git/*" 2>/dev/null | while read file; do
    size=$(du -h "$file" | cut -f1)
    echo "⚠️  发现大文件: $file ($size)"
done

# 检查.gitignore
echo ""
echo "【检查.gitignore配置】"
if grep -q "图片库" .gitignore 2>/dev/null; then
    echo "✓ 图片库文件夹已排除"
else
    echo "⚠️  图片库文件夹未在.gitignore中"
fi

if grep -q "Suzhou" .gitignore 2>/dev/null; then
    echo "✓ Suzhou文件夹已排除"
else
    echo "⚠️  Suzhou文件夹未在.gitignore中"
fi

if grep -q "*.zip" .gitignore 2>/dev/null; then
    echo "✓ ZIP文件已排除"
else
    echo "⚠️  ZIP文件未在.gitignore中"
fi

# 检查是否有.env文件
echo ""
echo "【检查环境变量文件】"
if [ -f ".env" ] || [ -f ".env.local" ]; then
    echo "⚠️  发现.env文件，确保已添加到.gitignore"
else
    echo "✓ 没有.env文件"
fi

# 计算public文件夹大小
echo ""
echo "【public文件夹大小】"
public_size=$(du -sh public 2>/dev/null | cut -f1)
echo "public文件夹: $public_size"

# 检查package.json
echo ""
echo "【检查package.json】"
if [ -f "package.json" ]; then
    echo "✓ package.json存在"
    if grep -q '"build"' package.json; then
        echo "✓ 构建脚本已配置"
    fi
else
    echo "✗ package.json不存在"
fi

echo ""
echo "=========================================="
echo "检查完成！"
echo "=========================================="
echo ""
echo "下一步："
echo "1. 如果发现大文件，考虑压缩或优化"
echo "2. 运行: git add ."
echo "3. 运行: git commit -m '准备部署'"
echo "4. 在GitHub创建仓库并推送"
echo "5. 在Vercel上部署（推荐）"

