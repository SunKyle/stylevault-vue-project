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
  // 抽离 CORS 配置（避免重复）
  private corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? (process.env.FRONTEND_URL || ['http://localhost:8081', 'http://localhost:8082']) : '*',
    credentials: true,
  };

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    // 1. 安全中间件（最先注册）
    this.app.use(helmet());
    
    // 2. 全局 CORS 配置（接口用）
    this.app.use(cors(this.corsOptions));

    // 3. 静态资源（uploads）专属配置（CORS + 托管 + 缓存）
    // 3.1 单独给/uploads配CORS（必须在static前面）
    this.app.use('/uploads', cors(this.corsOptions));
    // 3.2 托管/uploads静态资源（只注册一次）
    this.app.use('/uploads', 
      // 静态资源缓存（优化性能）
      express.static('uploads', {
        maxAge: '1d', // 缓存1天（生产环境可设更长）
        setHeaders: (res, path) => {
          // 图片文件添加缓存头
          if (/\.(jpg|jpeg|png|gif|webp)$/.test(path)) {
            res.setHeader('Cache-Control', 'public, max-age=86400'); // 24小时
          }
        }
      })
    );

    // 4. 压缩响应（排除静态资源，已缓存）
    this.app.use(compression());

    // 5. 速率限制（排除静态资源）
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 100, // 每个IP最多100个请求
      message: '请求过于频繁，请稍后再试',
      // 排除/uploads路径，图片加载不限制
      skip: (req) => req.path.startsWith('/uploads'),
    });
    this.app.use(limiter);

    // 6. 请求体解析（接口用，静态资源不需要）
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // 7. 日志记录（所有请求都记录）
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