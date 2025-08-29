import {
  Table,
  Column,
  DataType,
  AllowNull,
  Length,
  ForeignKey,
  BelongsTo,
  HasMany
} from 'sequelize-typescript';
import { BaseModel } from './BaseModel';
import { User } from './User';
// import { OutfitItem } from './OutfitItem';

export enum OutfitSeason {
  SPRING = 'spring',
  SUMMER = 'summer',
  AUTUMN = 'autumn',
  WINTER = 'winter',
  ALL_SEASON = 'all_season'
}

export enum OutfitOccasion {
  CASUAL = 'casual',
  FORMAL = 'formal',
  BUSINESS = 'business',
  SPORT = 'sport',
  PARTY = 'party',
  DATE = 'date',
  TRAVEL = 'travel',
  HOME = 'home'
}

@Table({
  tableName: 'outfits'
})
export class Outfit extends BaseModel {
  @AllowNull(false)
  @Length({ min: 1, max: 100 })
  @Column(DataType.STRING(100))
  title!: string;

  @Column(DataType.TEXT)
  description?: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  userId!: number;

  @Column(DataType.ENUM(...Object.values(OutfitSeason)))
  season?: OutfitSeason;

  @Column(DataType.ENUM(...Object.values(OutfitOccasion)))
  occasion?: OutfitOccasion;

  @Column(DataType.STRING(50))
  weather?: string;

  @Column(DataType.STRING(50))
  mood?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isPublic!: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isFavorite!: boolean;

  @Column(DataType.STRING(500))
  imageUrl?: string;

  @Column(DataType.JSON)
  images?: string[];

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.DATE)
  wornDate?: Date;

  @Column(DataType.STRING(100))
  location?: string;

  @Column(DataType.INTEGER)
  views!: number;

  @Column(DataType.INTEGER)
  likes!: number;

  @Column(DataType.INTEGER)
  shares!: number;

  @Column(DataType.INTEGER)
  downloads!: number;

  @Column(DataType.INTEGER)
  commentCount!: number;

  @Column(DataType.DECIMAL(3, 2))
  rating?: number;

  // 关联定义
  @BelongsTo(() => User)
  user!: User;

  // @HasMany(() => OutfitItem)
  // outfitItems!: OutfitItem[];

  // 虚拟字段
  get itemCount(): number {
    // return this.outfitItems?.length || 0;
    return 0;
  }

  get isSeasonal(): boolean {
    return this.season !== OutfitSeason.ALL_SEASON;
  }

  get isWorn(): boolean {
    return !!this.wornDate;
  }
}