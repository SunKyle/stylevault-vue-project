import express from 'express';
import { OutfitController } from '../controllers/OutfitController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest, validateIdParam, validatePagination } from '../middleware/validation';
import { outfitValidation } from '../validators/outfitValidator';

const router = express.Router();
const outfitController = new OutfitController();

// 搭配相关路由

// ===== 公共路由 =====
// 获取公开搭配列表
router.get('/outfits/public', validatePagination, outfitController.getOutfits);
// 获取公开搭配详情
router.get('/outfits/public/:id', validateIdParam, validateRequest, outfitController.getOutfitById);

// 需要认证的路由
router.use(authMiddleware);

// ===== 搭配管理路由 =====
// 查询路由
router.get('/outfits', validatePagination, outfitController.getOutfits);
router.get('/outfits/:id', validateIdParam, validateRequest, outfitController.getOutfitById);

// CRUD操作
router.post('/outfits', outfitValidation.createOutfit, validateRequest, outfitController.createOutfit);
router.put('/outfits/:id', validateIdParam, outfitValidation.updateOutfit, validateRequest, outfitController.updateOutfit);
router.delete('/outfits/:id', validateIdParam, validateRequest, outfitController.deleteOutfit);

// ===== 搭配衣物管理路由 =====
router.post('/outfits/:id/clothes/:clothingId', validateIdParam, validateRequest, outfitController.addClothingToOutfit);
router.delete('/outfits/:id/clothes/:clothingId', validateIdParam, validateRequest, outfitController.removeClothingFromOutfit);
router.put('/outfits/:id/clothes/order', validateIdParam, validateRequest, outfitController.reorderClothesInOutfit);
router.get('/outfits/:id/clothes', validateIdParam, validateRequest, outfitController.getOutfitClothes);

// ===== 搭配状态管理路由 =====
router.put('/outfits/:id/publish', validateIdParam, validateRequest, outfitController.publishOutfit);
router.put('/outfits/:id/archive', validateIdParam, validateRequest, outfitController.archiveOutfit);
router.put('/outfits/:id/public', validateIdParam, validateRequest, outfitController.setOutfitPublic);
router.put('/outfits/:id/private', validateIdParam, validateRequest, outfitController.setOutfitPrivate);

// ===== 搭配互动路由 =====
router.post('/outfits/:id/rate', validateIdParam, outfitValidation.rateOutfit, validateRequest, outfitController.rateOutfit);
router.post('/outfits/:id/use', validateIdParam, validateRequest, outfitController.recordOutfitUsage);

// ===== 统计分析路由 =====
router.get('/outfits/stats', outfitController.getOutfitStats);

export default router;