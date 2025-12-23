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

/**
 * 验证ID参数中间件
 * 确保ID参数是有效的数字
 */
export const validateIdParam = (req: Request, res: Response, next: NextFunction): void => {
  const id = req.params.id || req.params.categoryId || req.params.userId;
  
  if (id && !/^\d+$/.test(id)) {
    res.status(400).json({
      success: false,
      message: '无效的ID参数，必须是数字',
      error: { code: 'INVALID_ID' }
    });
    return;
  }
  
  next();
};

/**
 * 验证分页参数中间件
 * 确保分页参数在合理范围内
 */
export const validatePagination = (req: Request, res: Response, next: NextFunction): void => {
  const page = req.query.page ? parseInt(req.query.page as string) : undefined;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
  
  // 只有当提供了分页参数时才验证
  if ((page !== undefined && page < 1) || (limit !== undefined && (limit < 1 || limit > 100))) {
    res.status(400).json({
      success: false,
      message: '无效的分页参数',
      error: { code: 'INVALID_PAGINATION_PARAMS', details: '页码必须大于等于1，每页数量必须在1-100之间' }
    });
    return;
  }
  
  // 只有当参数有值时才更新请求对象
  if (page !== undefined) {
    req.query.page = page.toString();
  }
  if (limit !== undefined) {
    req.query.limit = limit.toString();
  }
  next();
};