# StyleVault 后端开发规范文档

## 📋 目录

1. [项目概述](#项目概述)
2. [技术栈规范](#技术栈规范)
3. [项目结构规范](#项目结构规范)
4. [编码规范](#编码规范)
5. [API设计规范](#api设计规范)
6. [数据库规范](#数据库规范)
7. [开发流程规范](#开发流程规范)
8. [测试规范](#测试规范)
9. [部署规范](#部署规范)
10. [接口开发案例](#接口开发案例)

---

## 1. 项目概述

StyleVault 是一个智能衣橱管理系统的后端服务，采用 Node.js + TypeScript + Express + Sequelize 架构，为前端提供 RESTful API 服务。

### 核心功能
- 用户认证与授权
- 衣物管理（CRUD）
- 搭配推荐算法
- 天气数据集成
- 用户行为分析

---

## 2. 技术栈规范

### 核心技术栈
| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | ≥18.0.0 | 运行时环境 |
| TypeScript | ≥5.0.0 | 类型系统 |
| Express.js | ≥4.18.0 | Web框架 |
| Sequelize | ≥6.32.0 | ORM框架 |
| MySQL | ≥8.0.0 | 数据库 |
| Redis | ≥6.0.0 | 缓存 |
| JWT | ≥9.0.0 | 身份认证 |

### 开发工具
- **包管理**: npm
- **代码格式化**: Prettier
- **代码检查**: ESLint
- **测试框架**: Jest
- **API文档**: Swagger/OpenAPI
- **环境管理**: dotenv

---

## 3. 项目结构规范

### 目录结构
```
backend/
├── src/
│   ├── config/          # 配置文件
│   │   └── index.ts     # 主配置
│   ├── controllers/     # 控制器层
│   │   ├── AuthController.ts
│   │   └── ClothingController.ts
│   ├── middleware/      # 中间件
│   │   ├── auth.ts      # 认证中间件
│   │   └── validation.ts # 验证中间件
│   ├── models/          # 数据模型
│   │   ├── entities/    # 实体模型
│   │   ├── base/        # 基础模型
│   │   └── index.ts     # 模型导出
│   ├── repositories/    # 数据访问层
│   ├── services/        # 业务逻辑层
│   ├── routes/          # 路由定义
│   ├── types/           # 类型定义
│   ├── utils/           # 工具函数
│   └── app.ts           # 应用入口
├── tests/               # 测试文件
├── scripts/             # 脚本文件
└── docs/               # 项目文档
```

### 命名规范
- **文件命名**: 使用帕斯卡命名法（PascalCase）
  - 控制器：`UserController.ts`
  - 模型：`User.ts`
  - 服务：`UserService.ts`
- **变量命名**: 使用驼峰命名法（camelCase）
- **常量命名**: 使用全大写蛇形命名法（UPPER_SNAKE_CASE）
- **数据库表名**: 使用复数形式蛇形命名法（snake_case）

---

## 4. 编码规范

### TypeScript规范
```typescript
// ✅ 正确：使用明确的类型定义
interface UserCreateRequest {
  email: string;
  password: string;
  name: string;
}

// ❌ 错误：使用any类型
interface UserCreateRequest {
  email: any;
  password: any;
}
```

### 错误处理规范
```typescript
// ✅ 统一错误响应格式
interface ApiErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
    details?: string;
    field?: string;
  };
}

// ✅ 使用自定义错误类
class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string
  ) {
    super(message);
  }
}
```

### 注释规范
```typescript
/**
 * 获取用户衣物列表
 * @param userId - 用户ID
 * @param options - 查询选项
 * @param options.page - 页码，默认为1
 * @param options.limit - 每页数量，默认为20
 * @returns 返回分页的衣物列表
 * @throws 当用户不存在时抛出USER_NOT_FOUND错误
 */
async getUserClothingItems(
  userId: number,
  options: { page?: number; limit?: number } = {}
): Promise<PaginatedResult<ClothingItem>> {
  // 实现逻辑
}
```

---

## 5. API设计规范

### RESTful设计原则
- **资源命名**: 使用名词复数形式
  - ✅ `/api/v1/clothing-items`
  - ❌ `/api/v1/get-clothing-items`

- **HTTP方法**: 
  - `GET`: 获取资源
  - `POST`: 创建资源
  - `PUT`: 全量更新
  - `PATCH`: 部分更新
  - `DELETE`: 删除资源

### 响应格式规范
```typescript
// ✅ 成功响应格式
{
  "success": true,
  "data": {}, // 响应数据
  "message": "操作成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}

// ✅ 错误响应格式
{
  "success": false,
  "message": "错误描述",
  "error": {
    "code": "ERROR_CODE",
    "details": "详细错误信息",
    "field": "相关字段"
  }
}
```

### 分页规范
```typescript
interface PaginationRequest {
  page?: number;    // 页码，从1开始
  limit?: number;   // 每页数量，默认20，最大100
  sortBy?: string;  // 排序字段
  sortOrder?: 'ASC' | 'DESC'; // 排序方向
}

interface PaginationResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
```

---

## 6. 数据库规范

### 模型定义规范
```typescript
@Table({
  tableName: 'clothing_items', // 使用snake_case
  paranoid: true,              // 软删除
  timestamps: true,            // 自动添加createdAt, updatedAt
  indexes: [
    { name: 'idx_clothing_user_id', fields: ['user_id'] },
    { name: 'idx_clothing_category', fields: ['category_id', 'user_id'] }
  ]
})
export class ClothingItem extends BaseModel<ClothingItem> {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Index
  @Column({
    type: DataType.INTEGER,
    field: 'user_id',
    comment: '所属用户ID'
  })
  userId!: number;
  
  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
    validate: {
      len: [1, 100],
      notEmpty: true
    },
    comment: '衣物名称'
  })
  name!: string;
}
```

### 迁移规范
- 使用Sequelize CLI进行迁移
- 迁移文件命名：`YYYYMMDDHHMMSS-description.js`
- 每个迁移文件必须包含up和down方法

---

## 7. 开发流程规范

### 分支管理
```bash
# 功能开发
feat/功能名称          # 新功能
fix/修复问题          # Bug修复
docs/文档更新         # 文档更新
refactor/重构         # 代码重构
test/测试            # 测试相关
```

### 提交信息规范
```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型说明：**
- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

**示例：**
```
feat(clothing): 添加衣物搜索功能

- 支持按名称、品牌、分类搜索
- 支持分页和排序
- 添加搜索历史记录

Closes #123
```

### 开发环境设置
```bash
# 1. 克隆项目
git clone <repository-url>
cd stylevault-vue-project/backend

# 2. 安装依赖
npm install --target_arch=arm64

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 4. 初始化数据库
npm run db:migrate
npm run db:seed

# 5. 启动开发服务器
npm run dev
```

---

## 8. 测试规范

### 测试类型
- **单元测试**: 测试单个函数或类
- **集成测试**: 测试API端点和数据库交互
- **端到端测试**: 测试完整用户流程

### 测试文件命名
- 单元测试: `*.test.ts`
- 集成测试: `*.integration.test.ts`
- 端到端测试: `*.e2e.test.ts`

### 测试覆盖率要求
| 类型 | 最低覆盖率 |
|------|-----------|
| 语句 | 80% |
| 分支 | 75% |
| 函数 | 80% |
| 行 | 80% |

### 测试示例
```typescript
// clothing.service.test.ts
import { ClothingService } from '../services/ClothingService';

describe('ClothingService', () => {
  let service: ClothingService;

  beforeEach(() => {
    service = new ClothingService();
  });

  describe('createClothingItem', () => {
    it('应该成功创建衣物项', async () => {
      const clothingData = {
        name: 'Test T-shirt',
        categoryId: 1,
        userId: 1
      };

      const result = await service.createClothingItem(clothingData);

      expect(result).toBeDefined();
      expect(result.name).toBe('Test T-shirt');
      expect(result.id).toBeDefined();
    });

    it('当名称为空时应该抛出错误', async () => {
      const clothingData = {
        name: '',
        categoryId: 1,
        userId: 1
      };

      await expect(service.createClothingItem(clothingData))
        .rejects.toThrow('衣物名称不能为空');
    });
  });
});
```

---

## 9. 部署规范

### 环境配置
```bash
# 生产环境
NODE_ENV=production
PORT=3000
DB_HOST=prod-db.example.com
DB_NAME=stylevault_prod

# 预发布环境
NODE_ENV=staging
PORT=3001
DB_HOST=staging-db.example.com
DB_NAME=stylevault_staging
```

### 部署流程
1. **代码审查**: 通过Pull Request审查
2. **测试**: 运行完整的测试套件
3. **构建**: 编译TypeScript代码
4. **部署**: 使用CI/CD工具自动部署
5. **验证**: 运行健康检查

---

## 10. 接口开发案例

### 案例：创建衣物收藏接口

#### 1. 需求分析
**功能描述**: 允许用户收藏/取消收藏衣物项
**业务规则**:
- 用户只能收藏自己的衣物
- 防止重复收藏
- 记录收藏时间

#### 2. 数据库设计
```typescript
// 在 ClothingItem 模型中添加字段
@Column({
  type: DataType.BOOLEAN,
  defaultValue: false,
  comment: '是否收藏'
})
isFavorite!: boolean;

@Column({
  type: DataType.DATE,
  field: 'favorited_at',
  allowNull: true,
  comment: '收藏时间'
})
favoritedAt?: Date;
```

#### 3. 路由定义
```typescript
// src/routes/clothing.ts
router.post('/clothing/:id/favorite', validateIdParam, clothingController.toggleFavorite);
router.get('/clothing/favorites', validatePagination, clothingController.getFavoriteItems);
```

#### 4. 服务层实现
```typescript
// src/services/ClothingService.ts
export class ClothingService {
  /**
   * 切换衣物收藏状态
   * @param clothingId 衣物ID
   * @param userId 用户ID
   * @returns 更新后的衣物信息
   */
  async toggleFavorite(clothingId: number, userId: number): Promise<ClothingItem> {
    const clothing = await ClothingItem.findOne({
      where: { id: clothingId, userId }
    });

    if (!clothing) {
      throw new AppError('CLOTHING_NOT_FOUND', 404, '衣物不存在或无权限');
    }

    const newFavoriteStatus = !clothing.isFavorite;
    
    await clothing.update({
      isFavorite: newFavoriteStatus,
      favoritedAt: newFavoriteStatus ? new Date() : null
    });

    return clothing;
  }

  /**
   * 获取用户的收藏衣物列表
   * @param userId 用户ID
   * @param pagination 分页参数
   * @returns 分页的收藏衣物列表
   */
  async getFavoriteItems(
    userId: number,
    pagination: PaginationRequest
  ): Promise<PaginatedResult<ClothingItem>> {
    const { page = 1, limit = 20 } = pagination;
    
    const offset = (page - 1) * limit;

    const { count, rows } = await ClothingItem.findAndCountAll({
      where: {
        userId,
        isFavorite: true
      },
      include: [
        {
          model: Category,
          attributes: ['id', 'name']
        }
      ],
      order: [['favoritedAt', 'DESC']],
      limit,
      offset
    });

    return {
      data: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      }
    };
  }
}
```

#### 5. 控制器实现
```typescript
// src/controllers/clothingController.ts
export class ClothingController {
  /**
   * 切换衣物收藏状态
   * @route POST /api/v1/clothing/:id/favorite
   */
  async toggleFavorite(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const clothingItem = await clothingService.toggleFavorite(
        parseInt(id),
        userId
      );

      res.json({
        success: true,
        data: {
          id: clothingItem.id,
          isFavorite: clothingItem.isFavorite,
          favoritedAt: clothingItem.favoritedAt
        },
        message: clothingItem.isFavorite ? '收藏成功' : '取消收藏成功'
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
          error: { code: error.code }
        });
      }

      console.error('切换收藏状态失败:', error);
      res.status(500).json({
        success: false,
        message: '操作失败',
        error: {
          code: 'TOGGLE_FAVORITE_ERROR',
          details: error instanceof Error ? error.message : String(error)
        }
      });
    }
  }

  /**
   * 获取收藏衣物列表
   * @route GET /api/v1/clothing/favorites
   */
  async getFavoriteItems(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const userId = (req as any).user.userId;

      const result = await clothingService.getFavoriteItems(userId, {
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      });

      res.json({
        success: true,
        data: result,
        message: '获取收藏列表成功'
      });
    } catch (error) {
      console.error('获取收藏列表失败:', error);
      res.status(500).json({
        success: false,
        message: '获取收藏列表失败',
        error: {
          code: 'FETCH_FAVORITES_ERROR',
          details: error instanceof Error ? error.message : String(error)
        }
      });
    }
  }
}
```

#### 6. 测试用例
```typescript
// tests/clothing.favorite.test.ts
import request from 'supertest';
import app from '../src/app';

describe('POST /api/v1/clothing/:id/favorite', () => {
  let authToken: string;
  let clothingId: number;

  beforeEach(async () => {
    // 创建测试用户并获取token
    const user = await createTestUser();
    authToken = await generateAuthToken(user);
    
    // 创建测试衣物
    const clothing = await createTestClothing(user.id);
    clothingId = clothing.id;
  });

  it('应该成功收藏衣物', async () => {
    const response = await request(app)
      .post(`/api/v1/clothing/${clothingId}/favorite`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.isFavorite).toBe(true);
    expect(response.body.data.favoritedAt).toBeDefined();
  });

  it('应该成功取消收藏', async () => {
    // 先收藏
    await request(app)
      .post(`/api/v1/clothing/${clothingId}/favorite`)
      .set('Authorization', `Bearer ${authToken}`);

    // 再取消收藏
    const response = await request(app)
      .post(`/api/v1/clothing/${clothingId}/favorite`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.isFavorite).toBe(false);
    expect(response.body.data.favoritedAt).toBeNull();
  });

  it('当衣物不存在时应该返回404', async () => {
    const response = await request(app)
      .post('/api/v1/clothing/99999/favorite')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('CLOTHING_NOT_FOUND');
  });
});
```

#### 7. API文档
```yaml
# swagger.yaml
/clothing/{id}/favorite:
  post:
    summary: 切换衣物收藏状态
    tags: [Clothing]
    security:
      - bearerAuth: []
    parameters:
      - in: path
        name: id
        required: true
        schema:
          type: integer
        description: 衣物ID
    responses:
      200:
        description: 操作成功
        content:
          application/json:
            schema:
              type: object
              properties:
                success:
                  type: boolean
                  example: true
                data:
                  type: object
                  properties:
                    id:
                      type: integer
                    isFavorite:
                      type: boolean
                    favoritedAt:
                      type: string
                      format: date-time
                message:
                  type: string
                  example: "收藏成功"
      404:
        description: 衣物不存在
      500:
        description: 服务器错误
```

---

## 📊 总结

本规范文档为StyleVault后端开发提供了全面的指导，包括：

1. **标准化**: 统一代码风格、命名规范和项目结构
2. **质量保障**: 通过测试规范和质量门控确保代码质量
3. **开发效率**: 提供清晰的开发流程和最佳实践
4. **团队协作**: 统一标准，降低沟通成本
5. **维护性**: 规范化的代码更易于维护和扩展

### 下一步行动
1. 设置开发环境
2. 创建第一个功能分支
3. 按照规范实现第一个接口
4. 编写对应的测试用例
5. 提交代码审查

**记住**: 规范是为了提高开发效率和代码质量，如有特殊情况需要调整，请通过团队讨论后更新规范文档。