import express from 'express';
import { clothingController } from '../controllers/clothingController';
import { authMiddleware } from '../middleware/auth';
import { validateIdParam, validatePagination } from '../middleware/validation';

const router = express.Router();

// 所有路由都需要认证
router.use(authMiddleware);

// ===== 分类相关路由 =====
router.get('/categories', clothingController.getCategories);
router.get('/categories/:id', validateIdParam, clothingController.getCategoryDetail);

// ===== 衣物管理路由 =====
// 查询路由
router.get('/clothing', validatePagination, clothingController.getClothingItems);
router.get('/clothing/:id', validateIdParam, clothingController.getClothingItemDetail);
router.get('/clothing/category/:categoryId', validateIdParam, validatePagination, clothingController.getClothingItemsByCategory);
router.get('/clothing/search', validatePagination, clothingController.searchClothingItems);
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