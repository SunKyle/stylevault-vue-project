// 全局类型定义文件

// 服装项类型
export interface ClothingItem {
  id: string;
  name: string;
  category: string;
  color: string;
  brand?: string;
  size?: string;
  material?: string;
  imageUrl?: string;
  tags?: string[];
  purchaseDate?: string;
  lastWornDate?: string;
  wearCount: number;
  isFavorite: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 穿搭组合类型
export interface Outfit {
  id: string;
  name: string;
  description?: string;
  items: string[]; // ClothingItem IDs
  imageUrl?: string;
  tags?: string[];
  season: string;
  occasion: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

// 用户类型
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

// 用户偏好类型
export interface UserPreferences {
  temperatureUnit: 'celsius' | 'fahrenheit';
  colorScheme: 'light' | 'dark' | 'auto';
  defaultView: 'grid' | 'list';
  notifications: NotificationSettings;
}

// 通知设置类型
export interface NotificationSettings {
  weatherAlerts: boolean;
  outfitRecommendations: boolean;
  laundryReminders: boolean;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 分页类型
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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
