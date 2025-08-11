<template>
  <div class="min-h-screen bg-gray-50 pt-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">个人资料</h1>
        <p class="text-gray-600 mt-2">管理您的个人信息和账户设置</p>
      </div>
      
      <!-- 个人信息卡片 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div class="p-6">
          <div class="flex items-center space-x-6">
            <!-- 头像 -->
            <div class="relative">
              <img
                :src="userInfo.avatar"
                :alt="userInfo.name"
                class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <button
                class="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                @click="changeAvatar"
              >
                <el-icon><Camera /></el-icon>
              </button>
            </div>
            
            <!-- 基本信息 -->
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900">{{ userInfo.name }}</h2>
              <p class="text-gray-600 mt-1">{{ userInfo.title }}</p>
              <p class="text-gray-500 text-sm mt-2">{{ userInfo.bio }}</p>
              
              <div class="flex items-center space-x-4 mt-4">
                <div class="flex items-center text-sm text-gray-500">
                  <el-icon class="mr-1"><Calendar /></el-icon>
                  加入时间：{{ userInfo.joinDate }}
                </div>
                <div class="flex items-center text-sm text-gray-500">
                  <el-icon class="mr-1"><Location /></el-icon>
                  {{ userInfo.location }}
                </div>
              </div>
            </div>
            
            <!-- 统计信息 -->
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-2xl font-bold text-blue-600">{{ userInfo.stats.articles }}</div>
                <div class="text-sm text-gray-500">文章</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-green-600">{{ userInfo.stats.views }}</div>
                <div class="text-sm text-gray-500">阅读量</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-purple-600">{{ userInfo.stats.likes }}</div>
                <div class="text-sm text-gray-500">点赞</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 设置标签页 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <el-tabs v-model="activeTab" class="profile-tabs">
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="basic">
            <div class="p-6">
              <el-form :model="basicForm" :rules="basicRules" ref="basicFormRef" label-width="100px">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="basicForm.username" placeholder="请输入用户名" />
                  </el-form-item>
                  
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="basicForm.email" placeholder="请输入邮箱" />
                  </el-form-item>
                  
                  <el-form-item label="真实姓名" prop="realName">
                    <el-input v-model="basicForm.realName" placeholder="请输入真实姓名" />
                  </el-form-item>
                  
                  <el-form-item label="手机号" prop="phone">
                    <el-input v-model="basicForm.phone" placeholder="请输入手机号" />
                  </el-form-item>
                  
                  <el-form-item label="职位" prop="title">
                    <el-input v-model="basicForm.title" placeholder="请输入职位" />
                  </el-form-item>
                  
                  <el-form-item label="所在地" prop="location">
                    <el-input v-model="basicForm.location" placeholder="请输入所在地" />
                  </el-form-item>
                </div>
                
                <el-form-item label="个人简介" prop="bio">
                  <el-input
                    v-model="basicForm.bio"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入个人简介"
                    maxlength="200"
                    show-word-limit
                  />
                </el-form-item>
                
                <el-form-item label="个人网站" prop="website">
                  <el-input v-model="basicForm.website" placeholder="请输入个人网站" />
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="saveBasicInfo">
                    保存基本信息
                  </el-button>
                  <el-button @click="resetBasicForm">
                    重置
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          
          <!-- 安全设置 -->
          <el-tab-pane label="安全设置" name="security">
            <div class="p-6">
              <div class="space-y-8">
                <!-- 修改密码 -->
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-4">修改密码</h3>
                  <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="120px">
                    <el-form-item label="当前密码" prop="currentPassword">
                      <el-input
                        v-model="passwordForm.currentPassword"
                        type="password"
                        placeholder="请输入当前密码"
                        show-password
                      />
                    </el-form-item>
                    
                    <el-form-item label="新密码" prop="newPassword">
                      <el-input
                        v-model="passwordForm.newPassword"
                        type="password"
                        placeholder="请输入新密码"
                        show-password
                      />
                    </el-form-item>
                    
                    <el-form-item label="确认新密码" prop="confirmPassword">
                      <el-input
                        v-model="passwordForm.confirmPassword"
                        type="password"
                        placeholder="请再次输入新密码"
                        show-password
                      />
                    </el-form-item>
                    
                    <el-form-item>
                      <el-button type="primary" @click="changePassword">
                        修改密码
                      </el-button>
                    </el-form-item>
                  </el-form>
                </div>
                
                <!-- 两步验证 -->
                <div class="border-t pt-8">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">两步验证</h3>
                  <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div class="font-medium text-gray-900">短信验证</div>
                      <div class="text-sm text-gray-500">通过短信接收验证码</div>
                    </div>
                    <el-switch
                      v-model="securitySettings.smsAuth"
                      @change="toggleSmsAuth"
                    />
                  </div>
                  
                  <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg mt-4">
                    <div>
                      <div class="font-medium text-gray-900">邮箱验证</div>
                      <div class="text-sm text-gray-500">通过邮箱接收验证码</div>
                    </div>
                    <el-switch
                      v-model="securitySettings.emailAuth"
                      @change="toggleEmailAuth"
                    />
                  </div>
                </div>
                
                <!-- 登录设备 -->
                <div class="border-t pt-8">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">登录设备</h3>
                  <div class="space-y-4">
                    <div
                      v-for="device in loginDevices"
                      :key="device.id"
                      class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div class="flex items-center space-x-4">
                        <div
                          class="w-10 h-10 rounded-lg flex items-center justify-center"
                          :class="device.current ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'"
                        >
                          <el-icon>
                            <component :is="getDeviceIcon(device.type)" />
                          </el-icon>
                        </div>
                        <div>
                          <div class="font-medium text-gray-900">
                            {{ device.name }}
                            <el-tag v-if="device.current" type="success" size="small" class="ml-2">
                              当前设备
                            </el-tag>
                          </div>
                          <div class="text-sm text-gray-500">
                            {{ device.location }} • {{ device.lastActive }}
                          </div>
                        </div>
                      </div>
                      
                      <el-button
                        v-if="!device.current"
                        size="small"
                        type="danger"
                        @click="removeDevice(device)"
                      >
                        移除
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <!-- 通知设置 -->
          <el-tab-pane label="通知设置" name="notifications">
            <div class="p-6">
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-4">邮箱通知</h3>
                  <div class="space-y-4">
                    <div
                      v-for="notification in emailNotifications"
                      :key="notification.key"
                      class="flex items-center justify-between"
                    >
                      <div>
                        <div class="font-medium text-gray-900">{{ notification.title }}</div>
                        <div class="text-sm text-gray-500">{{ notification.description }}</div>
                      </div>
                      <el-switch
                        v-model="notification.enabled"
                        @change="updateNotificationSetting(notification)"
                      />
                    </div>
                  </div>
                </div>
                
                <div class="border-t pt-6">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">站内通知</h3>
                  <div class="space-y-4">
                    <div
                      v-for="notification in siteNotifications"
                      :key="notification.key"
                      class="flex items-center justify-between"
                    >
                      <div>
                        <div class="font-medium text-gray-900">{{ notification.title }}</div>
                        <div class="text-sm text-gray-500">{{ notification.description }}</div>
                      </div>
                      <el-switch
                        v-model="notification.enabled"
                        @change="updateNotificationSetting(notification)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <!-- 隐私设置 -->
          <el-tab-pane label="隐私设置" name="privacy">
            <div class="p-6">
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-4">个人资料可见性</h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="font-medium text-gray-900">公开个人资料</div>
                        <div class="text-sm text-gray-500">允许其他用户查看您的个人资料</div>
                      </div>
                      <el-switch v-model="privacySettings.publicProfile" />
                    </div>
                    
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="font-medium text-gray-900">显示邮箱地址</div>
                        <div class="text-sm text-gray-500">在个人资料中显示邮箱地址</div>
                      </div>
                      <el-switch v-model="privacySettings.showEmail" />
                    </div>
                    
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="font-medium text-gray-900">显示在线状态</div>
                        <div class="text-sm text-gray-500">让其他用户看到您的在线状态</div>
                      </div>
                      <el-switch v-model="privacySettings.showOnlineStatus" />
                    </div>
                  </div>
                </div>
                
                <div class="border-t pt-6">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">数据控制</h3>
                  <div class="space-y-4">
                    <el-button @click="exportData">
                      <el-icon><Download /></el-icon>
                      导出我的数据
                    </el-button>
                    
                    <el-button type="danger" @click="deleteAccount">
                      <el-icon><Delete /></el-icon>
                      删除账户
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Camera,
  Calendar,
  Location,
  Monitor,
  Iphone,
  Download,
  Delete
} from '@element-plus/icons-vue'

