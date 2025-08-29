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

export enum TemperatureUnit {
  CELSIUS = 'celsius',
  FAHRENHEIT = 'fahrenheit'
}

@Table({
  tableName: 'user_preferences'
})
export class UserPreference extends BaseModel {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  userId!: number;

  @Column(DataType.STRING(50))
  preferredStyle?: string;

  @Column(DataType.JSON)
  favoriteColors?: string[];

  @Column(DataType.JSON)
  favoriteBrands?: string[];

  @Column(DataType.STRING(20))
  temperatureUnit?: TemperatureUnit;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  weatherBasedSuggestions!: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  seasonalReminders!: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  privateAccount!: boolean;

  @Column(DataType.JSON)
  notificationSettings?: {
    email: boolean;
    push: boolean;
    outfitReminders: boolean;
    weatherAlerts: boolean;
  };

  @Column(DataType.JSON)
  privacySettings?: {
    showEmail: boolean;
    showStats: boolean;
    allowComments: boolean;
  };

  // 关联定义
  @BelongsTo(() => User)
  user!: User;
}