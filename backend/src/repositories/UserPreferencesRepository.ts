import { UserPreferences } from '../models/entities/UserPreferences';
import { User } from '../models/entities/User';

/**
 * 用户偏好查询选项
 */
export interface UserPreferencesQueryOptions {
  /** 用户ID列表 */
  userIds?: number[];
  /** 风格类型 */
  styleTypes?: string[];
  /** 季节偏好 */
  seasons?: string[];
  /** 场合偏好 */
  occasions?: string[];
  /** 排序字段 */
  sortBy?: string;
  /** 排序方向 */
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * 用户偏好仓库类，封装用户偏好数据的访问逻辑
 */
export class UserPreferencesRepository {
  /**
   * 查找所有用户偏好
   * @param options 查询选项
   * @returns 用户偏好列表
   */
async findAll(options: UserPreferencesQueryOptions = {}): Promise<UserPreferences[]> {
    const { 
      userIds, 
      styleTypes, 
      seasons, 
      occasions, 
      sortBy = 'updatedAt', 
      sortOrder = 'DESC' 
    } = options;
    
    const where: any = {};
    
    if (userIds && userIds.length > 0) {
      where.userId = {
        '$in': userIds
      };
    }
    
    if (styleTypes && styleTypes.length > 0) {
      // 这里需要根据styleProfile的结构进行查询，可能需要使用JSON操作符
      where.styleProfile = where.styleProfile || {};
      where.styleProfile['$overlap'] = styleTypes;
    }
    
    if (seasons && seasons.length > 0) {
      where.seasonPreferences = where.seasonPreferences || {};
      where.seasonPreferences['$overlap'] = seasons;
    }
    
    if (occasions && occasions.length > 0) {
      where.occasionPreferences = where.occasionPreferences || {};
      where.occasionPreferences['$overlap'] = occasions;
    }
    
    return UserPreferences.findAll({
      where,
      order: [[sortBy, sortOrder]],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ]
    });
  }

  /**
   * 根据ID查找用户偏好
   * @param id 用户偏好ID
   * @returns 用户偏好对象或null
   */
async findById(id: number): Promise<UserPreferences | null> {
    return UserPreferences.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ]
    });
  }

  /**
   * 根据用户ID查找偏好
   * @param userId 用户ID
   * @returns 用户偏好对象或null
   */
async findByUserId(userId: number): Promise<UserPreferences | null> {
    return UserPreferences.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ]
    });
  }

  /**
   * 创建或更新用户偏好
   * @param userId 用户ID
   * @param data 偏好数据
   * @returns 用户偏好对象
   */
async createOrUpdate(userId: number, data: Partial<UserPreferences>): Promise<UserPreferences> {
    const existing = await this.findByUserId(userId);
    
    if (existing) {
      return existing.update(data as any);
    } else {
      return UserPreferences.create({
        userId,
        ...data
      } as any);
    }
  }

  /**
   * 创建新的用户偏好
   * @param data 用户偏好数据
   * @returns 创建的用户偏好对象
   */
async create(data: Partial<UserPreferences>): Promise<UserPreferences> {
    return UserPreferences.create(data as any);
  }

  /**
   * 更新用户偏好
   * @param id 用户偏好ID
   * @param data 更新数据
   * @returns 更新后的用户偏好对象或null
   */
async update(id: number, data: Partial<UserPreferences>): Promise<UserPreferences | null> {
    const preferences = await this.findById(id);
    if (!preferences) {
      return null;
    }
    
    return preferences.update(data as any);
  }

  /**
   * 删除用户偏好
   * @param id 用户偏好ID
   * @returns 是否删除成功
   */
async delete(id: number): Promise<boolean> {
    const result = await UserPreferences.destroy({ where: { id } });
    return result > 0;
  }

  /**
   * 根据用户ID删除偏好
   * @param userId 用户ID
   * @returns 是否删除成功
   */
