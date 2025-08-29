import express from 'express';
import healthRoutes from './health';

const router = express.Router();

// API版本前缀
const API_PREFIX = '/api/v1';

// 路由注册
router.use('/health', healthRoutes);

// 导出带前缀的路由
export default (app: express.Application) => {
  app.use(API_PREFIX, router);
};