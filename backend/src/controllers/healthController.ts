import { Request, Response } from 'express';
import { ApiResponse } from '../types';

export class HealthController {
  /**
   * 健康检查
   */
  async getHealth(req: Request, res: Response) {
    const response: ApiResponse = {
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      }
    };

    res.json(response);
  }

  /**
   * 详细系统信息
   */
  async getSystemInfo(req: Request, res: Response) {
    const response: ApiResponse = {
      success: true,
      data: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        uptime: Math.round(process.uptime()) + 's'
      }
    };

    res.json(response);
  }
}

export default new HealthController();