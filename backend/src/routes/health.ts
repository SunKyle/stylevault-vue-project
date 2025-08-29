import express from 'express';
import healthController from '../controllers/healthController';

const router = express.Router();

// 健康检查路由
router.get('/', healthController.getHealth);
router.get('/system', healthController.getSystemInfo);

export default router;