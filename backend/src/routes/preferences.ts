import express from 'express';
import { UserPreferencesController } from '../controllers/UserPreferencesController';
import { authMiddleware } from '../middleware/auth';
import { validateIdParam, validatePagination } from '../middleware/validation';

const router = express.Router();
const userPreferencesController = new UserPreferencesController();

// 需要认证的路由
router.use(authMiddleware);

// ===== 用户偏好管理路由 =====

// 查询路由
router.get('/preferences', validatePagination, userPreferencesController.getAll);
router.get('/preferences/:id', validateIdParam, userPreferencesController.getById);
router.get('/users/:userId/preferences', validateIdParam, userPreferencesController.getByUserId);

// CRUD操作
router.post('/preferences', userPreferencesController.create);
router.put('/preferences/:id', validateIdParam, userPreferencesController.update);
router.put('/users/:userId/preferences', validateIdParam, userPreferencesController.updateByUserId);
router.delete('/preferences/:id', validateIdParam, userPreferencesController.delete);

// ===== 颜色偏好管理路由 =====
router.post('/users/:userId/preferences/colors', validateIdParam, userPreferencesController.addPreferredColor);
router.delete('/users/:userId/preferences/colors/:colorId', validateIdParam, userPreferencesController.removePreferredColor);

export default router;