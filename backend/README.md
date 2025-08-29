# StyleVault Backend API

StyleVault后端API服务，基于Node.js + TypeScript + Express.js构建，提供RESTful API接口支持前端Vue应用。

## 技术栈

- **运行时**: Node.js 20 LTS
- **语言**: TypeScript 5.x
- **框架**: Express.js 4.18.x
- **ORM**: Sequelize 6.x + Sequelize-Typescript
- **数据库**: MySQL 8.0
- **认证**: JWT Token
- **缓存**: Redis (可选)
- **文件上传**: Multer + Sharp
- **日志**: Winston

## 快速开始

### 环境要求

- Node.js 18+ (推荐使用ARM64架构)
- MySQL 8.0+
- Redis (可选)

### 安装依赖

```bash
# 进入后端目录
cd backend

# 安装依赖 (ARM64架构优化)
npm install --target_arch=arm64
```

### 环境配置

1. 复制环境变量模板：
```bash
cp .env.example .env
```

2. 编辑`.env`文件，配置数据库连接等信息：
```bash
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=stylevault
DB_USER=root
DB_PASSWORD=your_password

# JWT密钥
JWT_SECRET=your_jwt_secret_key
```

### 启动项目

```bash
# 开发模式
npm run dev

# 生产构建
npm run build
npm start
```

## 项目结构

```
backend/
├── src/
│   ├── config/           # 配置管理
│   ├── controllers/      # 控制器层
│   ├── services/         # 业务逻辑层
│   ├── repositories/     # 数据访问层
│   ├── models/           # 数据模型
│   ├── middleware/       # 中间件
│   ├── routes/           # 路由定义
│   ├── utils/            # 工具函数
│   └── types/            # TypeScript类型
├── tests/                # 测试文件
├── uploads/              # 文件上传
├── logs/                 # 日志文件
└── docs/                 # API文档
```

## API文档

启动项目后，访问：
- `http://localhost:3000/api/health` - 健康检查
- `http://localhost:3000/api-docs` - Swagger文档 (待实现)

## 开发指南

### 代码规范

- 使用ESLint进行代码检查
- 使用Prettier进行代码格式化
- 遵循TypeScript严格模式

### 数据库操作

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE stylevault CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 运行迁移 (待实现)
npm run migrate

# 生成种子数据 (待实现)
npm run seed
```

### 测试

```bash
# 运行测试
npm test

# 测试覆盖率
npm run test:coverage
```

## 部署

### Docker部署 (待实现)

```bash
# 构建镜像
docker build -t stylevault-backend .

# 运行容器
docker run -p 3000:3000 --env-file .env stylevault-backend
```

### PM2部署

```bash
# 全局安装PM2
npm install -g pm2

# 启动应用
pm2 start dist/app.js --name stylevault-api

# 保存配置
pm2 save
pm2 startup
```

## 性能优化

- **ARM64架构优化**: 使用`--target_arch=arm64`安装依赖
- **内存优化**: `export NODE_OPTIONS=--max-old-space-size=4096`
- **数据库连接池**: 最大20个连接
- **Redis缓存**: 热点数据缓存

## 故障排查

### 常见问题

1. **端口占用**: 修改`.env`中的`PORT`值
2. **数据库连接失败**: 检查MySQL服务状态和连接配置
3. **权限问题**: 确保uploads和logs目录有写入权限

### 日志查看

```bash
# 查看应用日志
tail -f logs/app.log

# 查看错误日志
tail -f logs/error.log
```

## 贡献指南

1. 遵循现有代码风格
2. 编写单元测试
3. 更新文档
4. 提交前运行`npm run lint`

## 许可证

MIT License