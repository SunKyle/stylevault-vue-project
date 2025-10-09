# StyleVault 前端开发规范

## 1. 目录结构规范

### 1.1 整体结构

```
front/
├── src/
│   ├── adapters/       # 数据适配器层，处理前后端数据格式转换
│   ├── assets/         # 静态资源（图片、字体、全局样式）
│   ├── components/     # 组件（按功能模块分类）
│   ├── composables/    # 可组合函数
│   ├── config/         # 项目配置文件
│   ├── constants/      # 常量定义
│   ├── mock/           # 模拟数据
│   ├── router/         # 路由配置
│   ├── services/       # 服务层，处理API调用和业务逻辑
│   ├── stores/         # Pinia状态管理
│   ├── styles/         # 样式文件
│   ├── types/          # TypeScript类型定义
│   ├── utils/          # 工具函数
│   ├── views/          # 页面组件
│   ├── App.vue         # 根组件
│   └── main.js         # 应用入口
├── public/             # 静态资源（构建时会直接复制）
└── *.config.js         # 项目配置文件
```

### 1.2 模块结构

- **components/**：组件按功能/业务模块进行分类，如 `components/layout/`, `components/form/`, `components/business/` 等
- **services/**：API服务按功能拆分，每个服务负责一个业务领域
- **stores/**：状态管理按模块拆分，使用Pinia的模块机制
- **views/**：页面组件直接放置在views目录下，使用PascalCase命名

## 2. 代码风格规范

### 2.1 ESLint规则

- 遵循Vue 3 Essential规则
- 允许单单词组件名（`vue/multi-word-component-names`: `off`）
- 未使用变量警告（`no-unused-vars`: `warn`）
- 禁止直接修改props（`vue/no-mutating-props`: `error`）

### 2.2 Prettier规则

- 使用分号（`semi`: `true`）
- 使用单引号（`singleQuote`: `true`）
- 2个空格缩进（`tabWidth`: `2`）
- 100字符换行（`printWidth`: `100`）
- ES5尾部逗号（`trailingComma`: `es5`）
- LF行尾（`endOfLine`: `lf`）
- 箭头函数参数避免括号（`arrowParens`: `avoid`）
- 括号间空格（`bracketSpacing`: `true`）
- Vue脚本和样式缩进（`vueIndentScriptAndStyle`: `true`）
- HTML空白敏感度（`htmlWhitespaceSensitivity`: `ignore`）

### 2.3 Vue组件风格

- 使用`<script setup>`语法糖（优先）
- 组件导出使用默认导出
- 合理使用`ref`和`reactive`
- 计算属性使用`computed`
- 生命周期函数按需使用

### 2.4 TypeScript规范

- 为props、data、methods等添加明确类型
- 使用接口定义复杂数据结构
- 避免使用`any`类型（特殊情况需添加注释说明）
- 类型定义文件放在`types/`目录下

## 3. 命名约定

### 3.1 文件命名

- **组件文件**：PascalCase（如`LoginPage.vue`、`BrandSection.vue`）
- **脚本文件**：kebab-case（如`auth.service.js`、`http.client.js`）
- **类型文件**：kebab-case + `.ts`（如`user-types.ts`）
- **目录命名**：kebab-case（如`components/login/`、`services/api/`）

### 3.2 变量命名

- **普通变量**：camelCase（如`isLoading`, `userData`）
- **常量**：全大写+下划线（如`API_BASE_URL`, `MAX_RETRY_COUNT`）
- **组件属性**：kebab-case（模板中使用，如`is-loading`, `user-data`）
- **ref变量**：建议添加`value`后缀（如`loadingValue`，便于区分原始值和ref对象）

### 3.3 函数命名

- **普通函数**：camelCase（如`handleLogin`, `fetchUserData`）
- **生命周期钩子**：使用Vue内置命名（如`onMounted`, `onBeforeUnmount`）
- **事件处理函数**：建议添加`handle`前缀（如`handleSubmit`, `handleClick`）
- **回调函数**：建议添加`on`前缀（如`onSuccess`, `onError`）

### 3.4 类和接口命名

- **类**：PascalCase（如`AuthService`, `HttpClient`）
- **接口**：PascalCase，建议添加`I`前缀（如`IUser`, `ILoginCredentials`）
- **枚举**：PascalCase，全大写+下划线（如`UserRole.ADMIN`, `HttpMethod.GET`）

## 4. 组件设计规范

### 4.1 组件分类

- **业务组件**：位于`components/business/`，包含特定业务逻辑
- **通用组件**：位于`components/ui/`或`components/form/`，可复用的基础组件
- **布局组件**：位于`components/layout/`，处理页面布局
- **页面组件**：位于`views/`，作为路由对应的页面

### 4.2 组件通信

- **父子通信**：props向下传递，events向上传递
- **跨组件通信**：使用Pinia store
- **组件间解耦**：优先使用事件总线或发布订阅模式

### 4.3 props和emits

- 明确props类型和默认值
- 必要的props添加`required: true`
- emits使用数组或对象形式定义
- 避免在子组件中直接修改props

### 4.4 样式规范

- 使用TailwindCSS进行样式开发
- 组件内样式使用`<style scoped>`
- 全局样式放在`assets/styles/global/`目录下
- 自定义工具类放在`assets/styles/`目录下

## 5. 接口交互规范

### 5.1 API服务封装

- 所有API调用封装在`services/`目录下
- 使用`http.client.js`统一处理请求拦截、响应拦截
- 错误处理统一化，优先使用后端返回的错误信息
- 支持请求取消、重试机制

### 5.2 请求响应格式

- 请求参数使用驼峰命名
- 响应数据统一处理，适配前端数据结构
- 利用adapters层转换后端返回的数据格式
- 统一的成功/失败响应结构

### 5.3 认证与授权

- 使用JWT进行认证
- 令牌存储在localStorage中
- 请求拦截器自动添加认证头
- 401状态码处理和自动登出

## 6. 性能优化规范

### 6.1 组件优化

- 使用`v-if`和`v-show`合理控制组件渲染
- 长列表使用虚拟滚动（如`@tanstack/vue-virtual`）
- 避免不必要的重渲染
- 合理使用`computed`和`watch`

### 6.2 资源优化

- 图片使用适当格式和大小
- 静态资源懒加载
- 组件按需导入
- 代码分割和按需加载

### 6.3 网络优化

- API请求防抖和节流
- 合理使用缓存
- 减少不必要的请求
- 批量处理请求

## 7. 版本控制规范

### 7.1 Git工作流

- 主分支：`main`（生产环境）
- 开发分支：`develop`（开发环境）
- 特性分支：`feature/功能名称`
- 修复分支：`fix/问题描述`

### 7.2 提交规范

- 提交信息格式：`类型(范围): 简短描述`
  - 类型：feat（新功能）、fix（修复bug）、docs（文档）、style（格式）、refactor（重构）、test（测试）、chore（构建过程或辅助工具变动）
  - 范围：可选，表示影响的模块
  - 简短描述：清晰描述变更内容

- 示例：`feat(auth): 添加登录功能`

### 7.3 代码审查

- 提交前运行`npm run lint`和`npm run format`
- 代码合并前进行代码审查
- 确保所有测试通过

## 8. 文档编写规范

### 8.1 组件文档

- 组件添加简洁的注释说明
- 关键props和emits添加文档注释
- 复杂组件提供使用示例

### 8.2 API文档

- 服务层函数添加文档注释
- 说明参数、返回值和可能的异常
- 复杂业务逻辑提供流程图或文字说明

### 8.3 项目文档

- 更新README.md，说明项目结构和开发流程
- 关键功能模块提供单独的文档
- 部署和配置指南

## 9. 开发流程

### 9.1 开发环境配置

- 安装依赖：`npm install --target_arch=arm64`（ARM架构macOS）
- 启动开发服务器：`npm run dev`或`npm run serve`
- 代码检查：`npm run lint`
- 代码格式化：`npm run format`
- 运行测试：`npm run test`

### 9.2 构建和部署

- 构建生产版本：`npm run build`
- 构建前运行测试和代码检查
- 部署配置和步骤文档化

## 10. 最佳实践

- 遵循Vue 3的组合式API风格
- 组件拆分合理，职责单一
- 状态管理集中化，避免过度使用props drilling
- 错误处理统一化，提供友好的用户反馈
- 性能优化贯穿开发全过程
- 代码风格保持一致
- 文档与代码同步更新

---

此规范文档旨在确保StyleVault项目的前端开发工作高效、规范、可维护。所有团队成员应严格遵守本规范，并根据项目发展和技术进步不断更新和完善。