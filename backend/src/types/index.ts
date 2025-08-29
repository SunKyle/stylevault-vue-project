// 基础响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 用户信息类型
export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// JWT载荷类型
export interface JwtPayload {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
}

// 请求类型扩展
export interface AuthenticatedRequest extends Express.Request {
  user?: User;
}

// 文件上传类型
export interface FileUploadOptions {
  maxSize: number;
  allowedTypes: string[];
  destination: string;
}

// 数据库配置类型
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  dialect: 'mysql';
  logging: boolean | ((sql: string, timing?: number) => void);
}

// 应用配置类型
export interface AppConfig {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  refreshTokenExpiresIn: string;
  uploadPath: string;
  maxFileSize: number;
  allowedFileTypes: string[];
}