import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import logger from '../utils/logger';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * 用户注册
   */
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, email, password } = req.body;

      // 调用服务层处理注册逻辑
      const result = await this.authService.register({
        username,
        email,
        password,
      });

      // 返回成功响应
      res.status(201).json({
        success: true,
        message: '用户注册成功',
        data: {
          user: {
            id: result.user.id,
            username: result.user.username,
            email: result.user.email,
            createdAt: result.user.createdAt,
          },
        },
      });

      logger.info(`用户注册成功: ${email}`);
    } catch (error) {
      logger.error('用户注册失败:', error);

      if (error instanceof Error) {
        if (error instanceof Error ? error.message : String(error).includes('邮箱已存在')) {
          res.status(409).json({
            success: false,
            message: '该邮箱已被注册',
            error: {
              code: 'EMAIL_ALREADY_EXISTS',
              details: '请使用其他邮箱地址',
            },
          });
        } else if (error instanceof Error ? error.message : String(error).includes('用户名已存在')) {
          res.status(409).json({
            success: false,
            message: '该用户名已被使用',
            error: {
              code: 'USERNAME_ALREADY_EXISTS',
              details: '请使用其他用户名',
            },
          });
        } else {
          res.status(400).json({
            success: false,
            message: '注册失败',
            error: {
              code: 'REGISTRATION_FAILED',
              details: error instanceof Error ? error.message : String(error),
            },
          });
        }
      } else {
        res.status(500).json({
          success: false,
          message: '服务器内部错误',
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            details: '请稍后再试',
          },
        });
      }
    }
  };

  /**
   * 用户登录
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      // 调用服务层处理登录逻辑
      const result = await this.authService.login({
        email,
        password,
      });

      // 返回成功响应
      res.status(200).json({
        success: true,
        message: '登录成功',
        data: {
          token: result.token,
          user: {
            id: result.user.id,
            username: result.user.username,
            email: result.user.email,
          },
        },
      });

      logger.info(`用户登录成功: ${email}`);
    } catch (error) {
      logger.error('用户登录失败:', error);

      if (error instanceof Error) {
        if (error instanceof Error ? error.message : String(error).includes('用户不存在')) {
          res.status(401).json({
            success: false,
            message: '邮箱或密码错误',
            error: {
              code: 'INVALID_CREDENTIALS',
              details: '请检查邮箱和密码',
            },
          });
        } else if (error instanceof Error ? error.message : String(error).includes('密码错误')) {
          res.status(401).json({
            success: false,
            message: '邮箱或密码错误',
            error: {
              code: 'INVALID_CREDENTIALS',
              details: '请检查邮箱和密码',
            },
          });
        } else {
          res.status(400).json({
            success: false,
            message: '登录失败',
            error: {
              code: 'LOGIN_FAILED',
              details: error instanceof Error ? error.message : String(error),
            },
          });
        }
      } else {
        res.status(500).json({
          success: false,
          message: '服务器内部错误',
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            details: '请稍后再试',
          },
        });
      }
    }
  };
}