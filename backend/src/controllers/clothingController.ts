import { Request, Response } from 'express';
import { ClothingService } from '../services/ClothingService';
import { AttributeService } from '../services/AttributeService';
import { attributeRepository } from '../repositories';

const clothingService = new ClothingService();
const attributeService = new AttributeService();

export class ClothingController {
  /**
   * 获取所有衣物分类 - 从Attribute模型获取分类数据
   */
  async getCategories(req: Request, res: Response) {
    try {
      // 获取分类为category的属性
      const categories = await attributeRepository.findByCategory('category');
      
      // 格式化返回数据
      const formattedCategories = categories.map(category => ({
        id: category.id,
        name: category.name,
        displayName: category.displayName,
        description: category.description || '',
        color: category.color || undefined,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      }));
      
      res.json({
        success: true,
        data: formattedCategories,
        message: '获取分类列表成功',
        total: formattedCategories.length
      });
    } catch (error) {
      console.error('获取分类列表失败:', error);
      res.status(500).json({
        success: false,
        message: '获取分类列表失败',
        error: { code: 'FETCH_CATEGORIES_ERROR', details: error instanceof Error ? error.message : String(error) }
      });
    }
  }

  /**
   * 获取分类详情 - 从Attribute模型获取分类详情
   */
  async getCategoryDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // 验证ID
      if (!id || isNaN(Number(id))) {
        return res.status(400).json({
          success: false,
          message: '无效的分类ID',
          error: { code: 'INVALID_CATEGORY_ID' }
        });
      }
      
      // 获取分类详情
      const category = await attributeService.getById(Number(id));
      
      if (!category || category.category !== 'category') {
        return res.status(404).json({
          success: false,
          message: '分类不存在',
          error: { code: 'CATEGORY_NOT_FOUND' }
        });
      }
      
      // 格式化返回数据
      const formattedCategory = {
        id: category.id,
        name: category.name,
        displayName: category.displayName,
        description: category.description || '',
        color: category.color || undefined,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      };
      