// 当前活跃标签页
const activeTab = ref('basic')

// 用户信息
const userInfo = ref({
  name: '前端工程师',
  title: '高级前端开发工程师',
  bio: '6年前端开发经验，专注于Vue.js、TypeScript等现代化技术栈，热爱分享技术和开发经验。',
  avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional_developer_avatar&image_size=square',
  joinDate: '2018年7月',
  location: '北京市朝阳区',
  stats: {
    articles: 128,
    views: '15.2K',
    likes: 892
  }
})

// 基本信息表单
const basicForm = reactive({
  username: 'frontend_dev',
  email: 'developer@example.com',
  realName: '张三',
  phone: '138****0000',
  title: '高级前端开发工程师',
  location: '北京市朝阳区',
  bio: '6年前端开发经验，专注于Vue.js、TypeScript等现代化技术栈，热爱分享技术和开发经验。',
  website: 'https://github.com/frontend-dev'
})

const basicFormRef = ref()

const basicRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

// 密码表单
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordFormRef = ref()

const validateConfirmPassword = (rule: any, value: string, callback: Function) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 安全设置
const securitySettings = reactive({
  smsAuth: false,
  emailAuth: true
})

// 登录设备
const loginDevices = ref([
  {
    id: 1,
    name: 'MacBook Pro',
    type: 'desktop',
    location: '北京市',
    lastActive: '当前活跃',
    current: true
  },
  {
    id: 2,
    name: 'iPhone 14 Pro',
    type: 'mobile',
    location: '北京市',
    lastActive: '2小时前',
    current: false
  },
  {
    id: 3,
    name: 'Chrome on Windows',
    type: 'desktop',
    location: '上海市',
    lastActive: '3天前',
    current: false
  }
])

