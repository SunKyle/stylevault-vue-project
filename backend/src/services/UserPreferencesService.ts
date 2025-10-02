import { UserPreferences } from '../models/entities/UserPreferences';
import { userPreferencesRepository } from '../repositories';
import { UserService } from './UserService';
import logger from '../utils/logger';

// 用户偏好查询选项接口
export interface UserPreferencesQueryOptions {
  userId?: number;
  styleTypes?: string[];
  seasons?: string[];
  occasions?: string[];
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// 用户偏好创建数据接口
export interface UserPreferencesCreateData {
  userId: number;
  colorPreferences?: number[];
  preferredStyles?: string[];
  preferredOccasions?: string[];
  preferredBrands?: string[];
  clothingSize?: string;
  shoeSize?: string;
  height?: number;
  weight?: number;
  styleProfile?: any;
  metadata?: any;
}

// 用户偏好更新数据接口
export interface UserPreferencesUpdateData {
  colorPreferences?: number[];
  preferredStyles?: string[];
  preferredOccasions?: string[];
  preferredBrands?: string[];
  clothingSize?: string;
  shoeSize?: string;
  height?: number;
  weight?: number;
  styleProfile?: any;
  metadata?: any;
}

export class UserPreferencesService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * 创建用户偏好设置
   */
  async create(data: UserPreferencesCreateData): Promise<UserPreferences> {
    try {
      // 验证用户是否存在
      const user = await this.userService.getById(data.userId);
      if (!user) {
        throw new Error(`用户ID ${data.userId} 不存在`);
      }

      const preferencesData: any = {
        userId: data.userId,
        colorPreferences: data.colorPreferences || [],
        preferredStyles: data.preferredStyles || [],
        preferredOccasions: data.preferredOccasions || [],
        preferredBrands: data.preferredBrands || [],
        clothingSize: data.clothingSize,
        shoeSize: data.shoeSize,
        height: data.height,
        weight: data.weight,
        styleProfile: data.styleProfile || {},
        metadata: data.metadata || {}
      };

      const preferences = await userPreferencesRepository.create(preferencesData);
      logger.info(`为用户ID ${data.userId} 创建偏好设置成功`);
      return preferences;
    } catch (error) {
      logger.error(`创建用户偏好设置失败:`, error);
      throw new Error(`创建用户偏好设置失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取用户偏好设置列表
   */
  async getAll(options: UserPreferencesQueryOptions = {}): Promise<UserPreferences[]> {
    try {
      const preferences = await userPreferencesRepository.findAll(options);
      logger.info(`获取用户偏好设置列表成功，共 ${preferences.length} 条记录`);
      return preferences;
    } catch (error) {
      logger.error(`获取用户偏好设置列表失败:`, error);
      throw new Error(`获取用户偏好设置列表失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 根据ID获取用户偏好设置
   */
  async getById(id: number): Promise<UserPreferences | null> {
    try {
      const preferences = await userPreferencesRepository.findById(id);
      if (!preferences) {
        logger.warn(`未找到ID为 ${id} 的用户偏好设置`);
        return null;
      }
      logger.info(`获取用户偏好设置ID ${id} 成功`);
      return preferences;
    } catch (error) {
      logger.error(`获取用户偏好设置ID ${id} 失败:`, error);
      throw new Error(`获取用户偏好设置失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 根据用户ID获取用户偏好设置
   */
  async getByUserId(userId: number): Promise<UserPreferences | null> {
    try {
      // 验证用户是否存在
      const user = await this.userService.getById(userId);
      if (!user) {
        throw new Error(`用户ID ${userId} 不存在`);
      }

      const preferences = await userPreferencesRepository.findByUserId(userId);
      logger.info(`获取用户ID ${userId} 的偏好设置成功`);
      return preferences;
    } catch (error) {
      logger.error(`获取用户ID ${userId} 的偏好设置失败:`, error);
      throw new Error(`获取用户偏好设置失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 更新用户偏好设置
   */
  async update(id: number, data: UserPreferencesUpdateData): Promise<UserPreferences | null> {
    try {
      // 先检查用户偏好设置是否存在
      const existingPreferences = await this.getById(id);
      if (!existingPreferences) {
        throw new Error(`用户偏好设置ID ${id} 不存在`);
      }

      const updateData: any = {};
      
      if (data.colorPreferences !== undefined) updateData.colorPreferences = data.colorPreferences;
      if (data.preferredStyles !== undefined) updateData.preferredStyles = data.preferredStyles;
      if (data.preferredOccasions !== undefined) updateData.preferredOccasions = data.preferredOccasions;
      if (data.preferredBrands !== undefined) updateData.preferredBrands = data.preferredBrands;
      if (data.clothingSize !== undefined) updateData.clothingSize = data.clothingSize;
      if (data.shoeSize !== undefined) updateData.shoeSize = data.shoeSize;
      if (data.height !== undefined) updateData.height = data.height;
      if (data.weight !== undefined) updateData.weight = data.weight;
      if (data.styleProfile !== undefined) updateData.styleProfile = data.styleProfile;
      if (data.metadata !== undefined) updateData.metadata = data.metadata;

      const updatedPreferences = await userPreferencesRepository.update(id, updateData);
      logger.info(`更新用户偏好设置ID ${id} 成功`);
      return updatedPreferences;
    } catch (error) {
      logger.error(`更新用户偏好设置ID ${id} 失败:`, error);
      throw new Error(`更新用户偏好设置失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 根据用户ID更新用户偏好设置
   */
  async updateByUserId(userId: number, data: UserPreferencesUpdateData): Promise<UserPreferences | null> {
    try {
      // 验证用户是否存在
      const user = await this.userService.getById(userId);
      if (!user) {
        throw new Error(`用户ID ${userId} 不存在`);
      }

      // 使用仓库的createOrUpdate方法更新用户偏好
      const preferences = await userPreferencesRepository.createOrUpdate(userId, data);
      logger.info(`更新用户ID ${userId} 的偏好设置成功`);
      return preferences;
    } catch (error) {
      logger.error(`更新用户ID ${userId} 的偏好设置失败:`, error);
      throw new Error(`更新用户偏好设置失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 注意：UserPreferencesRepository中没有addPreferredColor和removePreferredColor方法
  // 这些功能可以通过updateByUserId方法实现

  /**
   * 删除用户偏好设置
   */
  async delete(id: number): Promise<boolean> {
    try {
      // 先检查用户偏好设置是否存在
      const existingPreferences = await this.getById(id);
      if (!existingPreferences) {
        throw new Error(`用户偏好设置ID ${id} 不存在`);
      }

      const result = await userPreferencesRepository.delete(id);
      logger.info(`删除用户偏好设置ID ${id} 成功`);
      return result;
    } catch (error) {
      logger.error(`删除用户偏好设置ID ${id} 失败:`, error);
      throw new Error(`删除用户偏好设置失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 添加偏好颜色
   */
  /**
   * 添加偏好颜色
   * 注意：color参数应该是颜色ID（数字），但为了兼容现有代码，我们接受字符串并尝试转换
   */
  async addPreferredColor(userId: number, color: string): Promise<UserPreferences | null> {
    try {
      const preferences = await this.getByUserId(userId);
      if (!preferences) {
        throw new Error(`用户ID ${userId} 的偏好设置不存在`);
      }

      // 尝试将字符串转换为数字
      const colorId = parseInt(color, 10);
      if (isNaN(colorId)) {
        throw new Error(`无效的颜色ID: ${color}`);
      }

      // 使用模型中正确的属性名colorPreferences
      const colors = preferences.colorPreferences || [];
      if (!colors.includes(colorId)) {
        colors.push(colorId);
        return await this.updateByUserId(userId, { colorPreferences: colors });
      }

      return preferences;
    } catch (error) {
      logger.error(`添加偏好颜色失败:`, error);
      throw new Error(`添加偏好颜色失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 移除偏好颜色
   * 注意：color参数应该是颜色ID（数字），但为了兼容现有代码，我们接受字符串并尝试转换
   */
  async removePreferredColor(userId: number, color: string): Promise<UserPreferences | null> {
    try {
      const preferences = await this.getByUserId(userId);
      if (!preferences) {
        throw new Error(`用户ID ${userId} 的偏好设置不存在`);
      }

      // 尝试将字符串转换为数字
      const colorId = parseInt(color, 10);
      if (isNaN(colorId)) {
        throw new Error(`无效的颜色ID: ${color}`);
      }

      // 过滤掉要移除的颜色
      const colors = preferences.colorPreferences || [];
      const filteredColors = colors.filter((c: number) => c !== colorId);
      
      if (filteredColors.length !== colors.length) {
        return await this.updateByUserId(userId, { colorPreferences: filteredColors });
      }

      return preferences;
    } catch (error) {
      logger.error(`移除偏好颜色失败:`, error);
      throw new Error(`移除偏好颜色失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}