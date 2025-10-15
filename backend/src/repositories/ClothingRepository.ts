import { Op, Sequelize } from 'sequelize';
import { Clothing } from '../models/entities/Clothing';
import { User } from '../models/entities/User';
import { Attribute } from '../models/entities/Attribute';

// 修复字段名称以匹配数据库结构
export interface ClothingQueryOptions {
  page?: number;
  limit?: number;
  category?: number; // 从categoryId改为category
  userId?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  status?: number; // 状态现在是数字ID而不是字符串
}

export interface ClothingStats {
  totalItems: number;
  favoriteItems: number;
  categoryStats: Array<{
    categoryId: number;
    count: number;
    category: null; // Category模型已移除
  }>;
  conditionStats: Array<{
    condition: number; // condition现在是数字ID
    count: number;
  }>;
  recentItems: any[];
  totalValue: number;
}

export class ClothingRepository {

  /**
   * 获取衣物列表
   */
  async findClothingItems(options: ClothingQueryOptions = {}) {
    const {
      page = 1,
      limit = 20,
      category, // 修复字段名称
      userId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      status = 1 // 默认为活跃状态的ID
    } = options;

    const offset = (page - 1) * limit;
    
    const whereClause: any = { status };
    
    if (category) {
      whereClause.category = category; // 修复字段名称
    }
    
    if (userId) {
      whereClause.userId = userId;
    }
    
    // 修复搜索条件，description字段在数据库中不存在
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { brand: { [Op.like]: `%${search}%` } }
      ];
    }

    console.log('findClothingItems options:', options);
    console.log('whereClause:', whereClause);

    const { count, rows } = await Clothing.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatarUrl']
        },
        // 添加所有属性关联，以获取属性名称
        {
          model: Attribute,
          as: 'categoryAttribute',
          attributes: ['id', 'name', 'display_name']
        },
        {
          model: Attribute,
          as: 'colorAttribute',
          attributes: ['id', 'name', 'display_name', 'color']
        },
        {
          model: Attribute,
          as: 'styleAttribute',
          attributes: ['id', 'name', 'display_name']
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
  async findClothingItemById(id: number, userId?: number): Promise<Clothing | null> {
    const whereClause: any = { id, status: 1 }; // status现在是数字ID
    
    if (userId) {
      whereClause.userId = userId;
    }

    return await Clothing.findOne({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatarUrl']
        },
        // 添加所有属性关联，以获取属性名称
        {
          model: Attribute,
          as: 'categoryAttribute',
          attributes: ['id', 'name', 'display_name']
        },
        {
          model: Attribute,
          as: 'colorAttribute',
          attributes: ['id', 'name', 'display_name', 'color']
        },
        {
          model: Attribute,
          as: 'styleAttribute',
          attributes: ['id', 'name', 'display_name']
        },
        {
          model: Attribute,
          as: 'seasonAttribute',
          attributes: ['id', 'name', 'display_name']
        },
        {
          model: Attribute,
          as: 'materialAttribute',
          attributes: ['id', 'name', 'display_name']
        },
        {
          model: Attribute,
          as: 'patternAttribute',
          attributes: ['id', 'name', 'display_name']
        },
        {
          model: Attribute,
          as: 'conditionAttribute',
          attributes: ['id', 'name', 'display_name']
        }
      ],
      attributes: { exclude: ['userId'] }
    });
  }

  /**
   * 创建衣物
   */
  async createClothingItem(data: any): Promise<Clothing> {
    // 确保数据格式正确
    const formattedData: any = { ...data };
    
    // 转换数字类型字段
    if (formattedData.category !== undefined) {
      formattedData.category = parseInt(formattedData.category);
    }
    if (formattedData.color !== undefined) {
      formattedData.color = parseInt(formattedData.color);
    }
    if (formattedData.style !== undefined) {
      formattedData.style = parseInt(formattedData.style);
    }
    if (formattedData.season !== undefined) {
      formattedData.season = parseInt(formattedData.season);
    }
    if (formattedData.material !== undefined) {
      formattedData.material = parseInt(formattedData.material);
    }
    if (formattedData.pattern !== undefined) {
      formattedData.pattern = parseInt(formattedData.pattern);
    }
    if (formattedData.condition !== undefined) {
      formattedData.condition = parseInt(formattedData.condition);
    }
    if (formattedData.status !== undefined) {
      formattedData.status = parseInt(formattedData.status);
    }

    return await Clothing.create(formattedData);
  }

  /**
   * 更新衣物
   */
  async updateClothingItem(id: number, userId: number, data: Partial<Clothing>): Promise<[number, Clothing[]]> {
    const updateData: any = { ...data };
    
    // 处理需要转换的字段
    if (updateData.price !== undefined) {
      updateData.price = updateData.price ? parseFloat(updateData.price) : null;
    }
    if (updateData.purchaseDate !== undefined) {
      updateData.purchaseDate = updateData.purchaseDate ? new Date(updateData.purchaseDate) : null;
    }
    // 修复字段名称
    if (updateData.categoryId !== undefined) {
      updateData.category = updateData.categoryId ? parseInt(updateData.categoryId) : null;
      delete updateData.categoryId; // 删除旧字段
    }
    if (updateData.colorId !== undefined) {
      updateData.color = updateData.colorId ? parseInt(updateData.colorId) : null;
      delete updateData.colorId; // 删除旧字段
    }
    if (updateData.styleId !== undefined) {
      updateData.style = updateData.styleId ? parseInt(updateData.styleId) : null;
      delete updateData.styleId; // 删除旧字段
    }
    if (updateData.imageUrls !== undefined) {
      updateData.imageUrls = Array.isArray(updateData.imageUrls) 
        ? updateData.imageUrls.filter((url: string) => url && url.trim()) 
        : updateData.imageUrls;
    }

    return await Clothing.update(updateData, {
      where: { id, userId, status: 1 }, // status现在是数字ID
      returning: true
    });
  }

  /**
   * 删除衣物（软删除）
   */
  async deleteClothingItem(id: number, userId: number): Promise<[number, Clothing[]]> {
    return await Clothing.update(
      { deletedAt: new Date() },
      { 
        where: { id, userId },
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

    const { count, rows } = await Clothing.findAndCountAll({
      where: {
        userId,
        status: 1, // status现在是数字ID
        isFavorite: true // 直接使用isFavorite字段而不是metadata中的favorite
      },
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatarUrl']
        },
        // 添加属性关联
        {
          model: Attribute,
          as: 'categoryAttribute',
          attributes: ['id', 'name', 'display_name']
        },
        {
          model: Attribute,
          as: 'colorAttribute',
          attributes: ['id', 'name', 'display_name', 'color']
        }
      ],
      attributes: [
        'id', 'name', 'brand', 'price', 'purchaseDate', 'size', 'condition',
        'notes', 'imageUrls', 'mainImageUrl', 'category', 'color', 'style',
        'season', 'material', 'pattern', 'status', 'createdAt', 'updatedAt', 'isFavorite'
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
      Clothing.count({
        where: { userId, status: 1 } // status现在是数字ID
      }),
      Clothing.count({
        where: {
          userId,
          status: 1, // status现在是数字ID
          isFavorite: true // 直接使用isFavorite字段
        }
      }),
      Clothing.findAll({
        where: { userId, status: 1 }, // status现在是数字ID
        attributes: [
          'category', // 修复字段名称
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        group: ['category'], // 修复字段名称
        order: [[Sequelize.literal('count'), 'DESC']],
        include: [
          {
            model: Attribute,
            as: 'categoryAttribute',
            attributes: ['id', 'name', 'display_name']
          }
        ]
      }),
      Clothing.findAll({
        where: { userId, status: 1 }, // status现在是数字ID
        attributes: [
          'condition',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        group: ['condition'],
        order: [[Sequelize.literal('count'), 'DESC']],
        include: [
          {
            model: Attribute,
            as: 'conditionAttribute',
            attributes: ['id', 'name', 'display_name']
          }
        ]
      }),
      Clothing.findAll({
        where: { userId, status: 1 }, // status现在是数字ID
        limit: 5,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'name', 'imageUrls', 'mainImageUrl', 'createdAt', 'updatedAt']
      }),
      Clothing.sum('price', {
        where: { userId, status: 1 } // status现在是数字ID
      })
    ]);

    return {
      totalItems,
      favoriteItems,
      categoryStats: categoryStats.map((stat: any) => ({
        categoryId: stat.category, // 修复字段名称
        count: parseInt(stat.get('count') as string),
        category: stat.categoryAttribute || null
      })),
      conditionStats: conditionStats.map((stat: any) => ({
        condition: stat.condition,
        count: parseInt(stat.get('count') as string),
        conditionAttribute: stat.conditionAttribute || null
      })),
      recentItems,
      totalValue: totalValue || 0
    };
  }
}

export const clothingRepository = new ClothingRepository();