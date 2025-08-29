# StyleVault 数据API接口文档

本文档提供了StyleVault数据结构的完整API接口规范，包括RESTful API设计、GraphQL Schema、以及数据库查询工具。

## 📋 目录结构

```
docs/data-structure/api/
├── README.md              # 当前文档 - API总览
├── rest-api.md            # RESTful API规范
├── graphql-schema.md      # GraphQL Schema定义
├── database-queries.md    # 数据库查询示例
└── examples/              # 使用示例
    ├── basic-queries.ts
    ├── advanced-queries.ts
    └── integration-tests.ts
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 运行测试

```bash
npm run test
```

## 🔗 API端点

### RESTful API

#### 基础URL
```
http://localhost:3000/api/v1
```

#### 认证
所有API调用都需要在Header中包含认证token：
```
Authorization: Bearer <your-token>
```

#### 用户相关
- `GET /api/v1/users/me` - 获取当前用户信息
- `PUT /api/v1/users/me` - 更新用户信息
- `GET /api/v1/users/me/preferences` - 获取用户偏好
- `PUT /api/v1/users/me/preferences` - 更新用户偏好

#### 衣物管理
- `GET /api/v1/clothing-items` - 获取用户衣物列表
- `POST /api/v1/clothing-items` - 创建新衣物
- `GET /api/v1/clothing-items/:id` - 获取衣物详情
- `PUT /api/v1/clothing-items/:id` - 更新衣物
- `DELETE /api/v1/clothing-items/:id` - 删除衣物
- `GET /api/v1/clothing-items/:id/attributes` - 获取衣物属性
- `POST /api/v1/clothing-items/:id/attributes` - 添加衣物属性

#### 搭配管理
- `GET /api/v1/outfits` - 获取用户搭配列表
- `POST /api/v1/outfits` - 创建新搭配
- `GET /api/v1/outfits/:id` - 获取搭配详情
- `PUT /api/v1/outfits/:id` - 更新搭配
- `DELETE /api/v1/outfits/:id` - 删除搭配
- `POST /api/v1/outfits/:id/like` - 点赞搭配
- `POST /api/v1/outfits/:id/unlike` - 取消点赞

#### 属性管理
- `GET /api/v1/attributes` - 获取所有可用属性
- `GET /api/v1/attributes/categories` - 获取属性分类
- `GET /api/v1/attributes/:category` - 获取特定分类的属性

### GraphQL API

#### 端点
```
http://localhost:3000/graphql
```

#### 示例查询

```graphql
# 获取用户衣物及属性
query GetUserClothingItems($userId: Int!, $limit: Int, $offset: Int) {
  user(id: $userId) {
    clothingItems(limit: $limit, offset: $offset) {
      id
      name
      brand
      price
      size
      condition
      attributes {
        category
        name
        value
        color
        icon
        weight
      }
    }
  }
}

# 获取搭配详情
query GetOutfitDetails($outfitId: Int!) {
  outfit(id: $outfitId) {
    id
    name
    description
    likes
    viewCount
    isPublic
    attributes {
      category
      name
      value
      weight
    }
    clothingItems {
      id
      name
      brand
      price
    }
  }
}

# 创建新衣物
mutation CreateClothingItem($input: CreateClothingItemInput!) {
  createClothingItem(input: $input) {
    id
    name
    brand
    price
    attributes {
      category
      name
      value
    }
  }
}
```

## 📊 响应格式

### 成功响应
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "春季T恤",
    "brand": "Nike",
    "price": 199
  }
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "物品名称不能为空",
    "details": {
      "field": "name",
      "value": ""
    }
  }
}
```

### 分页响应
```json
{
  "success": true,
  "data": [
    // 数据数组
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## 🔍 查询参数

### 通用参数
- `page`: 页码（默认1）
- `limit`: 每页数量（默认20，最大100）
- `sort`: 排序字段（如：created_at, price, name）
- `order`: 排序方向（asc/desc）

### 筛选参数
- `category`: 分类筛选
- `brand`: 品牌筛选
- `price_min`: 最低价格
- `price_max`: 最高价格
- `season`: 季节筛选
- `style`: 风格筛选
- `material`: 材质筛选
- `color`: 颜色筛选

### 搜索参数
- `q`: 全文搜索关键词
- `search_fields`: 搜索字段（name, brand, description）

## 🛠️ 数据库工具

### TypeScript类型定义
所有API都使用完整的TypeScript类型定义：
- `ClothingItem` - 衣物类型
- `Outfit` - 搭配类型
- `Attribute` - 属性类型
- `User` - 用户类型

### 查询构建器
使用内置的QueryBuilder类构建复杂查询：

```typescript
import { DataAccess } from '@/utils/database';

// 获取用户衣物
const { query, params } = DataAccess.getUserClothingItems(1, {
  priceMin: 100,
  priceMax: 500,
  search: 'Nike',
  limit: 20,
});

// 按属性筛选
const { query, params } = DataAccess.filterClothingItemsByAttributes(1, [
  { category: 'season', value: 'spring' },
  { category: 'style', value: 'casual' },
]);
```

### 缓存管理
内置缓存系统，支持TTL过期：

```typescript
import { CacheManager } from '@/utils/database';

// 设置缓存
CacheManager.set('user:1:clothing-items', data, 300000); // 5分钟

// 获取缓存
const cached = CacheManager.get('user:1:clothing-items');
```

## 📈 性能优化

### 数据库索引
- `clothing_items(user_id, created_at)`
- `entity_attributes(entity_type, entity_id)`
- `attributes(category, value)`

### 查询优化
- 使用JOIN替代子查询
- 合理使用JSON聚合函数
- 避免N+1查询问题

### 缓存策略
- 用户数据缓存5分钟
- 属性列表缓存30分钟
- 热门搭配缓存10分钟

## 🔐 安全考虑

### 输入验证
- 所有输入都经过严格验证
- SQL注入防护
- XSS攻击防护

### 权限控制
- 用户只能访问自己的数据
- 公开搭配需要用户同意
- 敏感信息脱敏处理

### 数据加密
- 敏感字段加密存储
- HTTPS传输加密
- API密钥安全管理

## 🧪 测试

### 单元测试
```bash
npm run test:unit
```

### 集成测试
```bash
npm run test:integration
```

### 性能测试
```bash
npm run test:performance
```

## 📚 使用示例

### 基础查询
```typescript
// 获取用户所有衣物
const clothingItems = await api.get('/api/v1/clothing-items');

// 创建新衣物
const newItem = await api.post('/api/v1/clothing-items', {
  name: '新T恤',
  brand: 'Adidas',
  price: 299,
  size: 'M',
  condition: 'new',
  attributes: [
    { category: 'season', name: '夏季', value: 'summer' },
    { category: 'style', name: '休闲', value: 'casual' },
  ],
});
```

### 高级查询
```typescript
// 使用GraphQL查询
const result = await graphql.query(`
  query GetUserStats($userId: Int!) {
    user(id: $userId) {
      stats {
        totalClothingItems
        totalOutfits
        totalValue
        averagePrice
      }
      attributeUsage {
        category
        name
        usageCount
      }
    }
  }
`, { userId: 1 });
```

## 📞 支持

如有问题，请查看：
- [API详细文档](./rest-api.md)
- [GraphQL Schema](./graphql-schema.md)
- [数据库查询示例](./database-queries.md)
- [使用示例](./examples/)

---

*本文档将持续更新，确保与最新代码保持同步。*