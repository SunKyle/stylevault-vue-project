# 枚举API修复最终共识文档

## 明确的需求描述和验收标准

### 需求描述
修复前端枚举Store与后端API的字段映射不匹配问题，确保材质和颜色枚举数据正确加载到表单选择器中。

### 验收标准
- ✅ 枚举API调用路径正确（无重复路径）
- ✅ 分类数据正确映射（categories ↔ clothingTypes）
- ✅ 材质枚举数据正确加载
- ✅ 颜色枚举数据正确加载
- ✅ UploadForm表单下拉框正常显示枚举值
- ✅ 无404或其他网络错误

## 技术实现方案

### 方案概述
1. **API路径修正**：从 `/api/v1/enums/all` → `/api/v1/attributes/enums/all`
2. **字段映射修正**：更新前端字段映射表
3. **数据验证**：确保所有枚举类型正确加载

### 技术约束
- 使用现有Axios配置
- 保持Pinia Store结构不变
- 遵循现有错误处理模式
- 不引入新依赖

### 集成方案
```javascript
// 修正后的字段映射
const response = await api.get('/api/v1/attributes/enums/all');
const data = response.data.data || {};

categories.value = data.clothingTypes || [];  // 关键映射修正
styles.value = data.styles || [];
seasons.value = data.seasons || [];
occasions.value = data.occasions || [];
materials.value = data.materials || [];  // 新增支持
colors.value = data.colors || [];        // 新增支持
```

## 任务边界限制

### 任务范围内
- 枚举Store的API路径修正
- 字段映射关系更新
- 枚举数据加载测试
- UploadForm表单验证

### 任务范围外
- 后端API修改
- 新增枚举类型
- UI样式调整
- 性能优化

## 确认所有不确定性已解决

### 已确认事项
- ✅ 后端API实际路径：`/api/v1/attributes/enums/all`
- ✅ 后端返回字段：`clothingTypes`, `styles`, `seasons`, `occasions`, `materials`, `colors`
- ✅ 前端期望字段：`categories`, `styles`, `seasons`, `occasions`, `materials`, `colors`
- ✅ 关键映射：`categories` ← `clothingTypes`

### 无待确认问题
所有技术细节已明确，可直接执行修复任务。