## 问题分析

**问题**：图片加载失败，错误信息 `net::ERR_BLOCKED_BY_RESPONSE.NotSameOrigin 200 (OK)`

**原因**：
1. 前端运行在 `http://localhost:8081`，后端图片服务运行在 `http://localhost:3000`
2. 前端直接访问 `http://localhost:3000/uploads/...` 导致跨域错误
3. 后端的 CORS 配置仅应用于 API 请求，静态文件服务没有 CORS 头

## 解决方案
采用 Vite 代理方案，让前端通过代理访问图片，符合现有架构设计

## 实现计划

### 1. 更新 Vite 配置
在 `vite.config.js` 中添加 `/uploads` 路径的代理配置
```javascript
server: {
  port: 8081,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false
    },
    '/uploads': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false
    }
  }
}
```

### 2. 修复前端图片URL处理
在 `ClothingCard.vue` 中，移除绝对 URL 转换逻辑，直接使用相对路径：
```javascript
// 移除原有代码：
if (imageUrl.startsWith('/') && !imageUrl.startsWith('//')) {
  const backendBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';
  return `${backendBaseUrl}${imageUrl}`;
}

// 修改为：
if (imageUrl.startsWith('/') && !imageUrl.startsWith('//')) {
  return imageUrl; // 直接返回相对路径，让 Vite 代理处理
}
```

### 3. 检查其他组件
检查项目中其他可能直接使用绝对图片 URL 的组件，确保一致性

### 4. 验证修复
- 运行前端开发服务器
- 加载页面验证图片正常显示
- 检查网络请求，确认图片请求通过 Vite 代理

## 预期结果
- 图片通过前端代理加载，避免跨域错误
- 保持与现有架构设计一致
- 无需修改后端 CORS 配置

## 风险评估
- 低风险，符合现有 Vite 代理模式
- 与现有架构完全兼容
- 不会影响其他功能

## 完成标准
- 图片能正常加载，无跨域错误
- 代码遵循现有项目风格
- 无编译或 lint 错误