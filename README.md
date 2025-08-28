# StyleVault - 智能穿搭助手

## 项目简介

StyleVault 是一个基于 Vue.js 的智能穿搭管理应用，旨在帮助用户智能管理衣物、轻松搭配，展现独特风格，让每一天都充满时尚感。该应用提供了衣橱管理、天气穿搭推荐、搭配灵感、穿搭分析等功能，帮助用户更好地管理和搭配自己的衣物。

## 技术栈

- 前端框架：Vue.js 3
- 路由管理：Vue Router
- 状态管理：Pinia
- UI 框架：Tailwind CSS
- 图标库：Font Awesome
- 构建工具：Vite

## 项目结构

```
stylevault-vue-project/
├── public/                 # 静态资源目录
│   └── favicon.ico         # 网站图标
├── src/                    # 源代码目录
│   ├── assets/             # 资源文件
│   │   └── css/            # CSS样式文件
│   │       └── global/     # 全局样式
│   ├── components/         # 组件目录
│   │   ├── common/         # 通用组件
│   │   │   ├── layout/     # 布局组件
│   │   │   │   ├── Header.vue    # 页头组件
│   │   │   │   └── Footer.vue    # 页脚组件
│   │   │   └── ui/         # UI组件
│   │   │       ├── UploadModal.vue    # 上传模态框
│   │   │       ├── ClothingCategory.vue  # 衣物分类组件
│   │   │       ├── ClothingItem.vue     # 衣物项组件
│   │   │       └── OutfitCard.vue       # 搭配卡片组件
│   │   ├── features/       # 功能组件
│   │   │   ├── wardrobe/    # 衣橱相关组件
│   │   │   │   └── WardrobeSection.vue   # 衣橱功能区块
│   │   │   ├── weather/     # 天气相关组件
│   │   │   │   └── WeatherSection.vue    # 天气功能区块
│   │   │   ├── inspiration/ # 灵感相关组件
│   │   │   │   └── InspirationSection.vue # 灵感功能区块
│   │   │   └── analysis/    # 分析相关组件
│   │   │       └── AnalysisSection.vue    # 分析功能区块
│   │   └── form/           # 表单组件
│   │       └── UploadForm.vue    # 上传表单组件
│   ├── mock/              # Mock数据和API
│   │   ├── data.js        # 统一的Mock数据管理
│   │   ├── index.js       # Mock API入口
│   │   ├── wardrobe.js    # 衣物相关Mock API
│   │   ├── outfit.js     # 搭配相关Mock API
│   │   ├── user.js       # 用户相关Mock API
│   │   └── analytics.js  # 分析相关Mock API
│   ├── router/            # 路由配置
│   │   └── index.js        # 路由配置文件
│   ├── services/          # 业务逻辑服务层
│   │   ├── api/           # API服务层
│   │   │   ├── adapter.js # API适配器
│   │   │   ├── clothingApi.js # 衣物API
│   │   │   ├── outfitApi.js   # 搭配API
│   │   │   ├── userApi.js     # 用户API
│   │   │   └── analyticsApi.js # 分析API
│   │   ├── baseService.js # 基础服务类
│   │   ├── clothingService.js # 衣物服务
│   │   ├── outfitService.js   # 搭配服务
│   │   ├── userService.js     # 用户服务
│   │   └── wardrobeService.js # 衣橱服务
│   ├── stores/            # Pinia状态管理
│   │   ├── authStore.js   # 认证状态
│   │   ├── clothingStore.js # 衣物状态
│   │   ├── outfitStore.js # 搭配状态
│   │   └── userStore.js   # 用户状态
│   ├── utils/             # 工具函数
│   │   └── toast.js       # 提示工具函数
│   ├── views/             # 视图组件
│   │   ├── WardrobeView.vue    # 衣橱管理视图
│   │   ├── WeatherView.vue     # 天气穿搭视图
│   │   ├── InspirationView.vue  # 搭配灵感视图
│   │   ├── AnalysisView.vue      # 穿搭分析视图
│   │   └── UploadView.vue      # 上传视图
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── index.html             # HTML模板文件
├── package.json           # 项目依赖配置
├── vite.config.js         # Vite配置文件
└── README.md              # 项目说明文档
```

## 目录结构说明

### src/assets
存放项目的静态资源，如图片、全局CSS样式等。

### src/components
存放项目的可复用组件，分为以下几类：

- **common**：通用组件，可在整个应用中复用
  - **layout**：布局组件，如Header、Footer等
  - **ui**：基础UI组件，如按钮、卡片、模态框等

- **features**：功能相关组件，每个功能模块一个子目录
  - **wardrobe**：衣橱管理相关组件
  - **weather**：天气穿搭相关组件
  - **inspiration**：搭配灵感相关组件
  - **analysis**：穿搭分析相关组件

- **form**：表单相关组件

### src/mock
Mock层提供模拟的后端数据和API接口，支持前端独立开发和测试。

- **data.js**：统一的Mock数据管理，包含衣物、搭配、用户等所有模拟数据
- **index.js**：Mock API入口，导出所有Mock API
- **wardrobe.js**：衣物相关Mock API，提供衣物的增删改查功能
- **outfit.js**：搭配相关Mock API，提供搭配的增删改查功能
- **user.js**：用户相关Mock API，提供用户认证和信息管理功能
- **analytics.js**：分析相关Mock API，提供数据分析功能

### src/services
Service层处理业务逻辑，组合多个API调用，提供高级功能。