// 通知设置
const emailNotifications = ref([
  {
    key: 'new_comment',
    title: '新评论通知',
    description: '当有人评论您的文章时发送邮件',
    enabled: true
  },
  {
    key: 'new_like',
    title: '点赞通知',
    description: '当有人点赞您的文章时发送邮件',
    enabled: false
  },
  {
    key: 'new_follower',
    title: '新关注者',
    description: '当有新用户关注您时发送邮件',
    enabled: true
  },
  {
    key: 'weekly_summary',
    title: '周报摘要',
    description: '每周发送您的文章数据摘要',
    enabled: true
  }
])

const siteNotifications = ref([
  {
    key: 'site_new_comment',
    title: '新评论通知',
    description: '在站内显示新评论通知',
    enabled: true
  },
  {
    key: 'site_new_like',
    title: '点赞通知',
    description: '在站内显示点赞通知',
    enabled: true
  },
  {
    key: 'site_system',
    title: '系统通知',
    description: '接收系统重要通知',
    enabled: true
  }
])

// 隐私设置
const privacySettings = reactive({
  publicProfile: true,
  showEmail: false,
  showOnlineStatus: true
})

// 方法
const changeAvatar = () => {
  ElMessage.info('头像上传功能开发中')
}

const saveBasicInfo = () => {
  basicFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      ElMessage.success('基本信息已保存')
    }
  })
}

const resetBasicForm = () => {
  basicFormRef.value?.resetFields()
}

const changePassword = () => {
  passwordFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      ElMessage.success('密码修改成功')
      // 重置表单
      passwordFormRef.value?.resetFields()
    }
  })
}

const toggleSmsAuth = (value: boolean) => {
  ElMessage.success(`短信验证已${value ? '开启' : '关闭'}`)
}

const toggleEmailAuth = (value: boolean) => {
  ElMessage.success(`邮箱验证已${value ? '开启' : '关闭'}`)
}

const getDeviceIcon = (type: string) => {
  return type === 'mobile' ? 'Iphone' : 'Monitor'
}

const removeDevice = (device: any) => {
  ElMessageBox.confirm(`确定要移除设备「${device.name}」吗？`, '移除设备', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = loginDevices.value.findIndex(d => d.id === device.id)
    if (index > -1) {
      loginDevices.value.splice(index, 1)
      ElMessage.success('设备已移除')
    }
  })
}

const updateNotificationSetting = (notification: any) => {
  ElMessage.success(`${notification.title}已${notification.enabled ? '开启' : '关闭'}`)
}

const exportData = () => {
  ElMessage.info('数据导出功能开发中')
}

const deleteAccount = () => {
  ElMessageBox.confirm(
    '删除账户将永久删除您的所有数据，此操作不可恢复。确定要继续吗？',
    '删除账户',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'error',
      dangerouslyUseHTMLString: true
    }
  ).then(() => {
    ElMessage.error('账户删除功能暂未开放')
  })
}
</script>

<style scoped>
.profile-tabs :deep(.el-tabs__header) {
  margin: 0;
  border-bottom: 1px solid #e5e7eb;
}

.profile-tabs :deep(.el-tabs__nav-wrap) {
  padding: 0 24px;
}

.profile-tabs :deep(.el-tabs__content) {
  padding: 0;
}
</style>