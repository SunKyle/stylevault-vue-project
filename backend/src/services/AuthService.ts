import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/entities/User';
import logger from '../utils/logger';

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResult {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    createdAt?: Date;
  };
}

export class AuthService {
  /**
   * 用户注册
   */
  async register(data: RegisterData): Promise<{ user: User }> {
    const { username, email, password } = data;

    try {
      // 检查邮箱是否已存在
      const existingUserByEmail = await User.findByEmail(email);
      if (existingUserByEmail) {
        throw new Error('邮箱已存在');
      }

      // 检查用户名是否已存在
      const existingUserByUsername = await User.findByUsername(username);
      if (existingUserByUsername) {
        throw new Error('用户名已存在');
      }

      // 密码加密
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 创建用户
      const user = await User.create({
        username,
        email,
        passwordHash: hashedPassword,
        status: 'active',
      } as any);

      logger.info(`用户注册成功: ${email} (ID: ${user.id})`);

      return { user };
    } catch (error) {
      logger.error('用户注册失败:', error);
      throw error;
    }
  }

  /**
   * 用户登录
   */
  async login(data: LoginData): Promise<AuthResult> {
    const { email, password } = data;

    try {
      // 查找用户
      const user = await User.findByEmail(email);
      if (!user) {
        throw new Error('用户不存在');
      }

      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new Error('密码错误');
      }

      // 检查用户状态
      if (user.status !== 'active') {
        throw new Error('账户已被禁用');
      }

      // 生成JWT Token
      const payload = {
        userId: user.id,
        email: user.email,
        username: user.username,
      };
      const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here_make_it_long_and_random';
      const token = jwt.sign(payload, secret, { expiresIn: '7d' });

      // 更新最后登录时间
      await user.updateLastLogin();

      logger.info(`用户登录成功: ${email} (ID: ${user.id})`);

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      };
    } catch (error) {
      logger.error('用户登录失败:', error);
      throw error;
    }
  }

  /**
   * 验证Token
   */
  async verifyToken(token: string): Promise<any> {
    try {
      const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here_make_it_long_and_random';
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (error) {
      throw new Error('无效的Token');
    }
  }

  /**
   * 获取用户信息
   */
  async getUserById(userId: number): Promise<User | null> {
    return User.findByPk(userId);
  }
}