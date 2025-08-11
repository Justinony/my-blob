-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  avatar TEXT,
  bio TEXT,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建分类表
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建标签表
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  color VARCHAR(7) NOT NULL DEFAULT '#10B981',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建文章表
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  read_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- 创建文章标签关联表
CREATE TABLE IF NOT EXISTS article_tags (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (article_id, tag_id)
);

-- 创建评论表
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_comments_article ON comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表添加更新时间触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建阅读量增加函数
CREATE OR REPLACE FUNCTION increment_read_count(article_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE articles 
  SET read_count = read_count + 1 
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql;

-- 插入初始数据

-- 插入默认用户
INSERT INTO users (id, email, name, avatar, bio, role) VALUES 
('00000000-0000-0000-0000-000000000001', 'admin@example.com', '管理员', 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional_avatar_admin&image_size=square', '博客管理员', 'admin'),
('00000000-0000-0000-0000-000000000002', 'user@example.com', '普通用户', 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=friendly_user_avatar&image_size=square', '博客用户', 'user')
ON CONFLICT (id) DO NOTHING;

-- 插入默认分类
INSERT INTO categories (id, name, description, color) VALUES 
('00000000-0000-0000-0000-000000000001', '技术分享', '分享技术相关的文章和经验', '#3B82F6'),
('00000000-0000-0000-0000-000000000002', '生活随笔', '记录生活中的点点滴滴', '#10B981'),
('00000000-0000-0000-0000-000000000003', '学习笔记', '学习过程中的笔记和总结', '#F59E0B'),
('00000000-0000-0000-0000-000000000004', '项目实战', '实际项目开发经验分享', '#EF4444')
ON CONFLICT (id) DO NOTHING;

-- 插入默认标签
INSERT INTO tags (id, name, color) VALUES 
('00000000-0000-0000-0000-000000000001', 'Vue.js', '#4FC08D'),
('00000000-0000-0000-0000-000000000002', 'TypeScript', '#3178C6'),
('00000000-0000-0000-0000-000000000003', 'JavaScript', '#F7DF1E'),
('00000000-0000-0000-0000-000000000004', 'React', '#61DAFB'),
('00000000-0000-0000-0000-000000000005', 'Node.js', '#339933'),
('00000000-0000-0000-0000-000000000006', 'CSS', '#1572B6'),
('00000000-0000-0000-0000-000000000007', 'HTML', '#E34F26'),
('00000000-0000-0000-0000-000000000008', 'Supabase', '#3ECF8E')
ON CONFLICT (id) DO NOTHING;

-- 插入示例文章
INSERT INTO articles (id, title, excerpt, content, cover_image, category_id, author_id, status, read_count, like_count, published_at) VALUES 
('00000000-0000-0000-0000-000000000001', 
 'Vue 3 Composition API 深度解析', 
 'Vue 3 的 Composition API 为我们提供了更灵活的组件逻辑组织方式，本文将深入探讨其核心概念和最佳实践。', 
 '# Vue 3 Composition API 深度解析\n\n## 什么是 Composition API\n\nComposition API 是 Vue 3 中引入的一套新的 API，它提供了一种更灵活的方式来组织组件逻辑。\n\n## 核心概念\n\n### 1. setup 函数\n\n```javascript\nimport { ref, reactive } from "vue"\n\nexport default {\n  setup() {\n    const count = ref(0)\n    const state = reactive({\n      name: "Vue 3"\n    })\n    \n    return {\n      count,\n      state\n    }\n  }\n}\n```\n\n### 2. 响应式引用\n\n- `ref()`: 创建响应式引用\n- `reactive()`: 创建响应式对象\n- `computed()`: 创建计算属性\n\n## 最佳实践\n\n1. 使用 `<script setup>` 语法糖\n2. 合理组织可复用逻辑\n3. 正确处理响应式数据\n\n## 总结\n\nComposition API 让我们能够更好地组织和复用组件逻辑，是 Vue 3 的重要特性之一。', 
 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=vue3_composition_api_coding&image_size=landscape_16_9', 
 '00000000-0000-0000-0000-000000000001', 
 '00000000-0000-0000-0000-000000000001', 
 'published', 
 156, 
 23, 
 NOW() - INTERVAL '2 days'),
('00000000-0000-0000-0000-000000000002', 
 'TypeScript 在 Vue 项目中的应用', 
 'TypeScript 为 Vue 项目带来了类型安全和更好的开发体验，本文介绍如何在 Vue 项目中有效使用 TypeScript。', 
 '# TypeScript 在 Vue 项目中的应用\n\n## 为什么选择 TypeScript\n\nTypeScript 为 JavaScript 添加了静态类型检查，能够在开发阶段发现潜在的错误。\n\n## 在 Vue 中使用 TypeScript\n\n### 1. 项目配置\n\n```bash\nnpm create vue@latest my-project -- --typescript\n```\n\n### 2. 组件类型定义\n\n```typescript\n<script setup lang="ts">\ninterface User {\n  id: number\n  name: string\n  email: string\n}\n\nconst users = ref<User[]>([])\n</script>\n```\n\n### 3. Props 类型定义\n\n```typescript\ninterface Props {\n  title: string\n  count?: number\n}\n\nconst props = defineProps<Props>()\n```\n\n## 常见问题\n\n1. 类型推断\n2. 泛型使用\n3. 第三方库类型\n\n## 总结\n\nTypeScript 能够显著提升 Vue 项目的开发效率和代码质量。', 
 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=typescript_vue_development&image_size=landscape_16_9', 
 '00000000-0000-0000-0000-000000000001', 
 '00000000-0000-0000-0000-000000000001', 
 'published', 
 89, 
 15, 
 NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- 插入文章标签关联
INSERT INTO article_tags (article_id, tag_id) VALUES 
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'), -- Vue.js
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003'), -- JavaScript
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001'), -- Vue.js
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002')  -- TypeScript
ON CONFLICT (article_id, tag_id) DO NOTHING;

-- 启用行级安全策略 (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 创建策略：所有人都可以读取已发布的文章
CREATE POLICY "Anyone can read published articles" ON articles
  FOR SELECT USING (status = 'published');

-- 创建策略：认证用户可以管理自己的文章
CREATE POLICY "Users can manage own articles" ON articles
  FOR ALL USING (auth.uid() = author_id);

-- 创建策略：所有人都可以读取分类和标签
CREATE POLICY "Anyone can read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read tags" ON tags
  FOR SELECT USING (true);

-- 创建策略：认证用户可以管理分类和标签
CREATE POLICY "Authenticated users can manage categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage tags" ON tags
  FOR ALL USING (auth.role() = 'authenticated');

-- 创建策略：所有人都可以读取评论
CREATE POLICY "Anyone can read comments" ON comments
  FOR SELECT USING (true);

-- 创建策略：认证用户可以创建评论
CREATE POLICY "Authenticated users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 创建策略：用户可以管理自己的评论
CREATE POLICY "Users can manage own comments" ON comments
  FOR ALL USING (auth.uid() = author_id);

-- 创建策略：用户可以读取和更新自己的信息
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);