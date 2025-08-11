#!/bin/bash

# 构建项目
echo "Building project..."
pnpm run build

if [ $? -ne 0 ]; then
  echo "Build failed!"
  exit 1
fi

# 进入构建目录
cd dist

# 初始化git仓库
git init
git add -A
git commit -m "Deploy to GitHub Pages"

# 推送到gh-pages分支
echo "Deploying to GitHub Pages..."
git push -f git@github.com:Justinony/my-blob.git main:gh-pages

echo "Deployment completed!"

# 返回项目根目录
cd ..