import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { appConfig } from '../config';

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '访问被拒绝，未提供token',
        error: { code: 'NO_TOKEN' }
      });
    }

    const decoded = jwt.verify(token, appConfig.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: '无效的token',
      error: { code: 'INVALID_TOKEN' }
    });
  }
};

export const optionalAuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, appConfig.jwtSecret);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // 可选认证，token无效也继续
    next();
  }
};