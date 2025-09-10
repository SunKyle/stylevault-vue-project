# 衣物保存错误修复设计方案

## 问题概述
保存衣物时后端报错：`Unknown column 'parent_id' in 'field list'`，错误代码：`ADD_CLOTHING_ITEM_ERROR`

## 根因分析

### 1. 数据库层面
- **现状**：clothing_items表结构中没有parent_id字段
- **问题**：后端代码某个地方尝试插入parent_id字段

### 2. 代码层面
- **ClothingItem模型**：正确定义了所有必要字段，没有parent_id
- **ClothingService**：createClothingItem方法字段映射正确
- **ClothingRepository**：createClothingItem方法直接调用Sequelize.create

### 3. 可能原因
- 数据库迁移文件未执行
- Sequelize模型同步问题
- 某个中间件或钩子函数添加了额外字段

## 修复方案

### 方案A：添加缺失字段（推荐）
```sql
ALTER TABLE clothing_items ADD COLUMN parent_id INT NULL COMMENT '父级衣物ID，用于组合搭配';
```

### 方案B：排查字段来源
检查所有可能添加parent_id的地方：
- Sequelize钩子函数
- 中间件
- 数据库触发器
- 第三方库

## 技术实现

### 数据库变更
1. 添加parent_id字段到clothing_items表
2. 添加外键约束
3. 创建索引优化查询

### 代码变更
1. **ClothingItem模型**：添加parent_id字段定义
2. **ClothingService**：支持parent_id参数
3. **ClothingRepository**：更新字段映射

### 数据迁移
无需数据迁移，新字段可为NULL

## 验证策略

### 1. 单元测试
- 测试创建衣物功能
- 测试带parent_id的衣物创建
- 测试无parent_id的衣物创建

### 2. 集成测试
- 端到端测试衣物添加流程
- 验证数据库记录完整性

### 3. 回归测试
- 确保现有功能不受影响
- 验证所有相关API正常工作

## 风险评估

### 低风险
- 添加新字段不影响现有数据
- 前端无需变更
- 可向后兼容

### 注意事项
- 确保外键约束正确设置
- 考虑索引性能影响
- 文档同步更新

## 实施步骤
1. 创建数据库迁移文件
2. 更新ClothingItem模型
3. 更新ClothingService和Repository
4. 运行测试验证
5. 部署到生产环境