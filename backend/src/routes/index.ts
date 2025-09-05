import express from 'express';
import healthRoutes from './health';
import authRoutes from './auth';
import clothingRoutes from './clothing';

const router = express.Router();

// API版本前缀
const API_PREFIX = '/api/v1';

// 路由注册
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/clothing', clothingRoutes);

// 导出带前缀的路由
export default (app: express.Application) => {
  app.use(API_PREFIX, router);
};