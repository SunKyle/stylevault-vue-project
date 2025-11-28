import express from 'express';
import { clothingController } from '../controllers/clothingController';
import { authMiddleware } from '../middleware/auth';
import { validateIdParam, validatePagination } from '../middleware/validation';

const router = express.Router();

// ===== 公共路由（无需认证） =====
router.get('/categories', clothingController.getCategories);
router.get('/categories/:id', validateIdParam, clothingController.getCategoryDetail);

// ===== 枚举值获取路由（无需认证） =====
router.get('/enums/types', clothingController.getClothingTypes);
router.get('/enums/seasons', clothingController.getSeasons);
router.get('/enums/occasions', clothingController.getOccasions);
router.get('/enums/styles', clothingController.getStyles);
router.get('/enums/all', clothingController.getAllEnums);

// 需要认证的路由
router.use(authMiddleware);

// ===== 衣物管理路由 =====
// 查询路由
router.get('/clothing', validatePagination, clothingController.getClothingItems);
router.get('/clothing/search', validatePagination, clothingController.searchClothingItems);
router.get('/clothing/category/:categoryId', validateIdParam, validatePagination, clothingController.getClothingItemsByCategory);
router.get('/clothing/:id', validateIdParam, clothingController.getClothingItemDetail);
router.get('/users/:userId/clothing', validateIdParam, validatePagination, clothingController.getUserClothingItems);

// CRUD操作
router.post('/clothing', clothingController.addClothingItem);
router.put('/clothing/:id', validateIdParam, clothingController.updateClothingItem);
router.delete('/clothing/:id', validateIdParam, clothingController.deleteClothingItem);

// ===== 收藏管理路由 =====
router.post('/clothing/:id/favorite', validateIdParam, clothingController.toggleFavorite);
router.get('/clothing/favorites', validatePagination, clothingController.getFavoriteItems);
router.get('/users/:userId/favorites', validateIdParam, validatePagination, clothingController.getFavoriteItems);

// ===== 统计分析路由 =====
router.get('/users/:userId/stats', validateIdParam, clothingController.getClothingStats);

export default router;