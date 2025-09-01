# 任务6: Sequelize ORM装饰器模式数据模型设计 - 需求对齐文档

## 项目背景
基于StyleVault项目的完整数据库设计方案，使用Sequelize ORM框架并采用装饰器模式设计TypeScript数据模型。项目已配置sequelize-typescript，支持装饰器模式开发。

## 原始需求
"根据数据库结构，使用Sequelize ORM框架并采用装饰器模式设计数据模型"

## 需求理解与分析

### 数据库结构分析
根据完善版数据库设计方案，核心包含10个数据表：
1. **用户表** (users) - 用户基础信息和偏好设置
2. **衣物表** (clothing_items) - 用户衣物基础信息和扩展属性
3. **搭配表** (outfits) - 用户创建的搭配信息
4. **搭配-衣物关联表** (outfit_clothing) - 多对多关系
5. **属性定义表** (attributes) - 统一存储所有属性（季节、风格、场景等）
6. **属性关联表** (entity_attributes) - 统一关联实体与属性
7. **用户偏好配置表** (user_preferences) - 个性化偏好设置
8. **用户行为日志表** (user_behaviors) - 行为数据记录
9. **天气数据表** (weather_data) - 天气相关推荐
10. **智能推荐结果表** (recommendations) - 推荐结果存储

### 技术栈确认
- **ORM框架**: Sequelize 6.x + sequelize-typescript 2.1.6
- **语言**: TypeScript
- **数据库**: MySQL (基于现有配置)
- **装饰器**: 支持reflect-metadata
- **项目结构**: 已配置decorator.types.ts

## 任务边界确认

### 任务范围 ✅
1. **核心实体模型**: 创建10个数据表的Sequelize模型
2. **装饰器模式**: 使用sequelize-typescript装饰器定义模型
3. **关联关系**: 配置表间关系（一对一、一对多、多对多）
4. **类型安全**: 完整的TypeScript类型定义
5. **模型验证**: 字段验证规则配置
6. **索引优化**: 基于查询需求配置索引

### 任务范围 ❌
1. **数据库迁移脚本**: 不创建数据库迁移文件
2. **CRUD操作**: 不包含服务层和控制器实现
3. **API接口**: 不包含RESTful API设计
4. **业务逻辑**: 不包含复杂业务规则实现
5. **测试用例**: 不包含单元测试（仅模型定义）

## 技术约束

### 现有项目约束
- 已配置sequelize-typescript 2.1.6
- 已定义decorator.types.ts类型支持
- 使用MySQL数据库
- TypeScript严格模式
- 装饰器元数据支持已启用

### 设计原则
1. **装饰器优先**: 尽可能使用装饰器语法
2. **类型安全**: 完整的TypeScript类型定义
3. **关系清晰**: 明确的表间关系定义
4. **验证完备**: 字段级验证规则
5. **索引合理**: 基于查询模式优化索引
6. **命名规范**: 遵循项目命名约定

## 疑问澄清

### 1. 数据库字段命名规范
- **问题**: 数据库字段使用下划线命名(snake_case)，TypeScript模型使用驼峰命名(camelCase)，是否需要自动映射？
- **决策**: 使用Sequelize自动映射功能，保持数据库snake_case，模型camelCase

### 2. JSON字段处理
- **问题**: preferences、metadata等JSON字段如何类型化？
- **决策**: 使用泛型接口定义JSON结构，提供类型安全访问

### 3. 软删除支持
- **问题**: 是否需要软删除功能？
- **决策**: 所有核心实体支持软删除（paranoid: true）

### 4. 时间戳处理
- **问题**: created_at/updated_at字段是否自动管理？
- **决策**: 使用Sequelize自动时间戳，模型中不手动定义这些字段

### 5. 枚举类型处理
- **问题**: condition等枚举字段如何类型化？
- **决策**: 使用TypeScript枚举定义，Sequelize ENUM类型映射

## 验收标准

### 功能验收 ✅
- [ ] 所有10个数据表都有对应的Sequelize模型
- [ ] 每个模型使用装饰器语法正确定义
- [ ] 表间关系完整配置（一对一、一对多、多对多）
- [ ] 字段验证规则正确配置
- [ ] 索引配置合理
- [ ] TypeScript类型定义完整

### 代码质量验收 ✅
- [ ] 代码符合TypeScript最佳实践
- [ ] 装饰器使用规范
- [ ] 命名清晰一致
- [ ] 注释完整
- [ ] 无TypeScript类型错误

### 集成验收 ✅
- [ ] 模型可正确初始化
- [ ] 数据库同步无错误
- [ ] 关系查询正常工作
- [ ] 与现有项目结构兼容

## 技术方案预览

### 模型结构设计
```
src/models/
├── base/
│   └── BaseModel.ts          # 基础模型
├── entities/
│   ├── User.ts              # 用户模型
│   ├── ClothingItem.ts      # 衣物模型
│   ├── Outfit.ts            # 搭配模型
│   ├── Attribute.ts         # 属性定义模型
│   ├── EntityAttribute.ts   # 属性关联模型
│   ├── UserPreference.ts    # 用户偏好模型
│   ├── UserBehavior.ts      # 用户行为模型
│   ├── WeatherData.ts       # 天气数据模型
│   └── Recommendation.ts    # 推荐结果模型
├── associations/
│   └── index.ts             # 关联关系配置
└── index.ts                 # 模型导出
```

### 装饰器使用模式
```typescript
@Table({ tableName: 'users', paranoid: true })
export class User extends BaseModel<User> {
  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  username!: string;

  @HasMany(() => ClothingItem)
  clothingItems?: ClothingItem[];
}
```

## 下一步计划
1. 架构设计阶段：创建详细的模型架构文档
2. 原子化阶段：拆分为10个独立的模型创建任务
3. 实施阶段：逐个实现模型定义
4. 集成测试：验证模型正确性