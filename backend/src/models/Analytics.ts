import { DataTypes } from 'sequelize';
import { BaseModel } from './BaseModel';

interface AnalyticsAttributes {
  userId: string;
  eventType: string;
  eventData: any;
  timestamp: Date;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
}

interface AnalyticsCreationAttributes extends Partial<AnalyticsAttributes> {}

export class Analytics extends BaseModel<AnalyticsAttributes, AnalyticsCreationAttributes> {
  public userId!: string;
  public eventType!: string;
  public eventData!: any;
  public timestamp!: Date;
  public sessionId?: string;
  public ipAddress?: string;
  public userAgent?: string;

  /**
   * 记录用户行为
   */
  public static async trackEvent(
    userId: string,
    eventType: string,
    eventData: any,
    metadata?: {
      sessionId?: string;
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<Analytics> {
    return this.create({
      userId,
      eventType,
      eventData,
      timestamp: new Date(),
      ...metadata,
    });
  }

  /**
   * 获取用户行为数据
   */
  public static async getUserEvents(
    userId: string,
    eventType?: string,
    limit: number = 100
  ): Promise<Analytics[]> {
    const where: any = { userId };
    if (eventType) where.eventType = eventType;

    return this.findAll({
      where,
      order: [['timestamp', 'DESC']],
      limit,
    });
  }

  /**
   * 获取统计概览
   */
  public static async getAnalyticsOverview(userId: string): Promise<{
    totalEvents: number;
    eventsByType: Record<string, number>;
    recentActivity: Analytics[];
  }> {
    const events = await this.getUserEvents(userId, undefined, 1000);
    
    const eventsByType: Record<string, number> = {};
    events.forEach(event => {
      eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;
    });

    return {
      totalEvents: events.length,
      eventsByType,
      recentActivity: events.slice(0, 10),
    };
  }
}