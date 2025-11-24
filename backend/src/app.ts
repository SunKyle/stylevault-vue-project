import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import logger from './utils/logger';
import { databaseConfig, appConfig } from './config';
import { sequelize } from './models/setup';
import registerRoutes from './routes';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    // 安全中间件
    this.app.use(helmet());
    
    // CORS配置
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    }));

    // 压缩响应
    this.app.use(compression());

    // 速率限制
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 100, // 每个IP最多100个请求
      message: '请求过于频繁，请稍后再试',
    });
    this.app.use(limiter);

    // 请求体解析
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // 日志记录
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path} - ${req.ip}`);
      next();
    });
  }

  private initializeRoutes() {
    // 注册所有路由
    registerRoutes(this.app);
  }

  private initializeErrorHandling() {
    // 404处理
    this.app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: '接口不存在',
        error: {
          code: 'NOT_FOUND',
          details: `无法找到 ${req.method} ${req.path}`,
        },
      });
    });

    // 全局错误处理
    this.app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error('未捕获的错误:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: '参数验证失败',
          error: {
            code: 'VALIDATION_ERROR',
            details: error.message,
          },
        });
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          success: false,
          message: '数据已存在',
          error: {
            code: 'DUPLICATE_ENTRY',
            details: '该记录已存在',
          },
        });
      }

      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          details: process.env.NODE_ENV === 'development' ? error.message : '请稍后再试',
        },
      });
    });
  }

  public async initializeDatabase() {
    try {
      await sequelize.authenticate();
      logger.info('数据库连接成功');
      
      // 暂时禁用自动同步以避免索引和列冲突
      // 在实际开发中，建议使用数据库迁移工具管理模式变更
      logger.info('数据库连接成功，已禁用自动模型同步');
    } catch (error) {
      logger.error('数据库连接失败:', error);
      process.exit(1);
    }
  }

  public listen() {
    const port = appConfig.port;
    this.app.listen(port, () => {
      logger.info(`服务器运行在端口 ${port}`);
      logger.info(`环境: ${process.env.NODE_ENV || 'development'}`);
    });
  }
}

// 启动应用
const app = new App();

// 初始化数据库并启动服务器
if (require.main === module) {
  app.initializeDatabase().then(() => {
    app.listen();
  });
}

export default app;