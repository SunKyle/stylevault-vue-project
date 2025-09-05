import { ClothingItem } from '../models/entities/ClothingItem';
import { Category } from '../models/entities/Category';
import { User } from '../models/entities/User';
import { Op, Sequelize } from 'sequelize';

export interface ClothingQueryOptions {
  page?: number;
  limit?: number;
  categoryId?: number;
  userId?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  status?: string;
}

export interface ClothingStats {
  totalItems: number;
  favoriteItems: number;
  categoryStats: Array<{
    categoryId: number;
    count: number;
    category?: {
      id: number;
      name: string;
      color: string;
    };
  }>;
  conditionStats: Array<{
    condition: string;
    count: number;
  }>;
  recentItems: ClothingItem[];
  totalValue: number;
}

export class ClothingRepository {
  /**
   * 获取所有分类
   */
  async findAllCategories(): Promise<Category[]> {
    return await Category.findAll({
      where: { enabled: true },
      order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']],
      attributes: ['id', 'name', 'slug', 'description', 'icon', 'color', 'sortOrder', 'itemCount']
    });
  }

  /**
   * 根据ID获取分类
   */
  async findCategoryById(id: number): Promise<Category | null> {
    return await Category.findOne({
      where: { 
        id,
        enabled: true
      },
      attributes: ['id', 'name', 'slug', 'description', 'icon', 'color', 'sortOrder', 'itemCount']
    });
  }

  /**
   * 获取衣物列表
   */
  async findClothingItems(options: ClothingQueryOptions = {}) {
    const {
      page = 1,
      limit = 20,
      categoryId,
      userId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      status = 'active'
    } = options;

    const offset = (page - 1) * limit;
    
    const whereClause: any = { status };
    
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }
    
    if (userId) {
      whereClause.userId = userId;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { brand: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await ClothingItem.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'color']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatarUrl']
        }
      ],
      attributes: { exclude: ['userId'] }
    });

    return {
      items: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit,
        hasNext: offset + rows.length < count,
        hasPrev: page > 1
      }
    };
  }

  /**
   * 根据ID获取衣物
   */
  async findClothingItemById(id: number, userId?: number): Promise<ClothingItem | null> {
    const whereClause: any = { id, status: 'active' };
    
    if (userId) {
      whereClause.userId = userId;
    }

    return await ClothingItem.findOne({
      where: whereClause,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'color']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatarUrl']
        }
      ],
      attributes: { exclude: ['userId'] }
    });
  }

  /**
   * 创建衣物
   */
  async createClothingItem(data: any): Promise<ClothingItem> {
    return await ClothingItem.create(data as any);
  }

  /**
   * 更新衣物
   */
  async updateClothingItem(id: number, userId: number, data: any): Promise<[number, ClothingItem[]]> {
    const updateData: any = { ...data };
    
    // 处理需要转换的字段
    if (updateData.price !== undefined) {
      updateData.price = updateData.price ? parseFloat(updateData.price) : null;
    }
    if (updateData.purchaseDate !== undefined) {
      updateData.purchaseDate = updateData.purchaseDate ? new Date(updateData.purchaseDate) : null;
    }
    if (updateData.categoryId !== undefined) {
      updateData.categoryId = updateData.categoryId ? parseInt(updateData.categoryId) : null;
    }
    if (updateData.colorId !== undefined) {
      updateData.colorId = updateData.colorId ? parseInt(updateData.colorId) : null;
    }
    if (updateData.styleId !== undefined) {
      updateData.styleId = updateData.styleId ? parseInt(updateData.styleId) : null;
    }
    if (updateData.imageUrls !== undefined) {
      updateData.imageUrls = Array.isArray(updateData.imageUrls) 
        ? updateData.imageUrls.filter((url: string) => url && url.trim()) 
        : updateData.imageUrls;
    }

    return await ClothingItem.update(updateData, {
      where: { id, userId, status: 'active' },
      returning: true
    });
  }

  /**
   * 删除衣物（软删除）
   */
  async deleteClothingItem(id: number, userId: number): Promise<[number, ClothingItem[]]> {
    return await ClothingItem.update(
      { status: 'deleted' },
      { 
        where: { id, userId, status: 'active' },
        returning: true
      }
    );
  }

  /**
   * 获取收藏衣物
   */
  async findFavoriteItems(userId: number, options: ClothingQueryOptions = {}) {
    const { page = 1, limit = 50, sortBy = 'createdAt', sortOrder = 'DESC' } = options;
    const offset = (page - 1) * limit;

    const { count, rows } = await ClothingItem.findAndCountAll({
      where: { 
        userId,
        status: 'active',
        [Op.and]: Sequelize.where(
          Sequelize.fn('JSON_EXTRACT', Sequelize.col('metadata'), '$.favorite'),
          true
        )
      },
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'color']
        }
      ],
      attributes: [
        'id', 'name', 'brand', 'price', 'purchaseDate', 'size', 'condition',
        'notes', 'imageUrls', 'mainImageUrl', 'categoryId', 'colorId', 'styleId',
        'metadata', 'createdAt', 'updatedAt', 'isFavorite'
      ]
    });

    return {
      items: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit,
        hasNext: offset + rows.length < count,
        hasPrev: page > 1
      }
    };
  }

  /**
   * 获取用户衣物统计
   */
  async getClothingStats(userId: number): Promise<ClothingStats> {
    const [
      totalItems,
      favoriteItems,
      categoryStats,
      conditionStats,
      recentItems,
      totalValue
    ] = await Promise.all([
      ClothingItem.count({
        where: { userId, status: 'active' }
      }),
      ClothingItem.count({
        where: { 
          userId, 
          status: 'active',
          [Op.and]: Sequelize.where(
            Sequelize.fn('JSON_EXTRACT', Sequelize.col('metadata'), '$.favorite'),
            true
          )
        }
      }),
      ClothingItem.findAll({
        where: { userId, status: 'active' },
        attributes: [
          'categoryId',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        group: ['categoryId'],
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'color']
          }
        ],
        order: [[Sequelize.literal('count'), 'DESC']]
      }),
      ClothingItem.findAll({
        where: { userId, status: 'active' },
        attributes: [
          'condition',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        group: ['condition'],
        order: [[Sequelize.literal('count'), 'DESC']]
      }),
      ClothingItem.findAll({
        where: { userId, status: 'active' },
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'color']
          }
        ],
        attributes: ['id', 'name', 'imageUrls', 'mainImageUrl', 'createdAt', 'updatedAt']
      }),
      ClothingItem.sum('price', {
        where: { userId, status: 'active' }
      })
    ]);

    return {
      totalItems,
      favoriteItems,
      categoryStats: categoryStats.map((stat: any) => ({
        categoryId: stat.categoryId,
        count: parseInt(stat.get('count') as string),
        category: stat.category
      })),
      conditionStats: conditionStats.map((stat: any) => ({
        condition: stat.condition,
        count: parseInt(stat.get('count') as string)
      })),
      recentItems,
      totalValue: totalValue || 0
    };
  }
}

export const clothingRepository = new ClothingRepository();