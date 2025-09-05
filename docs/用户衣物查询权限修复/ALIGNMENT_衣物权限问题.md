# 衣物查询权限问题对齐文档

## 问题描述
当前衣物列表查询API (`GET /api/v1/clothing`) 返回所有用户的衣物数据，而非当前登录用户的个人数据。这违反了用户数据隔离的基本原则。

## 实际验证结果
- **当前用户ID**: 7 (username: "sxk")
- **API响应**: 返回了userId为1、2等多个用户的数据
- **期望行为**: 只返回userId=7的衣物数据

## 项目现状分析

### 后端架构
- **认证方式**: JWT Bearer Token
- **用户ID获取**: 从token中解析userId
- **Repository层**: ClothingRepository.ts已实现userId过滤
- **Service层**: clothingService.getClothingItems未传入userId参数

### 前端架构
- **认证存储**: auth.store.js管理token和用户状态
- **API调用**: clothingApi.js通过adapter.js调用后端
- **请求头**: 自动添加Authorization头

## 需求边界确认

### 必须修复
1. `GET /api/v1/clothing` 必须只返回当前用户的衣物
2. 所有相关查询接口都需要用户隔离
3. 保持现有分页和筛选功能

### 保持不变
1. 现有的认证机制
2. 现有的API响应格式
3. 现有的分页参数

## 技术方案评估

### 方案A: 修改Service层
- **实现**: 在clothingService.getClothingItems中添加userId参数
- **影响**: 需要修改Controller和Service层
- **风险**: 低，向后兼容

### 方案B: 修改Controller层
- **实现**: 在Controller中直接添加userId到查询参数
- **影响**: 最小修改
- **风险**: 低

## 验收标准
- [ ] 登录用户只能看到自己的衣物数据
- [ ] 未登录用户返回401
- [ ] 分页功能正常工作
- [ ] 筛选功能正常工作
- [ ] 不影响其他用户的查询