- **api/**：API服务层
  - **adapter.js**：API适配器，根据环境选择数据源（开发环境使用Mock API，生产环境使用真实API）
  - **clothingApi.js**：衣物API，封装衣物相关的API调用
  - **outfitApi.js**：搭配API，封装搭配相关的API调用
  - **userApi.js**：用户API，封装用户相关的API调用
  - **analyticsApi.js**：分析API，封装分析相关的API调用
- **baseService.js**：基础服务类，提供通用的CRUD能力
- **clothingService.js**：衣物服务，处理衣物相关的业务逻辑
- **outfitService.js**：搭配服务，处理搭配相关的业务逻辑
- **userService.js**：用户服务，处理用户相关的业务逻辑
- **wardrobeService.js**：衣橱服务，处理衣橱相关的业务逻辑

### src/stores
使用Pinia进行状态管理，集中管理应用的状态。

- **authStore.js**：认证状态，管理用户登录状态和权限
- **clothingStore.js**：衣物状态，管理衣物数据
- **outfitStore.js**：搭配状态，管理搭配数据
- **userStore.js**：用户状态，管理用户信息

### src/router
存放Vue Router的路由配置，定义应用的页面路由。

### src/utils
存放工具函数，如提示消息工具等。

### src/views
存放页面级组件，每个组件对应一个路由页面。这些组件通常由多个功能组件组成，构成完整的页面功能。

### App.vue
应用的根组件，包含整体布局结构和路由视图。

### main.js
应用的入口文件，负责初始化Vue应用并挂载到DOM上。

## 核心模块详解

### 1. 数据流设计

#### 开发环境数据流
```
Components → Services → API层 → Mock API → Mock数据
```

1. **Components** 调用 **Services** 的方法获取数据
2. **Services** 处理业务逻辑，调用 **API层** 的方法
3. **API层** 根据环境判断，选择调用 **Mock API**
4. **Mock API** 返回模拟数据
5. 数据依次返回到 **Components** 进行展示

#### 生产环境数据流
```
Components → Services → API层 → API客户端 → 真实API
```

1. **Components** 调用 **Services** 的方法获取数据
2. **Services** 处理业务逻辑，调用 **API层** 的方法
3. **API层** 根据环境判断，选择调用 **API客户端**
4. **API客户端** 发送HTTP请求到 **真实API**
5. **真实API** 返回真实数据
6. 数据依次返回到 **Components** 进行展示

### 2. Mock层

Mock层提供完整的模拟数据和API接口，支持前端独立开发和测试。

**主要特点：**
- 统一的数据管理：所有Mock数据集中在`data.js`文件中管理
- 完整的API模拟：提供与真实API一致的接口
- 环境切换：通过API适配器实现开发环境和生产环境的无缝切换
- 数据一致性：确保Mock数据与真实API的数据结构一致

**数据结构：**
- 衣物数据：包含衣物的基本信息、分类、季节、风格等
- 搭配数据：包含搭配的基本信息、关联的衣物、季节、风格等
- 用户数据：包含用户的基本信息、偏好、统计数据等
- 分析数据：包含各种统计和分析数据

### 3. Service层

Service层是业务逻辑的核心，负责处理复杂的业务逻辑和数据转换。

**主要职责：**
- 封装业务逻辑
- 组合多个API调用
- 数据转换和处理
- 错误处理和日志记录

**设计模式：**
- 基础服务类：提供通用的CRUD能力
- 具体服务类：继承基础服务类，实现特定业务逻辑

### 4. API适配器层

API适配器层是连接Service层和数据源（Mock API或真实API）的桥梁。

**主要功能：**
- 环境判断：根据`process.env.NODE_ENV`判断当前环境
- 数据源选择：开发环境使用Mock API，生产环境使用真实API
- 统一接口：提供统一的API接口，屏蔽底层差异
- 错误处理：统一处理API调用中的错误

**实现方式：**
- 使用适配器模式，根据环境选择不同的数据源
- 提供统一的API接口，确保Service层的调用方式一致

## 功能模块

### 1. 衣橱管理 (Wardrobe)
- 衣物分类展示
- 衣物搜索功能
- 添加新衣物
- 衣物详情查看

### 2. 天气穿搭 (Weather)
- 实时天气信息展示
- 根据天气推荐穿搭
- 穿搭建议

### 3. 搭配灵感 (Inspiration)
- 搭配推荐
- 灵感收集
- 搭配预览

### 4. 穿搭分析 (Analysis)
- 穿搭数据分析
- 穿搭频率统计
- 穿搭风格分析

### 5. 上传管理 (Upload)
- 衣物信息上传
- 图片上传
- 衣物分类管理

## 开发指南

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 组件开发规范

1. **组件命名**：使用PascalCase命名组件，如`WardrobeSection`
2. **文件命名**：与组件名保持一致，使用`.vue`扩展名
3. **目录组织**：
   - 页面级组件放在`views`目录
   - 可复用组件放在`components`目录下的相应子目录
   - 通用组件放在`components/common`目录
   - 功能相关组件放在`components/features`下的功能子目录

4. **组件结构**：
   ```vue
   <template>
     <!-- 组件模板 -->
   </template>

   <script setup>
     // 组件逻辑
   </script>

   <style scoped>
     /* 组件样式 */
   </style>
   ```

## 路由规范

1. 路由配置文件位于`src/router/index.js`
2. 每个页面视图对应一个路由
3. 路由命名使用小写字母，如`wardrobe`、`weather`等

## 样式规范

1. 使用Tailwind CSS作为样式框架
2. 全局样式放在`src/assets/css/global`目录
3. 组件样式使用`scoped`属性，避免样式污染
4. 响应式设计使用Tailwind的响应式类

## 状态管理

使用Pinia进行状态管理，状态模块按照功能模块划分。

## 部署说明

项目构建后的静态文件位于`dist`目录，可部署到任何静态文件服务器。

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

[MIT](LICENSE)
