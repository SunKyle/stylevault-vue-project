# 登录注册功能需求对齐文档

## 项目上下文分析

### 技术栈现状
- **后端**: Node.js + Express + TypeScript + Sequelize + MySQL
- **前端**: Vue 3 + Vite + Pinia + TypeScript + TailwindCSS
- **认证**: JWT (jsonwebtoken) + bcryptjs 已集成
- **数据库**: MySQL 已配置，User 模型已存在

### 现有架构
- **后端**: 已有完整的用户模型 (`User.ts`)，包含字段：username, email, passwordHash, avatarUrl, preferences, status等
- **前端**: 已有基础的用户store (`userStore.js`)，但API调用为mock数据
- **服务层**: 前后端服务层架构已搭建完成

## 需求理解确认

### 核心需求
1. **用户注册**: 新用户创建账户
2. **用户登录**: 现有用户身份验证
3. **JWT认证**: 无状态认证机制
4. **用户信息管理**: 个人资料查看与编辑
5. **密码安全**: 加密存储与重置机制

### 功能边界
- ✅ **范围内**: 注册、登录、JWT认证、用户信息管理、密码修改
- ❌ **范围外**: 第三方登录、邮箱验证、手机验证、社交登录

### 技术约束
- **密码加密**: bcryptjs (已集成)
- **JWT存储**: 前端localStorage
- **API格式**: RESTful API
- **响应格式**: JSON统一格式
- **错误处理**: 统一错误响应

## 需求澄清

### 1. 注册字段需求
- **必填**: username (3-50字符，字母数字)
- **必填**: email (有效邮箱格式)
- **必填**: password (最少6字符)
- **可选**: avatar (URL格式)

### 2. 登录方式
- **方式1**: username + password
- **方式2**: email + password

### 3. JWT配置
- **Access Token**: 有效期2小时
- **Refresh Token**: 有效期7天
- **存储位置**: localStorage
- **Header**: Authorization Bearer

### 4. 用户信息管理
- **可编辑**: username, email, avatar, preferences
- **不可编辑**: id, createdAt, updatedAt
- **验证**: 用户名和邮箱唯一性检查

### 5. 密码安全
- **加密算法**: bcryptjs (saltRounds: 12)
- **密码重置**: 后续迭代实现
- **密码强度**: 基础要求(后续增强)

## 现有代码分析

### 后端优势
- User模型已完整定义
- 数据库连接已配置
- 基础中间件已设置
- 错误处理框架已存在

### 前端优势
- Pinia store架构已建立
- 服务层抽象已完成
- UI组件框架已搭建
- 响应式设计已支持

### 需要补充
- 后端：认证路由、JWT中间件、验证逻辑
- 前端：真实API集成、表单验证、错误处理

## 关键决策点

### 1. 认证策略
- **方案**: JWT无状态认证
- **理由**: 符合RESTful API最佳实践，易于扩展

### 2. 密码策略
- **加密**: bcryptjs同步加密
- **强度**: 基础要求，后续增强
- **重置**: 邮箱验证(后续版本)

### 3. API设计
- **版本**: v1版本
- **格式**: /api/v1/auth/*
- **响应**: 统一格式 {success, data, message, errors}

### 4. 前端状态管理
- **存储**: Pinia store
- **持久化**: localStorage + JWT
- **刷新**: 自动token刷新(后续版本)

## 验收标准

### 功能验收
- [ ] 用户可成功注册新账户
- [ ] 用户可使用用户名/邮箱登录
- [ ] JWT token正确生成和验证
- [ ] 用户信息可查看和编辑
- [ ] 密码修改功能正常工作

### 技术验收
- [ ] 密码加密存储
- [ ] JWT认证中间件工作正常
- [ ] 表单验证完整
- [ ] 错误处理完善
- [ ] 代码符合项目规范

### 安全验收
- [ ] 密码不以明文存储
- [ ] JWT token安全传输
- [ ] 输入验证防止注入
- [ ] 错误信息不泄露敏感信息

## 后续扩展规划
- 邮箱验证功能
- 密码重置功能
- 第三方登录集成
- 用户权限管理
- 登录设备管理