import { Attribute } from '../models/entities/Attribute';
import logger from '../utils/logger';
import { Op } from 'sequelize';

// 季节查询选项接口
export interface SeasonQueryOptions {
  name?: string;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  pageSize?: number;
  offset?: number;
}

// 季节创建数据接口
export interface SeasonCreateData {
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  icon?: string;
  color?: string;
  isActive?: boolean;
}

// 季节更新数据接口
export interface SeasonUpdateData {
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  icon?: string;
  color?: string;
  isActive?: boolean;
}

export class SeasonService {
  /**
   * 创建新季节
   */
  async create(data: SeasonCreateData): Promise<Attribute> {
    try {
      // 检查季节名称是否已存在
      const existingSeason = await Attribute.findOne({
        where: {
          category: 'season',
          name: data.name
        }
      });
      if (existingSeason) {
        throw new Error(`季节名称 "${data.name}" 已存在`);
      }

      // 检查日期范围是否有效
      if (data.startDate >= data.endDate) {
        throw new Error(`开始日期必须早于结束日期`);
      }

      const seasonData: any = {
        name: data.name,
        displayName: data.name,
        category: 'season',
        type: 'SELECT', // 假设类型为SELECT
        description: data.description || '',
        value: {
          startDate: data.startDate,
          endDate: data.endDate
        },
        icon: data.icon || null,
        color: data.color || null,
        enabled: data.isActive !== undefined ? data.isActive : true,
        isSystem: false,
        sortOrder: 0
      };

      const season = await Attribute.create(seasonData);
      logger.info(`创建季节 "${data.name}" 成功`);
      return season;
    } catch (error) {
      logger.error(`创建季节失败:`, error);
      throw new Error(`创建季节失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取所有季节
   */
  async getAll(options: SeasonQueryOptions = {}): Promise<Attribute[]> {
    try {
      const where: any = {
        category: 'season'
      };

      if (options.name) {
        where.name = {
          [Op.like]: `%${options.name}%`
        };
      }

      if (options.isActive !== undefined) {
        where.enabled = options.isActive;
      }

      const order: any[] = options.sortBy ? [[options.sortBy, options.sortOrder || 'ASC']] : [];

      const seasons = await Attribute.findAll({
        where,
        order,
        limit: options.pageSize,
        offset: options.offset
      });

      logger.info(`获取季节列表成功，共 ${seasons.length} 条记录`);
      return seasons;
    } catch (error) {
      logger.error(`获取季节列表失败:`, error);
      throw new Error(`获取季节列表失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 根据ID获取季节
   */
  async getById(id: number): Promise<Attribute | null> {
    try {
      const season = await Attribute.findOne({
        where: {
          id,
          category: 'season'
        }
      });
      if (!season) {
        logger.warn(`未找到ID为 ${id} 的季节`);
        return null;
      }
      logger.info(`获取季节ID ${id} 成功`);
      return season;
    } catch (error) {
      logger.error(`获取季节ID ${id} 失败:`, error);
      throw new Error(`获取季节失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 根据名称获取季节
   */
  async getByName(name: string): Promise<Attribute | null> {
    try {
      const season = await Attribute.findOne({
        where: {
          name,
          category: 'season'
        }
      });
      if (!season) {
        logger.warn(`未找到名称为 "${name}" 的季节`);
        return null;
      }
      logger.info(`获取季节名称 "${name}" 成功`);
      return season;
    } catch (error) {
      logger.error(`获取季节名称 "${name}" 失败:`, error);
      throw new Error(`获取季节失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取当前季节
   */
  async getCurrentSeason(): Promise<Attribute | null> {
    try {
      const now = new Date();
      const season = await this.getByDate(now);
      if (!season) {
        logger.warn(`未找到当前日期 ${now.toISOString()} 对应的季节`);
        return null;
      }
      logger.info(`获取当前季节 ${season.name} 成功`);
      return season;
    } catch (error) {
      logger.error(`获取当前季节失败:`, error);
      throw new Error(`获取当前季节失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 根据日期获取季节
   */
  async getByDate(date: Date): Promise<Attribute | null> {
    try {
      // 获取所有季节
      const seasons = await Attribute.findAll({
        where: {
          category: 'season',
          enabled: true
        }
      });

      // 检查每个季节的日期范围
      for (const season of seasons) {
        try {
          const { startDate, endDate } = season.value || {};
          if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            // 设置为当年的日期进行比较
            start.setFullYear(date.getFullYear());
            end.setFullYear(date.getFullYear());
            
            // 如果日期在范围内，返回该季节
            if (date >= start && date <= end) {
              logger.info(`获取日期 ${date.toISOString()} 对应的季节 ${season.name} 成功`);
              return season;
            }
          }
        } catch (err) {
          logger.warn(`解析季节 ${season.name} 的日期范围失败:`, err);
          continue;
        }
      }

      logger.warn(`未找到日期 ${date.toISOString()} 对应的季节`);
      return null;
    } catch (error) {
      logger.error(`获取指定日期的季节失败:`, error);
      throw new Error(`获取季节失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 更新季节
   */
  async update(id: number, data: SeasonUpdateData): Promise<Attribute | null> {
    try {
      // 先检查季节是否存在
      const existingSeason = await this.getById(id);
      if (!existingSeason) {
        throw new Error(`季节ID ${id} 不存在`);
      }

      // 如果更新名称，检查新名称是否已存在
      if (data.name && data.name !== existingSeason.name) {
        const seasonWithSameName = await Attribute.findOne({
          where: {
            name: data.name,
            category: 'season',
            id: { [Op.ne]: id }
          }
        });
        if (seasonWithSameName) {
          throw new Error(`季节名称 "${data.name}" 已存在`);
        }
      }

      // 如果更新日期范围，检查日期范围是否有效
      if (data.startDate && data.endDate) {
        if (data.startDate >= data.endDate) {
          throw new Error(`开始日期必须早于结束日期`);
        }
      }

      const updateData: any = {};
      
      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.icon !== undefined) updateData.icon = data.icon;
      if (data.color !== undefined) updateData.color = data.color;
      if (data.isActive !== undefined) updateData.enabled = data.isActive;
      
      // 处理日期范围更新
      if (data.startDate !== undefined || data.endDate !== undefined) {
        const currentValue = existingSeason.value || {};
        updateData.value = {
          ...currentValue,
          startDate: data.startDate || currentValue.startDate,
          endDate: data.endDate || currentValue.endDate
        };
      }

      await existingSeason.update(updateData);
      logger.info(`更新季节ID ${id} 成功`);
      
      // 重新获取更新后的季节以确保返回最新数据
      const updatedSeason = await this.getById(id);
      return updatedSeason;
    } catch (error) {
      logger.error(`更新季节ID ${id} 失败:`, error);
      throw new Error(`更新季节失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 删除季节
   */
  async delete(id: number): Promise<boolean> {
    try {
      // 先检查季节是否存在
      const existingSeason = await this.getById(id);
      if (!existingSeason) {
        throw new Error(`季节ID ${id} 不存在`);
      }

      // 实际应用中可能需要先检查是否有依赖此季节的数据
      // 例如：检查是否有衣物或搭配关联到此季节

      await existingSeason.destroy();
      logger.info(`删除季节ID ${id} 成功`);
      return true;
    } catch (error) {
      logger.error(`删除季节ID ${id} 失败:`, error);
      throw new Error(`删除季节失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 切换季节启用状态
   */
  async toggleActive(id: number): Promise<Attribute | null> {
    try {
      const season = await this.getById(id);
      if (!season) {
        throw new Error(`季节ID ${id} 不存在`);
      }

      await season.update({
        enabled: !season.enabled
      });
      
      // 重新获取更新后的季节以确保返回最新数据
      const updatedSeason = await this.getById(id);
      logger.info(`切换季节ID ${id} 的启用状态为 ${!season.enabled} 成功`);
      return updatedSeason;
    } catch (error) {
      logger.error(`切换季节启用状态失败:`, error);
      throw new Error(`切换季节启用状态失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取季节统计信息
   */
  async getStatistics(): Promise<any> {
    try {
      // 获取总季节数
      const total = await Attribute.count({
        where: {
          category: 'season'
        }
      });
      
      // 获取活跃的季节数
      const active = await Attribute.count({
        where: {
          category: 'season',
          enabled: true
        }
      });
      
      const inactive = total - active;
      
      // 获取当前活跃的季节
      const now = new Date();
      const seasons = await Attribute.findAll({
        where: {
          category: 'season',
          enabled: true
        }
      });
      
      // 查找当前日期对应的季节
      const currentActiveSeasons = [];
      for (const season of seasons) {
        try {
          const { startDate, endDate } = season.value || {};
          if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            // 设置为当年的日期进行比较
            start.setFullYear(now.getFullYear());
            end.setFullYear(now.getFullYear());
            
            // 如果日期在范围内，添加到当前活跃季节列表
            if (now >= start && now <= end) {
              currentActiveSeasons.push(season);
            }
          }
        } catch (err) {
          logger.warn(`解析季节 ${season.name} 的日期范围失败:`, err);
          continue;
        }
      }
      
      const stats = {
        total,
        active,
        inactive,
        currentActiveCount: currentActiveSeasons.length,
        currentActiveSeasons: currentActiveSeasons.map(s => ({ id: s.id, name: s.name }))
      };
      
      logger.info(`获取季节统计信息成功`);
      return stats;
    } catch (error) {
      logger.error(`获取季节统计信息失败:`, error);
      throw new Error(`获取季节统计信息失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取按日期排序的季节列表
   */
  async getSeasonsOrderedByDate(includeInactive: boolean = false): Promise<Attribute[]> {
    try {
      const whereClause: any = {
        category: 'season'
      };
      
      if (!includeInactive) {
        whereClause.enabled = true;
      }
      
      // 获取所有季节
      const seasons = await Attribute.findAll({
        where: whereClause
      });
      
      // 根据value中的startDate进行排序
      seasons.sort((a, b) => {
        try {
          const aStartDate = a.value?.startDate ? new Date(a.value.startDate) : new Date(0);
          const bStartDate = b.value?.startDate ? new Date(b.value.startDate) : new Date(0);
          return aStartDate.getTime() - bStartDate.getTime();
        } catch (error) {
          logger.warn(`排序季节时出错:`, error);
          return 0;
        }
      });
      
      logger.info(`获取按日期排序的季节列表成功，包含非活跃季节: ${includeInactive}`);
      return seasons;
    } catch (error) {
      logger.error(`获取按日期排序的季节列表失败:`, error);
      throw new Error(`获取按日期排序的季节列表失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 批量获取季节
   */
  async getByIds(ids: number[]): Promise<Attribute[]> {
    try {
      const seasons = await Attribute.findAll({
        where: {
          id: ids,
          category: 'season'
        }
      });
      logger.info(`批量获取季节成功，共 ${seasons.length} 条记录`);
      return seasons;
    } catch (error) {
      logger.error(`批量获取季节失败:`, error);
      throw new Error(`批量获取季节失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}