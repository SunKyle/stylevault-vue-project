import { User } from '../models/entities/User';
import { UserStatus } from '../models/entities/User';
import { userRepository } from '../repositories';
import logger from '../utils/logger';

// 用户查询选项接口
export interface UserQueryOptions {
  username?: string;
  email?: string;
  status?: UserStatus;
  registeredAfter?: Date;
  registeredBefore?: Date;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  pageSize?: number;
}

// 用户创建数据接口
export interface UserCreateData {
  username: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string;
  fullName?: string;
  gender?: string;
  birthDate?: Date;
  location?: string;
  bio?: string;
  status?: UserStatus;
}

// 用户更新数据接口
export interface UserUpdateData {
  username?: string;
  email?: string;
  passwordHash?: string;
  avatarUrl?: string;
  fullName?: string;
  gender?: string;
  birthDate?: Date;
  location?: string;
  bio?: string;
  status?: UserStatus;
  lastLoginAt?: Date;
}

export class UserService {
  /**
   * 创建新用户
   */
  async create(data: UserCreateData): Promise<User> {
    try {
      const userData: any = {
        username: data.username.trim(),
        email: data.email.trim(),
        passwordHash: data.passwordHash,
        status: data.status || UserStatus.ACTIVE,
        avatarUrl: data.avatarUrl?.trim(),
        fullName: data.fullName?.trim(),
        gender: data.gender,
        birthDate: data.birthDate,
        location: data.location?.trim(),
        bio: data.bio?.trim()
      };

      const user = await userRepository.create(userData);
      logger.info(`创建新用户: ${user.username} (ID: ${user.id})`);
      return user;
    } catch (error) {
      logger.error('创建用户失败:', error);
      throw new Error(`创建用户失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取用户列表
   */
  async getAll(options: UserQueryOptions = {}): Promise<User[]> {
    try {
      const users = await userRepository.findAll(options);
      logger.info(`获取用户列表成功，共 ${users.length} 条记录`);
      return users;
    } catch (error) {
      logger.error('获取用户列表失败:', error);
      throw new Error(`获取用户列表失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 注意：UserRepository中没有getCount方法，所以不提供此功能

  /**
   * 根据ID获取用户
   */
  async getById(id: number): Promise<User | null> {
    try {
      const user = await userRepository.findById(id);
      if (!user) {
        logger.warn(`未找到ID为 ${id} 的用户`);
        return null;
      }
      logger.info(`获取用户ID ${id} 成功`);
      return user;
    } catch (error) {
      logger.error(`获取用户ID ${id} 失败:`, error);
      throw new Error(`获取用户失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 根据用户名获取用户
   */
  async findByUsername(username: string): Promise<User | null> {
    try {
      const user = await userRepository.findByUsername(username);
      logger.info(`根据用户名 ${username} 查询用户成功`);
      return user;
    } catch (error) {
      logger.error(`根据用户名 ${username} 查询用户失败:`, error);
      throw new Error(`查询用户失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 根据邮箱获取用户
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await userRepository.findByEmail(email);
      logger.info(`根据邮箱 ${email} 查询用户成功`);
      return user;
    } catch (error) {
      logger.error(`根据邮箱 ${email} 查询用户失败:`, error);
      throw new Error(`查询用户失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 更新用户
   */
  async update(id: number, data: UserUpdateData): Promise<User | null> {
    try {
      // 先检查用户是否存在
      const existingUser = await this.getById(id);
      if (!existingUser) {
        throw new Error(`用户ID ${id} 不存在`);
      }

      const updateData: any = {};
      
      if (data.username !== undefined) updateData.username = data.username.trim();
      if (data.email !== undefined) updateData.email = data.email.trim();
      if (data.passwordHash !== undefined) updateData.passwordHash = data.passwordHash;
      if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl.trim();
      if (data.fullName !== undefined) updateData.fullName = data.fullName.trim();
      if (data.gender !== undefined) updateData.gender = data.gender;
      if (data.birthDate !== undefined) updateData.birthDate = data.birthDate;
      if (data.location !== undefined) updateData.location = data.location.trim();
      if (data.bio !== undefined) updateData.bio = data.bio.trim();
      if (data.status !== undefined) updateData.status = data.status;
      if (data.lastLoginAt !== undefined) updateData.lastLoginAt = data.lastLoginAt;

      const updatedUser = await userRepository.update(id, updateData);
      logger.info(`更新用户ID ${id} 成功`);
      return updatedUser;
    } catch (error) {
      logger.error(`更新用户ID ${id} 失败:`, error);
      throw new Error(`更新用户失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 删除用户
   */
  async delete(id: number): Promise<boolean> {
    try {
      // 先检查用户是否存在
      const existingUser = await this.getById(id);
      if (!existingUser) {
        throw new Error(`用户ID ${id} 不存在`);
      }

      const result = await userRepository.delete(id);
      logger.info(`删除用户ID ${id} 成功`);
      return result;
    } catch (error) {
      logger.error(`删除用户ID ${id} 失败:`, error);
      throw new Error(`删除用户失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 更改用户状态
   */
  async changeStatus(id: number, status: UserStatus): Promise<User | null> {
    try {
      const updatedUser = await this.update(id, { status });
      logger.info(`更改用户ID ${id} 状态为 ${status} 成功`);
      return updatedUser;
    } catch (error) {
      logger.error(`更改用户ID ${id} 状态失败:`, error);
      throw new Error(`更改用户状态失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取用户数量统计
   */
  async getCount(status?: UserStatus): Promise<number> {
    try {
      // 使用UserRepository中已有的getUserStats方法获取统计数据
      const stats = await userRepository.getUserStats();
      logger.info(`获取用户数量统计成功`);
      
      // 根据状态返回对应数量
      if (status === UserStatus.ACTIVE) {
        return stats.active;
      } else if (status === UserStatus.INACTIVE) {
        return stats.inactive;
      } else {
        // 返回总用户数
        return stats.total;
      }
    } catch (error) {
      logger.error(`获取用户数量统计失败:`, error);
      throw new Error(`获取用户统计失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}