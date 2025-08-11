# 部署指南

## 问题分析

在使用 `gh-pages` 部署时遇到了 HTTP 400 错误：
```
RPC failed; HTTP 400 curl 22 The requested URL returned error: 400
send-pack: unexpected disconnect while reading sideband packet
```

这个错误通常由以下原因导致：
1. **文件过大**：构建后的文件可能超过了 GitHub 的推送限制
2. **网络问题**：推送过程中网络连接不稳定
3. **权限问题**：可能缺少对仓库的写入权限

## 解决方案

### 方案1：GitHub Actions 自动部署（推荐）

项目已配置 GitHub Actions 工作流，会在推送到 `main` 分支时自动部署：

1. **确保 GitHub Pages 设置正确**：
   - 进入仓库设置 → Pages
   - Source 选择 "GitHub Actions"
   - 保存设置

2. **推送代码触发部署**：
   ```bash
   git add .
   git commit -m "Update deployment configuration"
   git push origin main
   ```

3. **查看部署状态**：
   - 在 GitHub 仓库的 Actions 标签页查看工作流状态
   - 部署完成后可通过 `https://justinony.github.io/my-blob/` 访问

### 方案2：手动部署脚本

如果 GitHub Actions 不可用，可以使用手动部署脚本：

```bash
pnpm run deploy:manual
```

或直接运行：
```bash
./deploy.sh
```

### 方案3：修复 gh-pages 部署

如果仍想使用 `gh-pages` 包，可以尝试以下解决方案：

1. **增加 Git 缓冲区大小**：
   ```bash
   git config http.postBuffer 524288000
   ```

2. **使用 SSH 而不是 HTTPS**：
   ```bash
   git remote set-url origin git@github.com:Justinony/my-blob.git
   ```

3. **分批推送**：
   ```bash
   # 清理 gh-pages 缓存
   rm -rf node_modules/.cache/gh-pages
   pnpm run deploy
   ```

## 构建优化

已对 Vite 配置进行优化，实现代码分割：

- **Vue 相关库**：单独的 chunk
- **Element Plus**：单独的 chunk  
- **图标库**：单独的 chunk
- **Supabase**：单独的 chunk
- **状态管理**：单独的 chunk

这样可以减少单个文件的大小，提高加载性能。

## 验证部署

部署完成后，访问以下 URL 验证：
- **生产环境**：https://justinony.github.io/my-blob/
- **本地预览**：`pnpm run preview`

## 故障排除

1. **如果 GitHub Actions 失败**：
   - 检查仓库的 Pages 设置
   - 确认工作流文件语法正确
   - 查看 Actions 日志获取详细错误信息

2. **如果手动部署失败**：
   - 确认有仓库的写入权限
   - 检查网络连接
   - 尝试使用 SSH 密钥认证

3. **如果页面无法访问**：
   - 确认 GitHub Pages 已启用
   - 检查 `vite.config.ts` 中的 `base` 路径配置
   - 等待 DNS 传播（可能需要几分钟）