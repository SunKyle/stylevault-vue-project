import { Request, Response } from 'express';
import { UserPreferencesService, UserPreferencesCreateData, UserPreferencesUpdateData } from '../services/UserPreferencesService';
import logger from '../utils/logger';

/**
 * 用户偏好控制器
 * 处理用户偏好相关的HTTP请求
 */
export class UserPreferencesController {
  private userPreferencesService: UserPreferencesService;

  constructor() {
    this.userPreferencesService = new UserPreferencesService();
  }

  /**
   * 创建用户偏好
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: UserPreferencesCreateData = req.body;
      
      // 验证请求数据
      if (!data.userId) {
        res.status(400).json({
          success: false,
          message: '用户ID不能为空',
          error: {
            code: 'INVALID_DATA',
            details: 'userId字段是必需的'
          }
        });
        return;
      }

      const preferences = await this.userPreferencesService.create(data);
      
      res.status(201).json({
        success: true,
        message: '用户偏好创建成功',
        data: preferences
      });
      
      logger.info(`用户偏好创建成功: 用户ID ${data.userId}`);
    } catch (error) {
      logger.error('创建用户偏好失败:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('用户ID')) {
          res.status(404).json({
            success: false,
            message: error.message,
            error: {
              code: 'USER_NOT_FOUND',
              details: '指定的用户不存在'
            }
          });
        } else {
          res.status(400).json({
            success: false,
            message: '创建用户偏好失败',
            error: {
              code: 'CREATE_FAILED',
              details: error.message
            }
          });
        }
      } else {
        res.status(500).json({
          success: false,
          message: '服务器内部错误',
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            details: '请稍后再试'
          }
        });
      }
    }
  };

  /**
   * 获取用户偏好列表
   */
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const options = {
        userId: req.query.userId ? parseInt(req.query.userId as string, 10) : undefined,
        styleTypes: req.query.styleTypes ? (req.query.styleTypes as string).split(',') : undefined,
        seasons: req.query.seasons ? (req.query.seasons as string).split(',') : undefined,
        occasions: req.query.occasions ? (req.query.occasions as string).split(',') : undefined,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC'
      };

      const preferences = await this.userPreferencesService.getAll(options);
      
      res.status(200).json({
        success: true,
        message: '获取用户偏好列表成功',
        data: preferences,
        total: preferences.length
      });
      
