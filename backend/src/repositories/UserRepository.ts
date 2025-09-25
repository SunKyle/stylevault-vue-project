import { User } from '../models/entities/User';
import { UserStatus } from '../models/entities/User';

/**
 * 用户查询选项
 */
export interface UserQueryOptions {
  /** 用户名 */
  username?: string;
  /** 邮箱 */
  email?: string;
  /** 用户状态 */
  status?: UserStatus;
  /** 注册日期范围 - 开始 */
  registeredAfter?: Date;
  /** 注册日期范围 - 结束 */
  registeredBefore?: Date;
  /** 排序字段 */
  sortBy?: string;
  /** 排序方向 */
  sortOrder?: 'ASC' | 'DESC';
  /** 分页页码 */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
}

/**
 * 用户仓库类，封装用户数据的访问逻辑
 */
export class UserRepository {
  /**
   * 查找所有用户
   * @param options 查询选项
   * @returns 用户列表
   */
  async findAll(options: UserQueryOptions = {}): Promise<User[]> {
    const { 
      username, 
      email, 
      status, 
      registeredAfter, 
      registeredBefore, 
      sortBy = 'createdAt', 
      sortOrder = 'DESC', 
      page, 
      pageSize 
    } = options;
    
    const where: any = {};
    
    if (username) {
      where.username = {
        '$like': `%${username}%`
      };
    }
    
    if (email) {
      where.email = {
        '$like': `%${email}%`
      };
    }
    
    if (status) {
      where.status = status;
    }
    
    if (registeredAfter) {
      where.createdAt = where.createdAt || {};
      where.createdAt['$gte'] = registeredAfter;
    }
    
    if (registeredBefore) {
      where.createdAt = where.createdAt || {};
      where.createdAt['$lte'] = registeredBefore;
    }
    
    const findOptions: any = {
      where,
      order: [[sortBy, sortOrder]]
    };
    
    if (page !== undefined && pageSize !== undefined) {
      findOptions.offset = (page - 1) * pageSize;
      findOptions.limit = pageSize;
    }
    
    return User.findAll(findOptions);
  }

  /**
   * 根据ID查找用户
   * @param id 用户ID
   * @returns 用户对象或null
   */
  async findById(id: number): Promise<User | null> {
    return User.findByPk(id);
  }

  /**
   * 创建新用户
   * @param data 用户数据
   * @returns 创建的用户对象
   */
  async create(data: Omit<Partial<User>, 'id'>): Promise<User> {
    return User.create(data as any);
  }

  /**
   * 更新用户
   * @param id 用户ID
   * @param data 更新数据
   * @returns 更新后的用户对象或null
   */
  async update(id: number, data: Partial<User>): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) {
      return null;
    }
    
    return user.update(data);
  }

  /**
   * 删除用户
   * @param id 用户ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    const result = await User.destroy({ where: { id } });
    return result > 0;
  }

  /**
   * 根据用户名查找用户
   * @param username 用户名
   * @returns 用户对象或null
   */
  async findByUsername(username: string): Promise<User | null> {
    return User.findOne({
      where: { username }
    });
  }

  /**
   * 根据邮箱查找用户
   * @param email 邮箱
   * @returns 用户对象或null
   */
  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({
      where: { email }
    });
  }

  /**
   * 更新用户密码
   * @param userId 用户ID
   * @param passwordHash 密码哈希
   * @returns 更新后的用户对象或null
   */
  async updatePassword(userId: number, passwordHash: string): Promise<User | null> {
    const user = await this.findById(userId);
    if (!user) {
      return null;
    }
    
    user.passwordHash = passwordHash;
    await user.save();
    
    return user;
  }

  /**
   * 激活用户
   * @param userId 用户ID
   * @returns 激活后的用户对象或null
   */
  async activateUser(userId: number): Promise<User | null> {
    const user = await this.findById(userId);
    if (!user) {
      return null;
    }
    
    user.status = UserStatus.ACTIVE;
    // User模型中没有activatedAt字段，使用lastLoginAt替代
    user.lastLoginAt = new Date();
    await user.save();
    
    return user;
  }

  /**
   * 禁用用户
   * @param userId 用户ID
   * @returns 禁用后的用户对象或null
   */
  async deactivateUser(userId: number): Promise<User | null> {
    const user = await this.findById(userId);
    if (!user) {
      return null;
    }
    
    user.status = UserStatus.INACTIVE;
    await user.save();
    
    return user;
  }

  /**
   * 检查用户名是否已存在
   * @param username 用户名
   * @param excludeUserId 排除的用户ID（用于更新操作）
   * @returns 是否已存在
   */
  async isUsernameExists(username: string, excludeUserId?: number): Promise<boolean> {
    const where: any = { username };
    
    if (excludeUserId) {
      where.id = {
        '$ne': excludeUserId
      };
    }
    
    const count = await User.count({ where });
    return count > 0;
  }

  /**
   * 检查邮箱是否已存在
   * @param email 邮箱
   * @param excludeUserId 排除的用户ID（用于更新操作）
   * @returns 是否已存在
   */
  async isEmailExists(email: string, excludeUserId?: number): Promise<boolean> {
    const where: any = { email };
    
    if (excludeUserId) {
      where.id = {
        '$ne': excludeUserId
      };
    }
    
    const count = await User.count({ where });
    return count > 0;
  }

  /**
   * 获取用户统计信息
   * @returns 用户统计信息
   */
  async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    pending?: number;
    newThisMonth: number;
  }> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const [total, active, inactive, newThisMonth] = await Promise.all([
      User.count(),
      User.count({ where: { status: UserStatus.ACTIVE } }),
      User.count({ where: { status: UserStatus.INACTIVE } }),
      // 移除对不存在的UserStatus.PENDING的使用
      User.count({ 
        where: { 
          createdAt: { 
            '$gte': firstDayOfMonth 
          } 
        } 
      })
    ]);
    
    return {
      total,
      active,
      inactive,
      // 移除pending字段
      newThisMonth
    };
  }

  /**
   * 查找最近注册的用户
   * @param limit 返回数量
   * @returns 最近注册的用户列表
   */
  async findRecentUsers(limit: number = 10): Promise<User[]> {
    return User.findAll({
      order: [['createdAt', 'DESC']],
      limit
    });
  }
}