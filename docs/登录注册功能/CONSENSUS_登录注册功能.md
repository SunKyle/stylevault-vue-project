# 登录注册功能需求共识文档

## 最终需求确认

### 核心功能范围
本项目将开发完整的用户认证系统，包括用户注册、登录、JWT认证和用户信息管理功能。

### 技术实现方案

#### 后端架构
- **框架**: Express.js + TypeScript
- **数据库**: MySQL (Sequelize ORM)
- **认证**: JWT (jsonwebtoken)
- **加密**: bcryptjs
- **验证**: Joi 验证库
- **中间件**: 自定义认证中间件

#### 前端架构
- **框架**: Vue 3 + TypeScript
- **状态管理**: Pinia
- **HTTP客户端**: Axios
- **UI框架**: TailwindCSS
- **表单验证**: VeeValidate
- **存储**: localStorage

### API接口规范

#### 认证接口 (v1版本)
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `POST /api/v1/auth/logout` - 用户登出
- `GET /api/v1/auth/profile` - 获取用户信息
- `PUT /api/v1/auth/profile` - 更新用户信息
- `PUT /api/v1/auth/password` - 修改密码

#### 响应格式规范
```json
{
  "success": true,
  "data": { /* 响应数据 */ },
  "message": "操作成功",
  "errors": []
}
```

### 数据模型

#### User模型字段
- `id`: 主键 (UUID)
- `username`: 用户名 (唯一, 3-50字符)
- `email`: 邮箱 (唯一, 有效格式)
- `passwordHash`: 密码哈希
- `avatarUrl`: 头像URL (可选)
- `preferences`: 用户偏好 (JSON)
- `status`: 用户状态 (active/inactive/suspended)
- `lastLoginAt`: 最后登录时间
- `timestamps`: 创建和更新时间

#### JWT配置
- **Access Token**: 有效期2小时
- **Refresh Token**: 有效期7天 (后续版本)
- **算法**: HS256
- **密钥**: 环境变量配置

### 验证规则

#### 注册验证
- `username`: 必填, 3-50字符, 字母数字, 唯一
- `email`: 必填, 有效邮箱格式, 唯一
- `password`: 必填, 最少6字符
- `avatarUrl`: 可选, 有效URL格式

#### 登录验证
- `usernameOrEmail`: 必填, 用户名或邮箱
- `password`: 必填

### 安全策略

#### 密码安全
- **加密**: bcryptjs (saltRounds: 12)
- **存储**: 仅存储哈希值
- **传输**: HTTPS加密传输

#### JWT安全
- **存储**: localStorage (前端)
- **传输**: Authorization Bearer头
- **刷新**: 自动刷新机制(后续版本)
- **撤销**: 登出时清除

### 错误处理

#### 统一错误响应
```json
{
  "success": false,
  "message": "错误描述",
  "errors": ["具体错误1", "具体错误2"]
}
```

#### 错误类型
- 400: 验证错误
- 401: 认证错误
- 404: 资源未找到
- 409: 冲突(用户名/邮箱已存在)
- 500: 服务器错误

### 任务边界确认

#### 明确包含
✅ 用户注册功能
✅ 用户登录功能
✅ JWT token生成和验证
✅ 用户信息查看
✅ 用户信息编辑
✅ 密码修改功能
✅ 表单验证
✅ 错误处理
✅ 前端状态管理

#### 明确排除
❌ 邮箱验证
❌ 密码重置
❌ 第三方登录
❌ 手机验证
❌ 用户权限管理
❌ 登录设备管理
❌ 社交登录集成

### 验收标准

#### 功能验收
- [ ] 新用户可通过表单注册
- [ ] 用户可使用用户名/邮箱登录
- [ ] JWT token正确存储和使用
- [ ] 用户可查看个人资料
- [ ] 用户可编辑个人资料
- [ ] 用户可修改密码
- [ ] 表单验证提示准确
- [ ] 错误处理友好

#### 技术验收
- [ ] 密码加密存储验证
- [ ] JWT中间件正常工作
- [ ] API响应格式统一
- [ ] 代码符合项目规范
- [ ] 测试覆盖率>80%
- [ ] 文档完整更新

#### 安全验收
- [ ] 密码不以明文存储
- [ ] JWT token安全传输
- [ ] 输入验证防注入
- [ ] 错误信息不泄露敏感数据
- [ ] CORS配置正确

### 开发约束

#### 代码规范
- 遵循项目现有ESLint规则
- TypeScript严格模式
- 函数式编程风格
- 错误优先回调
- 完整的JSDoc注释

#### 测试要求
- 单元测试覆盖率>80%
- 集成测试关键路径
- API测试所有端点
- 前端组件测试

#### 文档要求
- API文档完整
- 前端组件文档
- 部署指南更新
- 环境变量说明

### 风险识别

#### 技术风险
- **数据库连接**: MySQL配置问题
- **JWT密钥**: 环境变量配置
- **CORS配置**: 前后端联调问题

#### 缓解措施
- 提供完整的数据库配置文档
- 环境变量模板文件
- CORS预配置
- 详细的错误日志

### 部署准备

#### 环境变量
```bash
# 后端
JWT_SECRET=your-jwt-secret-key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=stylevault

# 前端
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

#### 数据库迁移
- 用户表已存在，需要添加JWT相关字段
- 确保唯一索引正确配置
- 初始化测试数据

### 后续扩展规划

#### 版本2.0功能
- 邮箱验证
- 密码重置
- 第三方登录集成
- 用户权限系统
- 登录设备管理
- 双因素认证

#### 技术债务
- 刷新token机制
- 更强大的密码策略
- 用户行为日志
- 安全审计日志