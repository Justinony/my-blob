# GitHub Pages 部署指南

本项目已配置好 GitHub Pages 部署，支持两种部署方式：自动部署和手动部署。

## 🚀 自动部署（推荐）

### 前提条件
1. 确保你的代码已推送到 GitHub 仓库的 `main` 分支
2. 在 GitHub 仓库设置中启用 GitHub Pages

### 启用 GitHub Pages
1. 进入你的 GitHub 仓库页面
2. 点击 **Settings** 标签
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** 部分选择 **GitHub Actions**
5. 保存设置

### 自动部署流程
- 每当你向 `main` 分支推送代码时，GitHub Actions 会自动：
  1. 检出代码
  2. 设置 Node.js 和 pnpm 环境
  3. 安装依赖
  4. 构建项目
  5. 部署到 GitHub Pages

- 部署完成后，你的网站将在以下地址可访问：
  ```
  https://[你的用户名].github.io/my-blob/
  ```

## 🛠️ 手动部署

如果你想手动部署到 GitHub Pages，可以使用以下命令：

```bash
# 构建并部署
pnpm run deploy

# 或者分步执行
pnpm run build
pnpm run deploy
```

## 📋 部署脚本说明

项目中已添加以下 npm 脚本：

- `predeploy`: 在部署前自动构建项目
- `deploy`: 使用 gh-pages 将 dist 目录部署到 gh-pages 分支

## 🔧 配置说明

### Vite 配置
- `vite.config.ts` 中的 `base` 路径已设置为 `/my-blob/`，与仓库名匹配
- 生产环境下会使用正确的基础路径

### GitHub Actions 工作流
- 位置：`.github/workflows/deploy.yml`
- 触发条件：推送到 `main` 分支
- 使用 pnpm 进行依赖管理和构建
- 自动部署到 GitHub Pages

## 🚨 注意事项

1. **仓库名称**：确保 `vite.config.ts` 中的 `base` 路径与你的 GitHub 仓库名称一致

2. **分支保护**：如果你的 `main` 分支有保护规则，确保 GitHub Actions 有权限推送

3. **环境变量**：如果项目使用了环境变量（如 Supabase 配置），需要在 GitHub Actions 中配置相应的 secrets

4. **首次部署**：首次启用 GitHub Pages 后，可能需要几分钟才能访问网站

## 🔍 故障排除

### 部署失败
1. 检查 GitHub Actions 的运行日志
2. 确保所有依赖都在 `package.json` 中正确声明
3. 验证构建命令能在本地正常运行

### 页面无法访问
1. 确认 GitHub Pages 已正确启用
2. 检查仓库是否为公开仓库（私有仓库需要 GitHub Pro）
3. 验证 `base` 路径配置是否正确

### 资源加载失败
1. 检查 `vite.config.ts` 中的 `base` 配置
2. 确保所有静态资源路径都是相对路径

## 📚 相关链接

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [gh-pages 包文档](https://www.npmjs.com/package/gh-pages)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)