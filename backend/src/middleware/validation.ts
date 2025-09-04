import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
 * 验证请求参数中间件
 * 用于处理 express-validator 的验证结果
 */
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : error.type,
      message: error.msg,
      value: error.type === 'field' ? error.value : undefined,
    }));

    res.status(400).json({
      success: false,
      message: '参数验证失败',
      error: {
        code: 'VALIDATION_ERROR',
        details: errorMessages,
      },
    });
    return;
  }

  next();
};