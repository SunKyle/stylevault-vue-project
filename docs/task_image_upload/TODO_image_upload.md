# 图片上传功能 - TODO 文档

## 待办事项

### 1. 性能优化
- [ ] 实现图片压缩功能，减少存储空间和网络传输
- [ ] 考虑使用CDN加速图片访问
- [ ] 优化大文件上传体验，实现分片上传

### 2. 功能扩展
- [ ] 添加图片裁剪和编辑功能
- [ ] 支持批量图片上传
- [ ] 实现图片删除功能
- [ ] 支持图片标签和分类管理

### 3. 安全增强
- [ ] 添加图片内容验证，防止恶意文件上传
- [ ] 实现图片访问权限控制
- [ ] 配置定期清理过期图片的脚本
- [ ] 添加图片水印功能

### 4. 用户体验
- [ ] 添加拖拽上传功能
- [ ] 实现断点续传功能
- [ ] 添加更多图片格式支持（如WebP）
- [ ] 优化移动端上传体验

## 配置说明

### 1. 后端配置

#### 上传目录配置
```typescript
// backend/src/config/uploadConfig.ts
const UPLOAD_DIR = path.join(__dirname, '../../uploads/images');
```

#### 文件大小限制
```typescript
// backend/src/middleware/uploadMiddleware.ts
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
```

#### 支持的文件类型
```typescript
// backend/src/middleware/uploadMiddleware.ts
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('只支持JPEG、JPG和PNG格式的图片'));
  }
};
```

### 2. 前端配置

#### API基础URL
```javascript
// front/src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
```

#### 重试次数配置
```javascript
// front/src/components/form/UploadForm.vue
const MAX_RETRIES = 2;
```

#### 占位符图片URL
```javascript
// front/src/components/form/UploadForm.vue
const PLACEHOLDER_IMAGE_URL = '/src/assets/images/placeholder.png';
```

## 部署注意事项

### 1. 服务器配置
- 确保上传目录存在且有读写权限
  ```bash
  mkdir -p backend/uploads/images
  chmod 755 backend/uploads/images
  ```

- 配置Nginx静态文件服务
  ```nginx
  location /uploads/ {
    alias /path/to/project/backend/uploads/;
    expires 30d;
  }
  ```

### 2. 环境变量
- 在`.env`文件中配置API基础URL
  ```
  VITE_API_BASE_URL=http://your-domain.com/api
  ```

## 常见问题

### 1. 图片上传失败
- 检查文件大小是否超过限制（5MB）
- 检查文件格式是否为PNG、JPG或JPEG
- 检查网络连接是否正常
- 检查服务器上传目录权限

### 2. 图片无法预览
- 检查图片URL是否正确
- 检查前端图片路径配置
- 检查服务器是否配置了静态文件服务

### 3. 前端无法连接后端
- 检查API_BASE_URL配置是否正确
- 检查后端服务器是否正常运行
- 检查跨域配置是否正确

## 技术支持

如需技术支持，请提供以下信息：
- 错误截图或详细错误信息
- 浏览器控制台日志
- 后端服务器日志
- 相关代码片段

---

*本文档列出了图片上传功能的待办事项和配置说明，方便后续维护和扩展。*