async deleteByUserId(userId: number): Promise<boolean> {
    const result = await UserPreferences.destroy({ where: { userId } });
    return result > 0;
  }

  /**
   * 更新用户风格画像
   * @param userId 用户ID
   * @param styleProfile 风格画像数据
   * @returns 更新后的用户偏好对象或null
   */
async updateStyleProfile(
    userId: number,
    styleProfile: Record<string, number>
  ): Promise<UserPreferences | null> {
    const preferences = await this.findByUserId(userId);
    if (!preferences) {
      return this.create({
        userId,
        styleProfile
      });
    }
    
    preferences.styleProfile = styleProfile;
    await preferences.save();
    
    return preferences;
  }

  /**
   * 更新用户季节偏好
   * @param userId 用户ID
   * @param seasons 季节列表
   * @returns 更新后的用户偏好对象或null
   */
async updateSeasonPreferences(
    userId: number,
    seasons: string[]
  ): Promise<UserPreferences | null> {
    const preferences = await this.findByUserId(userId);
    if (!preferences) {
      return this.create({
        userId,
        seasonPreferences: seasons
      });
    }
    
    preferences.seasonPreferences = seasons;
    await preferences.save();
    
    return preferences;
  }

  /**
   * 更新用户场合偏好
   * @param userId 用户ID
   * @param occasions 场合列表
   * @returns 更新后的用户偏好对象或null
   */
async updateOccasionPreferences(
    userId: number,
    occasions: string[]
  ): Promise<UserPreferences | null> {
    const preferences = await this.findByUserId(userId);
    if (!preferences) {
      return this.create({
        userId,
        occasionPreferences: occasions
      });
    }
    
    preferences.occasionPreferences = occasions;
    await preferences.save();
    
    return preferences;
  }

  /**
   * 获取用户偏好的完整信息
   * @param userId 用户ID
   * @returns 用户偏好的完整信息
   */
async getFullInfo(userId: number): Promise<any> {
    const preferences = await this.findByUserId(userId);
    if (!preferences) {
      return null;
    }
    
    return preferences;
  }

  /**
   * 批量获取用户偏好
   * @param userIds 用户ID列表
   * @returns 用户偏好列表
   */
async findByUserIds(userIds: number[]): Promise<UserPreferences[]> {
    return UserPreferences.findAll({
      where: {
        userId: {
          '$in': userIds
        }
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ]
    });
  }

  /**
   * 获取用户偏好统计
   * @param styleType 风格类型（可选）
   * @returns 用户偏好统计信息
   */
async getPreferencesStats(styleType?: string): Promise<{
    totalUsers: number;
    averageStyleScore: number;
    popularSeasons: Record<string, number>;
    popularOccasions: Record<string, number>;
  }> {
    const allPreferences = await this.findAll(styleType ? { styleTypes: [styleType] } : {});
    
    const totalUsers = allPreferences.length;
    
    // 计算平均风格分数
    let totalStyleScore = 0;
    let styleScoreCount = 0;
    
    // 统计季节和场合偏好
    const seasonStats: Record<string, number> = {};
    const occasionStats: Record<string, number> = {};
    
    allPreferences.forEach(pref => {
      // 计算风格分数
      if (pref.styleProfile) {
        Object.values(pref.styleProfile).forEach(score => {
          totalStyleScore += score;
          styleScoreCount++;
        });
      }
      
      // 统计季节偏好
      if (pref.seasonPreferences) {
        pref.seasonPreferences.forEach(season => {
          seasonStats[season] = (seasonStats[season] || 0) + 1;
        });
      }
      
      // 统计场合偏好
      if (pref.occasionPreferences) {
        pref.occasionPreferences.forEach(occasion => {
          occasionStats[occasion] = (occasionStats[occasion] || 0) + 1;
        });
      }
    });
    
    const averageStyleScore = styleScoreCount > 0 ? totalStyleScore / styleScoreCount : 0;
    
    return {
      totalUsers,
      averageStyleScore,
      popularSeasons: seasonStats,
      popularOccasions: occasionStats
    };
  }
}