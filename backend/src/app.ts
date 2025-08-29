import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { testConnection } from './config/database';
import registerRoutes from './routes';
import logger from './utils/logger';

// 加载环境变量
dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

// 初始化数据库连接
const initializeDatabase = async () => {
  try {
    const connected = await testConnection();
    if (!connected) {
      logger.error('❌ Database connection failed');
      process.exit(1);
    }
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

// 中间件
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 注册路由
registerRoutes(app);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// 全局错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 启动服务器
const startServer = async () => {
  try {
    // 初始化数据库
    await initializeDatabase();
    
    // 启动HTTP服务器
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    logger.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

// 优雅关闭
const gracefulShutdown = async () => {
  logger.info('🔄 Shutting down gracefully...');
  server.close(async () => {
    try {
      const { closeConnection } = await import('./config/database');
      await closeConnection();
      logger.info('✅ Server shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  });
};

// 注册信号处理器
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// 启动应用
if (require.main === module) {
  startServer();
}

export default app;