import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

// 确保上传目录存在
import fs from 'fs';
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 文件过滤器
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  // 允许的文件类型
  const allowedTypes = /jpeg|jpg|png|webp/;
  
  // 检查文件类型
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('只允许上传 JPG、PNG 和 WebP 格式的图片'));
  }
};

// 存储配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 使用 UUID 生成唯一文件名，保留原始扩展名
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// 图片上传中间件
const uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5 // 最多5个文件
  }
});

export default uploadMiddleware;
