import { DataTypes, Op, QueryTypes } from 'sequelize';
import { BaseModel, BaseModelAttributes } from './BaseModel';
import { sequelize } from '../config/database';
import {
  Field,
  StringField,
  IntegerField,
  JSONField,
  PrimaryKey,
  DateTimeField,
  createFieldDefinitions,
} from '../decorators/field-decorator';

/**
 * 上传文件属性接口
 * 定义上传文件模型的所有属性
 */
export interface UploadAttributes extends BaseModelAttributes {
  userId: number;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
  metadata?: object;
}

/**
 * 上传文件创建属性接口
 * 创建上传文件时必需的属性
 */
export interface UploadCreationAttributes {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
  metadata?: object;
}

/**
 * 上传文件模型
 * 管理用户上传的文件信息
 */
export class Upload extends BaseModel<UploadAttributes> {
  @PrimaryKey()
  id!: number;

  @IntegerField({ allowNull: false })
  userId!: number;

  @StringField({ allowNull: false, unique: true })
  filename!: string;

  @StringField({ allowNull: false })
  originalName!: string;

  @StringField({ allowNull: false })
  mimetype!: string;

  @IntegerField({ allowNull: false })
  size!: number;

  @StringField({ allowNull: false })
  path!: string;

  @StringField({ allowNull: false })
  url!: string;

  @JSONField({ allowNull: true })
  metadata?: object;

  // 虚拟字段
  /**
   * 文件类型
   * 从mimetype中提取的主类型，如 image, video, audio等
   */
  get fileType(): string {
    return this.mimetype.split('/')[0];
  }

  /**
   * 文件扩展名
   * 从原始文件名中提取的扩展名
   */
  get extension(): string {
    const parts = this.originalName.split('.');
    return parts.length > 1 ? `.${parts.pop()}` : '';
  }

  /**
   * 文件大小（格式化）
   * 人类可读的文件大小
   */
  get formattedSize(): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = this.size;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  /**
   * 是否为图片
   */
  get isImage(): boolean {
    return this.mimetype.startsWith('image/');
  }

  /**
   * 是否为视频
   */
  get isVideo(): boolean {
    return this.mimetype.startsWith('video/');
  }

  // 静态工具方法
  /**
   * 按用户ID获取上传文件
   * @param userId 用户ID
   * @param limit 返回数量限制
   */
  static async getByUserId(userId: number, limit?: number): Promise<Upload[]> {
    const options: any = {
      where: { userId },
      order: [['createdAt', 'DESC']],
    };
    
    if (limit) {
      options.limit = limit;
    }
    
    return this.findAll(options);
  }

  /**
   * 按文件名查找文件
   * @param filename 文件名
   */
  static async findByFilename(filename: string): Promise<Upload | null> {
    return this.findOne({ where: { filename } });
  }

  /**
   * 按文件类型获取上传文件
   * @param mimetype MIME类型或前缀
   * @param userId 用户ID（可选）
   */
  static async getByType(mimetype: string, userId?: number): Promise<Upload[]> {
    const where: any = { mimetype: { [Op.like]: `${mimetype}%` } };
    if (userId) where.userId = userId;
    
    return this.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * 按大小范围获取上传文件
   * @param minSize 最小大小（字节）
   * @param maxSize 最大大小（字节）
   * @param userId 用户ID（可选）
   */
  static async getBySizeRange(
    minSize: number,
    maxSize: number,
    userId?: number
  ): Promise<Upload[]> {
    const where: any = {
      size: {
        [Op.between]: [minSize, maxSize],
      },
    };
    if (userId) where.userId = userId;

    return this.findAll({
      where,
      order: [['size', 'ASC']],
    });
  }

  /**
   * 获取用户存储统计
   * @param userId 用户ID
   */
  static async getStorageStats(userId: number): Promise<{
    totalFiles: number;
    totalSize: number;
    imageCount: number;
    videoCount: number;
    otherCount: number;
  }> {
    const [result] = await sequelize.query(`
      SELECT
        COUNT(*) as totalFiles,
        SUM(size) as totalSize,
        SUM(CASE WHEN mimetype LIKE 'image/%' THEN 1 ELSE 0 END) as imageCount,
        SUM(CASE WHEN mimetype LIKE 'video/%' THEN 1 ELSE 0 END) as videoCount,
        SUM(CASE WHEN mimetype NOT LIKE 'image/%' AND mimetype NOT LIKE 'video/%' THEN 1 ELSE 0 END) as otherCount
      FROM uploads
      WHERE user_id = :userId AND deleted_at IS NULL
    `, {
      type: QueryTypes.SELECT,
      replacements: { userId }
    });

    return result as any;
  }
}

Upload.init({
  ...createFieldDefinitions(Upload),
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'uploads',
  underscored: true,
  paranoid: true,
  indexes: [
    {
      fields: ['user_id', 'deleted_at']
    },
    {
      fields: ['filename'],
      unique: true
    },
    {
      fields: ['mimetype']
    },
    {
      fields: ['created_at']
    }
  ]
});

export default Upload;