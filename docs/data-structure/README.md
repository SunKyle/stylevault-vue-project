# StyleVault 数据结构文档

欢迎来到StyleVault数据结构文档！本文档提供了项目完整的数据结构说明，包括数据库设计、TypeScript类型定义、查询示例和最佳实践。

## 📋 文档结构

### 🏗️ 架构设计
- [数据库表结构](./schema/tables.md) - 完整的表结构说明
- [关系图](./schema/relationships.md) - ER图和关系约束
- [数据约束](./schema/constraints.md) - 完整性约束和验证规则

### 🔍 查询指南
- [查询示例](./api/queries.md) - 常用查询模式和示例
- [增删改操作](./api/mutations.md) - 数据变更操作指南
- [最佳实践](./api/best-practices.md) - 性能优化建议

### ⚙️ 开发工具
- [TypeScript类型](./types/typescript.md) - 完整的类型定义
- [数据验证](./types/validation.md) - 验证规则和工具

### 🚀 快速开始
- [测试数据](./examples/seed-data.sql) - 可直接导入的测试数据
- [示例查询](./examples/sample-queries.sql) - 可执行的SQL示例

## 🎯 核心特性

### 极简设计
- **5个核心表**管理所有数据
- **统一属性系统**支持无限扩展
- **零修改**添加新属性类型

### 完整类型支持
- 100% TypeScript类型覆盖
- 完整的枚举定义
- 查询构建器类型安全

### 即开即用
- 完整测试数据集
- 可直接运行的查询示例
- 开发环境一键配置

## 🏃‍♂️ 5分钟快速开始

### 1. 环境准备
```bash
# 确保MySQL运行中
mysql -u root -p
```

### 2. 导入测试数据
```bash
# 导入测试数据
mysql -u root -p stylevault < docs/data-structure/examples/seed-data.sql
```

### 3. 验证数据
```sql
-- 查看测试数据
SELECT COUNT(*) as total_clothing_items FROM clothing_items;
SELECT COUNT(*) as total_attributes FROM attributes;
SELECT COUNT(*) as total_associations FROM entity_attributes;
```

### 4. 运行示例查询
```sql
-- 获取用户1的所有衣物及其属性
SELECT 
    ci.name as 衣物名称,
    a.category as 属性类别,
    a.name as 属性名称,
    ea.weight as 权重
FROM clothing_items ci
JOIN entity_attributes ea ON ci.id = ea.entity_id AND ea.entity_type = 'clothing_item'
JOIN attributes a ON ea.attribute_id = a.id
WHERE ci.user_id = 1
ORDER BY ci.name, a.category;
```

## 📊 数据表概览

| 表名 | 用途 | 行数估计 | 核心字段 |
|---|---|---|---|
| `users` | 用户基础信息 | 1K+ | username, email |
| `clothing_items` | 衣物基础信息 | 10K+ | name, brand, price |
| `outfits` | 搭配组合信息 | 5K+ | name, description |
| `attributes` | 统一属性定义 | 100+ | category, name, value |
| `entity_attributes` | 属性关联关系 | 50K+ | entity_type, entity_id, attribute_id |

## 🔗 快速导航

### 开发者必读
1. [数据库表结构详解](./schema/tables.md)
2. [TypeScript类型定义](./types/typescript.md)
3. [查询示例大全](./api/queries.md)

### 常见问题
- **如何添加新属性？** → [属性扩展指南](./api/best-practices.md#添加新属性)
- **如何优化查询性能？** → [性能优化](./api/best-practices.md#性能优化)
- **如何处理关联数据？** → [关联查询示例](./api/queries.md#关联查询)

### 技术支持
- 📧 技术问题：提交GitHub Issue
- 📖 文档反馈：直接编辑文档
- 💡 功能建议：创建Feature Request

## 🔄 更新日志

| 版本 | 日期 | 更新内容 |
|---|---|---|
| v1.0 | 2024-01-XX | 初始版本，完整数据结构文档 |

---

*本文档是StyleVault项目数据结构的标准参考，确保开发的一致性和可维护性。*