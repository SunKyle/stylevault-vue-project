import express from 'express';
import healthRoutes from './health';
import authRoutes from './auth';
import clothingRoutes from './clothing';
import outfitRoutes from './outfit';
import preferencesRoutes from './preferences';
import { clothingController } from '../controllers/clothingController';

const router = express.Router();

// API版本前缀
const API_PREFIX = '/api/v1';

// 路由注册
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/', clothingRoutes);
router.use('/', outfitRoutes);
router.use('/', preferencesRoutes);

// 添加枚举数据的重定向路由，解决前端调用路径不匹配问题
router.get('/enums/all', clothingController.getAllEnums);

// 导出带前缀的路由
export default (app: express.Application) => {
  app.use(API_PREFIX, router);
};