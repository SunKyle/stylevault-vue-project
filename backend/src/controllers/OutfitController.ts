import { Request, Response } from 'express';
import { OutfitService, OutfitCreateData, OutfitUpdateData, OutfitQueryOptions } from '../services/OutfitService';
import { validationResult } from 'express-validator';
import logger from '../utils/logger';

const outfitService = new OutfitService();

export class OutfitController {
  /**
   * 创建新搭配
   */
  async createOutfit(req: Request, res: Response): Promise<void> {
    // console.log('createOutfit req.body:', req.body);
    try {
      // 验证请求参数
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          status: 'error',
          message: '参数验证失败',
          error: {
            code: 'VALIDATION_ERROR',
            details: errors.array()
          }
        });
        return;
      }

      const userId = (req as any).user.userId; // 从authMiddleware获取用户ID
      
      // 支持新旧两种请求格式，处理title->name映射
      const outfitData: OutfitCreateData = {
        userId,
        name: req.body.name || req.body.title, 
        description: req.body.description,
        coverImageUrl: req.body.coverImageUrl,
        imageUrls: req.body.imageUrls,
        isPublic: req.body.isPublic,
        metadata: req.body.metadata,
        occasion: req.body.scenes || req.body.occasion,
        season: req.body.seasons || req.body.season,
        style: req.body.styles || req.body.style,
        items: req.body.items
      };

      const outfit = await outfitService.createOutfit(outfitData);
      res.status(201).json({
        status: 'success',
        message: '搭配创建成功',
        data: outfit
      });
    } catch (error) {
      logger.error('创建搭配API错误:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : '创建搭配失败'
      });
    }
  }

  /**
   * 获取搭配列表
   */
  async getOutfits(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const queryOptions: OutfitQueryOptions = {
        userId,
        status: req.query.status as string,
        season: parseInt(req.query.season as string, 10) || undefined,
        occasion: parseInt(req.query.occasion as string, 10) || undefined,
        style: parseInt(req.query.style as string, 10) || undefined,
        isPublic: req.query.isPublic === 'true' ? true : req.query.isPublic === 'false' ? false : undefined,
        search: req.query.search as string,
        page: parseInt(req.query.page as string, 10) || 1,
        limit: parseInt(req.query.limit as string, 10) || 10,
        sortBy: req.query.sortBy as string || 'createdAt',
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC' || 'DESC'
      };

      const outfits = await outfitService.getOutfits(queryOptions);
      res.status(200).json({
        status: 'success',
        message: '获取搭配列表成功',
        data: outfits
      });
    } catch (error) {
      logger.error('获取搭配列表API错误:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : '获取搭配列表失败'
      });
    }
  }

  /**
   * 获取搭配详情
   */
  async getOutfitById(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const outfitId = parseInt(req.params.id, 10);

      if (isNaN(outfitId)) {
        res.status(400).json({
          status: 'error',
          message: '无效的搭配ID',
          error: {
            code: 'INVALID_OUTFIT_ID'
          }
        });
        return;
      }

      const outfit = await outfitService.getOutfitById(outfitId, userId);
      if (!outfit) {
        res.status(404).json({
          status: 'error',
          message: '搭配不存在',
          error: {
            code: 'OUTFIT_NOT_FOUND'
          }
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        message: '获取搭配详情成功',
        data: outfit
      });
    } catch (error) {
      logger.error('获取搭配详情API错误:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : '获取搭配详情失败'
      });
    }
  }

  /**
   * 更新搭配信息
   */
  async updateOutfit(req: Request, res: Response): Promise<void> {
    try {
      // 验证请求参数
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          status: 'error',
          message: '参数验证失败',
          error: {
            code: 'VALIDATION_ERROR',
            details: errors.array()
          }
        });
        return;
      }

      const userId = (req as any).user.userId;
      const outfitId = parseInt(req.params.id, 10);

      if (isNaN(outfitId)) {
        res.status(400).json({
          status: 'error',
          message: '无效的搭配ID',
          error: {
            code: 'INVALID_OUTFIT_ID'
          }
        });
        return;
      }

      const updateData: OutfitUpdateData = {
        name: req.body.name,
        description: req.body.description,
        season: req.body.season,
        occasion: req.body.occasion,
        style: req.body.style,
        coverImageUrl: req.body.coverImageUrl,
        imageUrls: req.body.imageUrls,
        isPublic: req.body.isPublic,
        metadata: req.body.metadata
      };

      const updatedOutfit = await outfitService.updateOutfit(outfitId, userId, updateData);
      res.status(200).json({
        status: 'success',
        message: '搭配更新成功',
        data: updatedOutfit
      });
    } catch (error) {
      logger.error('更新搭配API错误:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : '更新搭配失败'
      });
    }
  }

  /**
   * 删除搭配
   */
  async deleteOutfit(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const outfitId = parseInt(req.params.id, 10);

      if (isNaN(outfitId)) {
        res.status(400).json({
          status: 'error',
          message: '无效的搭配ID',
          error: {
            code: 'INVALID_OUTFIT_ID'
          }
        });
        return;
      }

      await outfitService.deleteOutfit(outfitId, userId);
      res.status(204).end();
    } catch (error) {
      logger.error('删除搭配API错误:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : '删除搭配失败'
      });
    }
  }

  /**
   * 添加衣物到搭配
   */
  async addClothingToOutfit(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const outfitId = parseInt(req.params.outfitId, 10);
      const clothingId = parseInt(req.params.clothingId, 10);

      if (isNaN(outfitId) || isNaN(clothingId)) {
        res.status(400).json({
          status: 'error',
          message: '无效的ID参数',
          error: {
            code: 'INVALID_ID_PARAMS'
          }
        });
        return;
      }

      const result = await outfitService.addClothingToOutfit(outfitId, clothingId, userId);
      res.status(201).json({
        status: 'success',
        message: '衣物添加到搭配成功',
        data: result
      });
    } catch (error) {
      logger.error('添加衣物到搭配API错误:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : '添加衣物到搭配失败'
      });
    }
  }

  /**
   * 从搭配中移除衣物
   */
  async removeClothingFromOutfit(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const outfitId = parseInt(req.params.outfitId, 10);
      const clothingId = parseInt(req.params.clothingId, 10);

      if (isNaN(outfitId) || isNaN(clothingId)) {
        res.status(400).json({
          status: 'error',
          message: '无效的ID参数',
          error: {
            code: 'INVALID_ID_PARAMS'
          }
        });
        return;
      }

      await outfitService.removeClothingFromOutfit(outfitId, clothingId, userId);
      res.status(204).end();
    } catch (error) {
      logger.error('从搭配中移除衣物API错误:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : '从搭配中移除衣物失败'
      });
    }
  }

  /**
   * 重新排序搭配中的衣物
   */
  async reorderClothesInOutfit(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const outfitId = parseInt(req.params.outfitId, 10);
      const clothesOrder = req.body.clothesOrder as number[];

      if (isNaN(outfitId) || !Array.isArray(clothesOrder)) {
        res.status(400).json({
          status: 'error',
          message: '无效的参数',
          error: {
            code: 'INVALID_PARAMS'
          }
        });
        return;
      }

      const result = await outfitService.reorderClothesInOutfit(outfitId, clothesOrder, userId);
      res.status(200).json({
        status: 'success',
        message: '搭配中衣物排序成功',
        data: result
      });
    } catch (error) {
      logger.error('重新排序搭配中衣物API错误:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : '重新排序搭配中衣物失败'
      });
    }
  }

  /**
   * 获取搭配中的所有衣物
   */
  async getOutfitClothes(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const outfitId = parseInt(req.params.outfitId, 10);

      if (isNaN(outfitId)) {
        res.status(400).json({
          status: 'error',
          message: '无效的搭配ID',
          error: {
            code: 'INVALID_OUTFIT_ID'
          }
        });
        return;
      }

      const clothes = await outfitService.getOutfitClothes(outfitId, userId);
      res.status(200).json({
        status: 'success',
        message: '获取搭配中的衣物成功',
        data: clothes
      });
    } catch (error) {
      logger.error('获取搭配中衣物API错误:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : '获取搭配中衣物失败'
      });
    }
  }

  /**
   * 发布搭配
   */
  async publishOutfit(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const outfitId = parseInt(req.params.id, 10);

      if (isNaN(outfitId)) {
        res.status(400).json({
          status: 'error',
          message: '无效的搭配ID',
          error: {
            code: 'INVALID_OUTFIT_ID'
          }
        });
        return;
      }

      const updatedOutfit = await outfitService.publishOutfit(outfitId, userId);
      res.status(200).json({
        status: 'success',
        message: '搭配发布成功',
        data: updatedOutfit
      });
    } catch (error) {
      logger.error('发布搭配API错误:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : '发布搭配失败'
      });
    }
  }

  /**
   * 归档搭配
   */
  async archiveOutfit(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const outfitId = parseInt(req.params.id, 10);

      if (isNaN(outfitId)) {
        res.status(400).json({
          status: 'error',
          message: '无效的搭配ID',
          error: {
            code: 'INVALID_OUTFIT_ID'
          }
        });
        return;
      }

      const updatedOutfit = await outfitService.archiveOutfit(outfitId, userId);
      res.status(200).json({
        status: 'success',
        message: '搭配归档成功',
        data: updatedOutfit
      });
    } catch (error) {
      logger.error('归档搭配API错误:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : '归档搭配失败'
      });
    }
  }

  /**
   * 设置搭配为公开
   */
  async setOutfitPublic(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const outfitId = parseInt(req.params.id, 10);

      if (isNaN(outfitId)) {
        res.status(400).json({
          status: 'error',
          message: '无效的搭配ID',
          error: {
            code: 'INVALID_OUTFIT_ID'
          }
        });
        return;
      }

      const updatedOutfit = await outfitService.setOutfitPublic(outfitId, userId);
      res.status(200).json({
        status: 'success',
        message: '搭配设置为公开成功',
        data: updatedOutfit
      });
    } catch (error) {
      logger.error('设置搭配为公开API错误:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : '设置搭配为公开失败'
      });
    }
  }

  /**
   * 设置搭配为私有
   */
  async setOutfitPrivate(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const outfitId = parseInt(req.params.id, 10);

      if (isNaN(outfitId)) {
        res.status(400).json({
          status: 'error',
          message: '无效的搭配ID',
          error: {
            code: 'INVALID_OUTFIT_ID'
          }
        });
        return;
      }

      const updatedOutfit = await outfitService.setOutfitPrivate(outfitId, userId);
      res.status(200).json({
        status: 'success',
        message: '搭配设置为私有成功',
        data: updatedOutfit
      });
    } catch (error) {
      logger.error('设置搭配为私有API错误:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : '设置搭配为私有失败'
      });
    }
  }

  /**
   * 为搭配评分
   */
  async rateOutfit(req: Request, res: Response): Promise<void> {
    try {
      // 验证请求参数
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          status: 'error',
          message: '参数验证失败',
          error: {
            code: 'VALIDATION_ERROR',
            details: errors.array()
          }
        });
        return;
      }

      const userId = (req as any).user.id;
      const outfitId = parseInt(req.params.id, 10);
      const rating = req.body.rating;

      if (isNaN(outfitId) || typeof rating !== 'number') {
        res.status(400).json({
          status: 'error',
          message: '无效的参数',
          error: {
            code: 'INVALID_PARAMS'
          }
        });
        return;
      }

      const updatedOutfit = await outfitService.rateOutfit(outfitId, rating, userId);
      res.status(200).json({
        status: 'success',
        message: '搭配评分成功',
        data: updatedOutfit
      });
    } catch (error) {
      logger.error('搭配评分API错误:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : '搭配评分失败'
      });
    }
  }

  /**
   * 记录搭配使用
   */
  async recordOutfitUsage(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const outfitId = parseInt(req.params.id, 10);

      if (isNaN(outfitId)) {
        res.status(400).json({
          status: 'error',
          message: '无效的搭配ID',
          error: {
            code: 'INVALID_OUTFIT_ID'
          }
        });
        return;
      }

      const updatedOutfit = await outfitService.recordOutfitUsage(outfitId, userId);
      res.status(200).json({
        status: 'success',
        message: '搭配使用记录成功',
        data: updatedOutfit
      });
    } catch (error) {
      logger.error('记录搭配使用API错误:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : '记录搭配使用失败'
      });
    }
  }

  /**
   * 获取搭配统计信息
   */
  async getOutfitStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const stats = await outfitService.getOutfitStats(userId);
      res.status(200).json({
        status: 'success',
        message: '获取搭配统计信息成功',
        data: stats
      });
    } catch (error) {
      logger.error('获取搭配统计信息API错误:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : '获取搭配统计信息失败'
      });
    }
  }
}