// 应用常量定义

// 服装类别
export const CLOTHING_CATEGORIES = {
  TOP: 'top',
  BOTTOM: 'bottom',
  DRESS: 'dress',
  OUTERWEAR: 'outerwear',
  SHOES: 'shoes',
  ACCESSORIES: 'accessories',
  UNDERWEAR: 'underwear',
  OTHER: 'other'
};

// 颜色选项
export const COLOR_OPTIONS = [
  { value: 'red', label: '红色' },
  { value: 'blue', label: '蓝色' },
  { value: 'green', label: '绿色' },
  { value: 'yellow', label: '黄色' },
  { value: 'black', label: '黑色' },
  { value: 'white', label: '白色' },
  { value: 'gray', label: '灰色' },
  { value: 'pink', label: '粉色' },
  { value: 'purple', label: '紫色' },
  { value: 'orange', label: '橙色' },
  { value: 'brown', label: '棕色' },
  { value: 'beige', label: '米色' },
  { value: 'navy', label: '海军蓝' },
  { value: 'multicolor', label: '多彩' }
];

// 尺码选项
export const SIZE_OPTIONS = [
  { value: 'xs', label: 'XS' },
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
  { value: 'l', label: 'L' },
  { value: 'xl', label: 'XL' },
  { value: 'xxl', label: 'XXL' },
  { value: '3xl', label: '3XL' },
  { value: 'free', label: '均码' }
];

// 季节选项
export const SEASONS = [
  { value: 'spring', label: '春季' },
  { value: 'summer', label: '夏季' },
  { value: 'autumn', label: '秋季' },
  { value: 'winter', label: '冬季' },
  { value: 'all', label: '四季' }
];

// 场合选项
export const OCCASIONS = [
  { value: 'casual', label: '休闲' },
  { value: 'formal', label: '正式' },
  { value: 'business', label: '商务' },
  { value: 'sport', label: '运动' },
  { value: 'party', label: '派对' },
  { value: 'date', label: '约会' },
  { value: 'travel', label: '旅行' },
  { value: 'home', label: '居家' }
];

// 材质选项
export const MATERIAL_OPTIONS = [
  { value: 'cotton', label: '棉' },
  { value: 'polyester', label: '聚酯纤维' },
  { value: 'wool', label: '羊毛' },
  { value: 'silk', label: '丝绸' },
  { value: 'linen', label: '亚麻' },
  { value: 'denim', label: '牛仔布' },
  { value: 'leather', label: '皮革' },
  { value: 'synthetic', label: '合成材料' },
  { value: 'blend', label: '混纺' }
];

// API端点
export const API_ENDPOINTS = {
  CLOTHING: '/api/clothing',
  OUTFITS: '/api/outfits',
  USER: '/api/user',
  ANALYTICS: '/api/analytics',
  WEATHER: '/api/weather'
};

// 分页设置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 36, 48]
};

// 图片上传设置
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_IMAGES_PER_ITEM: 5
};

// 通知类型
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};
