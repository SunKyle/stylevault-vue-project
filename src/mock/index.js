import { wardrobeAPI } from './wardrobe';
import { userAPI } from './user';
import { outfitAPI } from './outfit';
import { analyticsAPI } from './analytics';

// 导出所有API
export default {
  wardrobe: wardrobeAPI,
  user: userAPI,
  outfit: outfitAPI,
  analytics: analyticsAPI,
};
