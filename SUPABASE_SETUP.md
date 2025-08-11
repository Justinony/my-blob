# Supabase 数据库配置指南

本项目已集成 Supabase 数据库，用于替换原有的 mock 数据。以下是完整的配置和使用指南。

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并注册账号
2. 创建新项目
3. 等待项目初始化完成

## 2. 配置环境变量

1. 复制项目根目录下的 `.env` 文件
2. 在 Supabase 项目设置中找到以下信息：
   - Project URL
   - API Keys (anon/public key)

3. 更新 `.env` 文件：
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. 初始化数据库

### 方法一：使用 SQL 编辑器

1. 在 Supabase 控制台中打开 SQL 编辑器
2. 复制 `database/init.sql` 文件的内容
3. 执行 SQL 脚本创建表结构和初始数据

### 方法二：使用 Supabase CLI

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 链接到你的项目
supabase link --project-ref your-project-ref

# 运行迁移
supabase db push
```

## 4. 数据库表结构

项目包含以下主要表：

- **users**: 用户信息
- **categories**: 文章分类
- **tags**: 文章标签
- **articles**: 文章内容
- **article_tags**: 文章标签关联
- **comments**: 文章评论

## 5. 行级安全策略 (RLS)

数据库已配置了行级安全策略：

- 所有人可以读取已发布的文章
- 认证用户可以管理自己的文章
- 认证用户可以创建评论
- 用户只能管理自己的数据

## 6. 功能特性

### 已实现的功能

- ✅ 文章 CRUD 操作
- ✅ 分类管理
- ✅ 标签管理
- ✅ 文章搜索
- ✅ 阅读量统计
- ✅ 点赞功能
- ✅ 评论系统
- ✅ 用户管理

### 数据服务层

项目提供了完整的数据服务层 (`src/services/database.ts`)：

- `articleService`: 文章相关操作
- `categoryService`: 分类相关操作
- `tagService`: 标签相关操作
- `userService`: 用户相关操作
- `commentService`: 评论相关操作

### 状态管理

Pinia store (`src/stores/blog.ts`) 已更新为使用 Supabase 服务：

- 自动处理数据库连接错误
- 提供 mock 数据作为 fallback
- 支持实时数据更新

## 7. 开发模式

### 本地开发

```bash
# 启动开发服务器
npm run dev
```

### 数据库连接测试

项目会自动尝试连接 Supabase 数据库：
- 连接成功：使用真实数据库数据
- 连接失败：自动降级到 mock 数据

## 8. 部署注意事项

1. 确保生产环境的环境变量正确配置
2. 检查 Supabase 项目的 RLS 策略
3. 确认 API 密钥的权限设置

## 9. 常见问题

### Q: 数据库连接失败怎么办？
A: 检查环境变量配置，确保 URL 和 API Key 正确。项目会自动降级到 mock 数据。

### Q: 如何添加新的数据表？
A: 在 Supabase 控制台中创建表，然后更新 `src/types/database.ts` 类型定义和相应的服务层。

### Q: 如何修改 RLS 策略？
A: 在 Supabase 控制台的认证 > 策略页面中修改，或通过 SQL 编辑器执行相应的 SQL 语句。

### Q: 如何备份数据？
A: 使用 Supabase 控制台的备份功能，或使用 `pg_dump` 命令导出数据。

## 10. 相关文档

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase JavaScript 客户端](https://supabase.com/docs/reference/javascript)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)

---

配置完成后，你的 Vue3 博客系统就可以使用 Supabase 数据库了！如有问题，请参考上述文档或联系开发团队。