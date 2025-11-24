// 应用常量定义


// API端点
export const API_ENDPOINTS = {
  CLOTHING: '/api/clothing',
  OUTFITS: '/api/outfits',
  USER: '/api/user',
  ANALYTICS: '/api/analytics',
  WEATHER: '/api/weather',
};

// 分页设置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 36, 48],
};

// 图片上传设置
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_IMAGES_PER_ITEM: 5,
};

// 通知类型
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};
