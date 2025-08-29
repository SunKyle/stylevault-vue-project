import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  AllowNull
} from 'sequelize-typescript';
import { BaseModel } from './BaseModel';
import { User } from './User';

export enum UploadType {
  CLOTHING = 'clothing',
  OUTFIT = 'outfit',
  AVATAR = 'avatar',
  BANNER = 'banner',
  OTHER = 'other'
}

export enum UploadStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

@Table({
  tableName: 'uploads'
})
export class Upload extends BaseModel {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  userId!: number;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(UploadType)))
  type!: UploadType;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  originalName!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  fileName!: string;

  @AllowNull(false)
  @Column(DataType.STRING(500))
  filePath!: string;

  @Column(DataType.STRING(500))
  thumbnailPath?: string;

  @Column(DataType.STRING(100))
  mimeType?: string;

  @Column(DataType.INTEGER)
  fileSize!: number;

  @Column(DataType.INTEGER)
  width?: number;

  @Column(DataType.INTEGER)
  height?: number;

  @Column(DataType.ENUM(...Object.values(UploadStatus)))
  status!: UploadStatus;

  @Column(DataType.TEXT)
  errorMessage?: string;

  @Column(DataType.JSON)
  metadata?: {
    [key: string]: any;
  };

  @Column(DataType.STRING(500))
  url!: string;

  @Column(DataType.STRING(500))
  thumbnailUrl?: string;

  // 关联定义
  @BelongsTo(() => User)
  user!: User;

  // 虚拟字段
  get isImage(): boolean {
    return this.mimeType?.startsWith('image/') || false;
  }

  get isVideo(): boolean {
    return this.mimeType?.startsWith('video/') || false;
  }

  get fileSizeFormatted(): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = this.fileSize;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }
}