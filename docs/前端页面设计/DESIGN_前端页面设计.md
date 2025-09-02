# 前端页面设计架构文档

## 整体架构概览

### 系统架构图
```
┌─────────────────────────────────────────┐
│              应用层 (App)               │
├─────────────────────────────────────────┤
│            路由层 (Router)              │
├─────────────────────────────────────────┤
│          布局层 (Layouts)               │
├─────────────────────────────────────────┤
│          页面层 (Pages)                 │
├─────────────────────────────────────────┤
│          组件层 (Components)            │
├─────────────────────────────────────────┤
│          基础层 (UI Elements)           │
├─────────────────────────────────────────┤
│          工具层 (Utils & Composables)   │
└─────────────────────────────────────────┘
```

## 响应式布局设计

### 断点系统
```css
/* TailwindCSS 响应式断点 */
.mobile:    @media (max-width: 767px)
.tablet:    @media (min-width: 768px) and (max-width: 1023px)
.desktop:  @media (min-width: 1024px)
.large:     @media (min-width: 1280px)
```

### 布局网格系统
```
┌─────────────────────────────────────────┐
│          12列网格系统                    │
├─────────────────────────────────────────┤
│  Desktop: 12列 (1200px)                 │
│  Tablet:  8列  (768px)                  │
│  Mobile:  4列  (375px)                  │
└─────────────────────────────────────────┘
```

## 页面架构设计

### 1. 主页/仪表盘设计

#### 布局结构
```
┌─────────────────────────────────────────┐
│  Header (固定顶部)                      │
├─────────────────────────────────────────┤
│  Hero Section (全屏展示)                │
├─────────────────────────────────────────┤
│  Features Grid (3×2响应式)             │
├─────────────────────────────────────────┤
│  Stats Section (数据展示)               │
├─────────────────────────────────────────┤
│  CTA Section (行动召唤)                 │
├─────────────────────────────────────────┤
│  Footer (页脚)                          │
└─────────────────────────────────────────┘
```

#### 响应式行为
- **Mobile**: 单列布局，汉堡菜单
- **Tablet**: 双列布局，侧边抽屉菜单
- **Desktop**: 三列布局，顶部导航栏

### 2. 导航架构

#### 主导航组件
```vue
<!-- HeaderNavigation.vue -->
<template>
  <header class="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm">
    <!-- 桌面导航 -->
    <nav class="hidden lg:flex items-center justify-between px-8 py-4">
      <Logo />
      <NavigationMenu :items="navItems" />
      <UserActions />
    </nav>
    
    <!-- 移动导航 -->
    <nav class="lg:hidden flex items-center justify-between px-4 py-3">
      <Logo />
      <MobileMenuToggle @toggle="toggleMobileMenu" />
    </nav>
  </header>
</template>
```

#### 移动菜单组件
```vue
<!-- MobileMenu.vue -->
<template>
  <transition name="slide">
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 z-50">
      <div class="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
        <MobileNavigation :items="navItems" @close="closeMenu" />
      </div>
    </div>
  </transition>
</template>
```

## 设计系统架构

### 色彩系统
```css
:root {
  /* 主品牌色 */
  --color-primary: #7C3AED;
  --color-primary-light: #A855F7;
  --color-primary-dark: #5B21B6;
  
  /* 次要品牌色 */
  --color-secondary: #EC4899;
  --color-secondary-light: #F472B6;
  --color-secondary-dark: #DB2777;
  
  /* 中性色 */
  --color-neutral-50: #FAFAFA;
  --color-neutral-100: #F5F5F5;
  --color-neutral-200: #E5E5E5;
  --color-neutral-300: #D4D4D4;
  --color-neutral-400: #A3A3A3;
  --color-neutral-500: #737373;
  --color-neutral-600: #525252;
  --color-neutral-700: #404040;
  --color-neutral-800: #262626;
  --color-neutral-900: #171717;
  
  /* 状态色 */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;
}
```

### 间距系统
```css
/* 8点网格系统 */
.spacing-xs: 0.5rem (8px)
.spacing-sm: 1rem (16px)
.spacing-md: 1.5rem (24px)
.spacing-lg: 2rem (32px)
.spacing-xl: 3rem (48px)
.spacing-2xl: 4rem (64px)
```