      res.json({
        success: true,
        data: formattedCategory,
        message: '获取分类详情成功'
      });
    } catch (error) {
      console.error('获取分类详情失败:', error);
      res.status(500).json({
        success: false,
        message: '获取分类详情失败',
        error: { code: 'FETCH_CATEGORY_DETAIL_ERROR', details: error instanceof Error ? error.message : String(error) }
      });
    }
  }

  /**
   * 获取用户衣物列表
   */
  async getUserClothingItems(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 50, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
      const result = await clothingService.getUserClothingItems(parseInt(userId), {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'ASC' | 'DESC'
      });

      res.json({
        success: true,
        data: result,
        message: '获取用户衣物列表成功'
      });
    } catch (error) {
      console.error('获取用户衣物列表失败:', error);
      res.status(500).json({
        success: false,
        message: '获取用户衣物列表失败',
        error: { code: 'FETCH_USER_CLOTHING_ITEMS_ERROR', details: error instanceof Error ? error.message : String(error) }
      });
    }
  }

  /**
   * 获取当前用户的衣物（从token中获取用户ID）
   */
  async getClothingItems(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, category, search, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
      const userId = (req as any).user.userId;
      
      const result = await clothingService.getClothingItems({
        userId,
        page: Number(page),
        limit: Number(limit),
        category: category && category !== 'all' ? parseInt(category as string) : undefined,
        search: search && search !== '' ? search as string : undefined,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'ASC' | 'DESC'
      });

      res.json({
        success: true,
        data: result,
        message: '获取衣物列表成功'
      });
    } catch (error) {
      console.error('获取衣物列表失败:', error);
      res.status(500).json({
        success: false,
        message: '获取衣物列表失败',
        error: { code: 'FETCH_CLOTHING_ITEMS_ERROR', details: error instanceof Error ? error.message : String(error) }
      });
    }
  }

  /**
   * 根据分类获取衣物
   */
  async getClothingItemsByCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const { page = 1, limit = 20, search, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
      const userId = (req as any).user.userId;
      
      const result = await clothingService.getClothingItemsByCategory(parseInt(categoryId), userId, {
        page: Number(page),
        limit: Number(limit),
        search: search && search !== '' ? search as string : undefined,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'ASC' | 'DESC'
      });

      res.json({
        success: true,
        data: result,
        message: '获取分类衣物成功'
      });
    } catch (error) {
      console.error('获取分类衣物失败:', error);
      res.status(500).json({
        success: false,
        message: '获取分类衣物失败',
        error: { code: 'FETCH_CLOTHING_BY_CATEGORY_ERROR', details: error instanceof Error ? error.message : String(error) }
      });
    }
  }

  /**
   * 获取衣物详情
   */
  async getClothingItemDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const clothingItem = await clothingService.getClothingItemById(parseInt(id), userId);

      if (!clothingItem) {
        return res.status(404).json({
          success: false,
          message: '衣物不存在',
          error: { code: 'CLOTHING_ITEM_NOT_FOUND' }
        });
      }

      res.json({
        success: true,
        data: clothingItem,
        message: '获取衣物详情成功'
      });
    } catch (error) {
      console.error('获取衣物详情失败:', error);
      res.status(500).json({
        success: false,
        message: '获取衣物详情失败',
        error: { code: 'FETCH_CLOTHING_DETAIL_ERROR', details: error instanceof Error ? error.message : String(error) }
      });
    }
  }

  /**
   * 搜索衣物
   */
  async searchClothingItems(req: Request, res: Response) {
    try {
      const { q, page = 1, limit = 20, category, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
      
      if (!q || (q as string).trim() === '') {
        return res.status(400).json({
          success: false,
          message: '搜索关键词不能为空',
          error: { code: 'SEARCH_QUERY_REQUIRED' }
        });
      }
      
      const userId = (req as any).user.userId;
      const result = await clothingService.searchClothingItems(q as string, userId, {
        page: Number(page),
        limit: Number(limit),
        category: category && category !== 'all' ? parseInt(category as string) : undefined,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'ASC' | 'DESC'
      });

      res.json({
        success: true,
        data: result,
        message: '搜索衣物成功'
      });
    } catch (error) {
      console.error('搜索衣物失败:', error);
      res.status(500).json({
        success: false,
        message: '搜索衣物失败',
        error: { code: 'SEARCH_CLOTHING_ERROR', details: error instanceof Error ? error.message : String(error) }
      });
    }
  }

  /**
   * 添加衣物
   */
  async addClothingItem(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const clothingItem = await clothingService.createClothingItem({
        ...req.body,
        userId
      });

      res.status(201).json({
        success: true,
        data: clothingItem,
        message: '添加衣物成功'
      });
    } catch (error) {
      console.error('添加衣物失败:', error);
      
      if (error instanceof Error && error.message === '分类不存在') {
        return res.status(400).json({
          success: false,
          message: '分类不存在',
          error: { code: 'CATEGORY_NOT_FOUND' }
        });
      }
      
      res.status(500).json({
        success: false,
        message: '添加衣物失败',
        error: { code: 'ADD_CLOTHING_ITEM_ERROR', details: error instanceof Error ? error.message : String(error) }
      });
    }
  }

  /**
   * 更新衣物信息
   */
  async updateClothingItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      const clothingItem = await clothingService.updateClothingItem(
        parseInt(id), 
        userId, 
        req.body
      );

      res.json({
        success: true,
        data: clothingItem,
        message: '更新衣物成功'
      });
    } catch (error) {
      console.error('更新衣物失败:', error);
      
      if (error instanceof Error) {
        if (error.message === '衣物不存在或无权限修改') {
          return res.status(404).json({
            success: false,
            message: '衣物不存在或无权限修改',
            error: { code: 'CLOTHING_ITEM_NOT_FOUND' }
          });
        }
        if (error.message === '分类不存在') {
          return res.status(400).json({
            success: false,
            message: '分类不存在',
            error: { code: 'CATEGORY_NOT_FOUND' }
          });
        }
      }
      
      res.status(500).json({
        success: false,
        message: '更新衣物失败',
        error: { code: 'UPDATE_CLOTHING_ERROR', details: error instanceof Error ? error.message : String(error) }
      });
    }
  }

  /**
   * 删除衣物
   */
  async deleteClothingItem(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      await clothingService.deleteClothingItem(parseInt(id), userId);

      res.json({
        success: true,
        message: '删除衣物成功'
      });
    } catch (error) {
      console.error('删除衣物失败:', error);
      
      if (error instanceof Error && error.message === '衣物不存在或无权限删除') {
        return res.status(404).json({
          success: false,
          message: '衣物不存在或无权限删除',
          error: { code: 'CLOTHING_ITEM_NOT_FOUND' }
        });
      }
      
      res.status(500).json({
        success: false,
        message: '删除衣物失败',
        error: { code: 'DELETE_CLOTHING_ITEM_ERROR', details: error instanceof Error ? error.message : String(error) }
      });
    }
  }

  /**
   * 切换收藏状态
   */
  async toggleFavorite(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      const result = await clothingService.toggleFavorite(parseInt(id), userId);

      res.json({
        success: true,
        data: { favorite: result.clothingItem.isFavorite },
        message: result.message
      });
    } catch (error) {
      console.error('切换收藏状态失败:', error);
      
      if (error instanceof Error && error.message === '衣物不存在或无权限修改') {
        return res.status(404).json({
          success: false,
          message: '衣物不存在或无权限修改',
          error: { code: 'CLOTHING_ITEM_NOT_FOUND' }
        });
      }
      
      res.status(500).json({
        success: false,
        message: '切换收藏状态失败',
        error: { code: 'TOGGLE_FAVORITE_ERROR', details: error instanceof Error ? error.message : String(error) }
      });
    }
  }

  /**
   * 获取用户收藏的衣物
   */
  async getFavoriteItems(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 50, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;

      const result = await clothingService.getFavoriteItems(parseInt(userId), {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sortBy: sortBy as string,
        sortOrder: sortOrder as string
      });

      res.json({
        success: true,
        data: result,
        message: '获取收藏列表成功'
      });
    } catch (error) {
      console.error('获取收藏列表失败:', error);
      res.status(500).json({
        success: false,
        message: '获取收藏列表失败',
        error: { code: 'FETCH_FAVORITE_ITEMS_ERROR', details: error instanceof Error ? error.message : String(error) }
      });
    }
  }

  /**
   * 获取衣物统计信息
   */
  async getClothingStats(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const stats = await clothingService.getClothingStats(parseInt(userId));

      res.json({
        success: true,
        data: stats,
        message: '获取统计信息成功'
      });
    } catch (error) {
      console.error('获取统计信息失败:', error);
      res.status(500).json({
        success: false,
        message: '获取统计信息失败',
        error: { code: 'FETCH_CLOTHING_STATS_ERROR', details: error instanceof Error ? error.message : String(error) }
      });
    }
  }

  /**
   * 获取衣物类型枚举值
   */
  async getClothingTypes(req: Request, res: Response) {
    try {
      const clothingTypes = await attributeService.getClothingTypes();

      res.json({
        success: true,
        data: clothingTypes,
        message: '获取衣物类型成功'
      });
    } catch (error) {
      console.error('获取衣物类型失败:', error);
      res.status(500).json({
        success: false,
        message: '获取衣物类型失败',
        error: { code: 'FETCH_CLOTHING_TYPES_ERROR', details: error instanceof Error ? error.message : String(error) }
      });
    }
  }

  /**
   * 获取季节枚举值
   */
  async getSeasons(req: Request, res: Response) {
    try {
      const seasons = await attributeService.getSeasons();

      res.json({
        success: true,
        data: seasons,
        message: '获取季节类型成功'
      });
    } catch (error) {
      console.error('获取季节类型失败:', error);
      res.status(500).json({
        success: false,
        message: '获取季节类型失败',
        error: { code: 'FETCH_SEASONS_ERROR', details: error instanceof Error ? error.message : String(error) }
      });
    }
  }

  /**
   * 获取场合枚举值
   */
  async getOccasions(req: Request, res: Response) {
    try {
      const occasions = await attributeService.getOccasions();

      res.json({
        success: true,
        data: occasions,
        message: '获取场合类型成功'
      });
    } catch (error) {
      console.error('获取场合类型失败:', error);
      res.status(500).json({
        success: false,
        message: '获取场合类型失败',
        error: { code: 'FETCH_OCCASIONS_ERROR', details: error instanceof Error ? error.message : String(error) }
      });
    }
  }

  /**
   * 获取风格枚举值
   */
  async getStyles(req: Request, res: Response) {
    try {
      const styles = await attributeService.getStyles();

      res.json({
        success: true,
        data: styles,
        message: '获取风格类型成功'
      });
    } catch (error) {
      console.error('获取风格类型失败:', error);
      res.status(500).json({
        success: false,
        message: '获取风格类型失败',
        error: { code: 'FETCH_STYLES_ERROR', details: error instanceof Error ? error.message : String(error) }
      });
    }
  }

  /**
   * 获取所有枚举值
   */
  async getAllEnums(req: Request, res: Response) {
    try {
      const allEnums = await attributeService.getAllEnums();

      res.json({
        success: true,
        data: allEnums,
        message: '获取所有枚举值成功'
      });
    } catch (error) {
      console.error('获取所有枚举值失败:', error);
      res.status(500).json({
        success: false,
        message: '获取所有枚举值失败',
        error: { code: 'FETCH_ALL_ENUMS_ERROR', details: error instanceof Error ? error.message : String(error) }
      });
    }
  }
}

export const clothingController = new ClothingController();