      logger.info(`获取用户偏好列表成功，共 ${preferences.length} 条记录`);
    } catch (error) {
      logger.error('获取用户偏好列表失败:', error);
      
      res.status(500).json({
        success: false,
        message: '获取用户偏好列表失败',
        error: {
          code: 'GET_LIST_FAILED',
          details: error instanceof Error ? error.message : String(error)
        }
      });
    }
  };

  /**
   * 根据ID获取用户偏好
   */
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: '无效的用户偏好ID',
          error: {
            code: 'INVALID_ID',
            details: 'ID必须是有效的数字'
          }
        });
        return;
      }

      const preferences = await this.userPreferencesService.getById(id);
      
      if (!preferences) {
        res.status(404).json({
          success: false,
          message: `未找到ID为 ${id} 的用户偏好`,
          error: {
            code: 'PREFERENCES_NOT_FOUND',
            details: '指定的用户偏好不存在'
          }
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: '获取用户偏好成功',
        data: preferences
      });
      
      logger.info(`获取用户偏好ID ${id} 成功`);
    } catch (error) {
      logger.error('获取用户偏好失败:', error);
      
      res.status(500).json({
        success: false,
        message: '获取用户偏好失败',
        error: {
          code: 'GET_FAILED',
          details: error instanceof Error ? error.message : String(error)
        }
      });
    }
  };

  /**
   * 根据用户ID获取偏好
   */
  getByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId, 10);
      
      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: '无效的用户ID',
          error: {
            code: 'INVALID_USER_ID',
            details: '用户ID必须是有效的数字'
          }
        });
        return;
      }

      const preferences = await this.userPreferencesService.getByUserId(userId);
      
      if (!preferences) {
        res.status(404).json({
          success: false,
          message: `未找到用户ID为 ${userId} 的偏好设置`,
          error: {
            code: 'PREFERENCES_NOT_FOUND',
            details: '指定用户的偏好设置不存在'
          }
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: '获取用户偏好成功',
        data: preferences
      });
      
      logger.info(`获取用户ID ${userId} 的偏好设置成功`);
    } catch (error) {
      logger.error('获取用户偏好失败:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('用户ID')) {
          res.status(404).json({
            success: false,
            message: error.message,
            error: {
              code: 'USER_NOT_FOUND',
              details: '指定的用户不存在'
            }
          });
        } else {
          res.status(500).json({
            success: false,
            message: '获取用户偏好失败',
            error: {
              code: 'GET_FAILED',
              details: error.message
            }
          });
        }
      } else {
        res.status(500).json({
          success: false,
          message: '服务器内部错误',
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            details: '请稍后再试'
          }
        });
      }
    }
  };

  /**
   * 更新用户偏好
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const data: UserPreferencesUpdateData = req.body;
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: '无效的用户偏好ID',
          error: {
            code: 'INVALID_ID',
            details: 'ID必须是有效的数字'
          }
        });
        return;
      }

      const updatedPreferences = await this.userPreferencesService.update(id, data);
      
      if (!updatedPreferences) {
        res.status(404).json({
          success: false,
          message: `未找到ID为 ${id} 的用户偏好`,
          error: {
            code: 'PREFERENCES_NOT_FOUND',
            details: '指定的用户偏好不存在'
          }
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: '用户偏好更新成功',
        data: updatedPreferences
      });
      
      logger.info(`更新用户偏好ID ${id} 成功`);
    } catch (error) {
      logger.error('更新用户偏好失败:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('用户偏好设置ID')) {
          res.status(404).json({
            success: false,
            message: error.message,
            error: {
              code: 'PREFERENCES_NOT_FOUND',
              details: '指定的用户偏好不存在'
            }
          });
        } else {
          res.status(400).json({
            success: false,
            message: '更新用户偏好失败',
            error: {
              code: 'UPDATE_FAILED',
              details: error.message
            }
          });
        }
      } else {
        res.status(500).json({
          success: false,
          message: '服务器内部错误',
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            details: '请稍后再试'
          }
        });
      }
    }
  };

  /**
   * 根据用户ID更新偏好
   */
  updateByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const data: UserPreferencesUpdateData = req.body;
      
      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: '无效的用户ID',
          error: {
            code: 'INVALID_USER_ID',
            details: '用户ID必须是有效的数字'
          }
        });
        return;
      }

      const updatedPreferences = await this.userPreferencesService.updateByUserId(userId, data);
      
      res.status(200).json({
        success: true,
        message: '用户偏好更新成功',
        data: updatedPreferences
      });
      
      logger.info(`更新用户ID ${userId} 的偏好设置成功`);
    } catch (error) {
      logger.error('更新用户偏好失败:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('用户ID')) {
          res.status(404).json({
            success: false,
            message: error.message,
            error: {
              code: 'USER_NOT_FOUND',
              details: '指定的用户不存在'
            }
          });
        } else {
          res.status(400).json({
            success: false,
            message: '更新用户偏好失败',
            error: {
              code: 'UPDATE_FAILED',
              details: error.message
            }
          });
        }
      } else {
        res.status(500).json({
          success: false,
          message: '服务器内部错误',
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            details: '请稍后再试'
          }
        });
      }
    }
  };

  /**
   * 删除用户偏好
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: '无效的用户偏好ID',
          error: {
            code: 'INVALID_ID',
            details: 'ID必须是有效的数字'
          }
        });
        return;
      }

      const result = await this.userPreferencesService.delete(id);
      
      if (!result) {
        res.status(404).json({
          success: false,
          message: `未找到ID为 ${id} 的用户偏好`,
          error: {
            code: 'PREFERENCES_NOT_FOUND',
            details: '指定的用户偏好不存在'
          }
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: '用户偏好删除成功',
        data: null
      });
      
      logger.info(`删除用户偏好ID ${id} 成功`);
    } catch (error) {
      logger.error('删除用户偏好失败:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('用户偏好设置ID')) {
          res.status(404).json({
            success: false,
            message: error.message,
            error: {
              code: 'PREFERENCES_NOT_FOUND',
              details: '指定的用户偏好不存在'
            }
          });
        } else {
          res.status(400).json({
            success: false,
            message: '删除用户偏好失败',
            error: {
              code: 'DELETE_FAILED',
              details: error.message
            }
          });
        }
      } else {
        res.status(500).json({
          success: false,
          message: '服务器内部错误',
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            details: '请稍后再试'
          }
        });
      }
    }
  };

  /**
   * 添加偏好颜色
   */
  addPreferredColor = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const { color } = req.body; // 颜色ID，字符串格式
      
      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: '无效的用户ID',
          error: {
            code: 'INVALID_USER_ID',
            details: '用户ID必须是有效的数字'
          }
        });
        return;
      }
      
      if (!color) {
        res.status(400).json({
          success: false,
          message: '颜色ID不能为空',
          error: {
            code: 'INVALID_COLOR',
            details: 'color字段是必需的'
          }
        });
        return;
      }

      const updatedPreferences = await this.userPreferencesService.addPreferredColor(userId, color);
      
      res.status(200).json({
        success: true,
        message: '偏好颜色添加成功',
        data: updatedPreferences
      });
      
      logger.info(`为用户ID ${userId} 添加偏好颜色 ${color} 成功`);
    } catch (error) {
      logger.error('添加偏好颜色失败:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('用户ID')) {
          res.status(404).json({
            success: false,
            message: error.message,
            error: {
              code: 'USER_NOT_FOUND',
              details: '指定的用户不存在'
            }
          });
        } else if (error.message.includes('无效的颜色ID')) {
          res.status(400).json({
            success: false,
            message: error.message,
            error: {
              code: 'INVALID_COLOR_ID',
              details: '请提供有效的颜色ID'
            }
          });
        } else {
          res.status(400).json({
            success: false,
            message: '添加偏好颜色失败',
            error: {
              code: 'ADD_COLOR_FAILED',
              details: error.message
            }
          });
        }
      } else {
        res.status(500).json({
          success: false,
          message: '服务器内部错误',
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            details: '请稍后再试'
          }
        });
      }
    }
  };

  /**
   * 移除偏好颜色
   */
  removePreferredColor = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const color = req.params.colorId; // 颜色ID，字符串格式
      
      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: '无效的用户ID',
          error: {
            code: 'INVALID_USER_ID',
            details: '用户ID必须是有效的数字'
          }
        });
        return;
      }
      
      if (!color) {
        res.status(400).json({
          success: false,
          message: '颜色ID不能为空',
          error: {
            code: 'INVALID_COLOR',
            details: 'colorId参数是必需的'
          }
        });
        return;
      }

      const updatedPreferences = await this.userPreferencesService.removePreferredColor(userId, color);
      
      res.status(200).json({
        success: true,
        message: '偏好颜色移除成功',
        data: updatedPreferences
      });
      
      logger.info(`为用户ID ${userId} 移除偏好颜色 ${color} 成功`);
    } catch (error) {
      logger.error('移除偏好颜色失败:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('用户ID')) {
          res.status(404).json({
            success: false,
            message: error.message,
            error: {
              code: 'USER_NOT_FOUND',
              details: '指定的用户不存在'
            }
          });
        } else if (error.message.includes('无效的颜色ID')) {
          res.status(400).json({
            success: false,
            message: error.message,
            error: {
              code: 'INVALID_COLOR_ID',
              details: '请提供有效的颜色ID'
            }
          });
        } else {
          res.status(400).json({
            success: false,
            message: '移除偏好颜色失败',
            error: {
              code: 'REMOVE_COLOR_FAILED',
              details: error.message
            }
          });
        }
      } else {
        res.status(500).json({
          success: false,
          message: '服务器内部错误',
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            details: '请稍后再试'
          }
        });
      }
    }
  };
}