### 圆角系统
```css
.radius-sm: 0.25rem (4px)
.radius-md: 0.5rem (8px)
.radius-lg: 0.75rem (12px)
.radius-xl: 1rem (16px)
.radius-2xl: 1.5rem (24px)
.radius-full: 9999px
```

## 组件架构设计

### 1. 基础组件层

#### 按钮组件系统
```vue
<!-- BaseButton.vue -->
<template>
  <button
    :class="[
      'font-medium rounded-lg transition-all duration-200',
      sizeClasses[size],
      variantClasses[variant],
      { 'opacity-50 cursor-not-allowed': disabled },
      { 'transform scale-95': pressed }
    ]"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  size: { type: String, default: 'md' }, // sm, md, lg
  variant: { type: String, default: 'primary' }, // primary, secondary, outline, ghost
  disabled: { type: Boolean, default: false }
})
</script>
```

#### 卡片组件系统
```vue
<!-- BaseCard.vue -->
<template>
  <div class="bg-white rounded-xl shadow-soft hover:shadow-medium transition-shadow">
    <div v-if="$slots.header" class="p-6 border-b border-neutral-200">
      <slot name="header" />
    </div>
    <div class="p-6">
      <slot />
    </div>
    <div v-if="$slots.footer" class="p-6 border-t border-neutral-200">
      <slot name="footer" />
    </div>
  </div>
</template>
```

### 2. 布局组件层

#### 页面容器组件
```vue
<!-- PageContainer.vue -->
<template>
  <div class="min-h-screen bg-neutral-50">
    <HeaderNavigation />
    <main class="pt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
    <AppFooter />
  </div>
</template>
```

#### 网格布局组件
```vue
<!-- ResponsiveGrid.vue -->
<template>
  <div :class="gridClasses">
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  cols: { 
    type: Object, 
    default: () => ({ 
      mobile: 1, 
      tablet: 2, 
      desktop: 3 
    }) 
  },
  gap: { type: String, default: '6' }
})
</script>
```

### 3. 功能组件层

#### 英雄区域组件
```vue
<!-- HeroSection.vue -->
<template>
  <section class="relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50" />
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div class="text-center">
        <h1 class="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
          <slot name="title" />
        </h1>
        <p class="text-xl md:text-2xl text-neutral-600 mb-8 max-w-3xl mx-auto">
          <slot name="description" />
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </section>
</template>
```

## 交互设计系统

### 1. 动画系统

#### 页面过渡动画
```css
/* 页面切换动画 */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* 组件进入动画 */
.slide-up-enter-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
```

#### 微交互设计
```css
/* 按钮悬停效果 */
.btn-hover {
  transition: all 0.2s ease;
}

.btn-hover:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15);
}

.btn-hover:active {
  transform: translateY(0);
}
```

### 2. 状态管理

#### 交互状态系统
```javascript
// 组件状态管理
const useInteractiveState = () => {
  const state = reactive({
    loading: false,
    error: null,
    success: false,
    disabled: false
  })

  const setLoading = () => {
    state.loading = true
    state.error = null
    state.success = false
  }

  const setSuccess = () => {
    state.loading = false
    state.success = true
    setTimeout(() => state.success = false, 3000)
  }

  const setError = (error) => {
    state.loading = false
    state.error = error
  }

  return { state, setLoading, setSuccess, setError }
}
```

### 3. 表单验证系统

#### 验证规则定义
```javascript
// 表单验证规则
const validationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: '请输入有效的邮箱地址'
  },
  password: {
    required: true,
    minLength: 6,
    message: '密码至少需要6个字符'
  },
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_-]+$/,
    message: '用户名只能包含字母、数字、下划线和连字符'
  }
}
```

## 性能优化策略

### 1. 加载优化
- **懒加载**: 路由和组件懒加载
- **图片优化**: 响应式图片和WebP格式
- **字体优化**: 字体预加载和字体显示策略

### 2. 渲染优化
- **虚拟滚动**: 长列表优化
- **防抖节流**: 输入和滚动事件优化
- **缓存策略**: 组件和数据缓存

### 3. 无障碍设计
- **语义化**: 正确使用HTML语义标签
- **键盘导航**: 完整的键盘操作支持
- **屏幕阅读器**: ARIA标签和描述
- **色彩对比**: WCAG 2.1 AA级标准