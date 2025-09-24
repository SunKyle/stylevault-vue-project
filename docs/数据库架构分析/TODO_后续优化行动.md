# 数据库优化后续行动清单

## 🎯 立即可执行（本周内）

### 1. 性能验证测试
```bash
# 运行性能基准测试
node scripts/performance-benchmark.js

# 验证索引效果
mysql -u root -p styleVault -e "
SELECT 'clothing_query' as test, 
       (SELECT COUNT(*) FROM clothing WHERE user_id = 1 AND category = 'tops') as result;
SELECT 'outfits_query' as test,
       (SELECT COUNT(*) FROM outfits WHERE user_id = 1 AND season = 'summer') as result;
"
```

### 2. 监控面板配置
```sql
-- 创建性能监控表
CREATE TABLE IF NOT EXISTS performance_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    metric_name VARCHAR(100),
    value FLOAT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_metric_time (metric_name, recorded_at)
);

-- 插入基线数据
INSERT INTO performance_metrics (metric_name, value) VALUES
('clothing_table_rows', (SELECT COUNT(*) FROM clothing)),
('outfits_table_rows', (SELECT COUNT(*) FROM outfits)),
('user_behaviors_rows', (SELECT COUNT(*) FROM user_behaviors));
```

## 📋 短期优化（1-2周）

### 3. attributes表重构准备
```bash
# 备份当前数据
mysqldump -u root -p styleVault attributes > backup_attributes_$(date +%Y%m%d).sql

# 创建新表结构（测试环境先执行）
mysql -u root -p styleVault < migrations/20241212_attributes_refactor.sql
```

### 4. 用户画像系统
```sql
-- 创建用户画像表（低风险操作）
CREATE TABLE IF NOT EXISTS user_style_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    favorite_category VARCHAR(50),
    avg_price_range DECIMAL(10,2),
    color_preferences JSON,
    brand_preferences JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🔄 中期优化（1个月）

### 5. 缓存层实施
```sql
-- 创建统计缓存表
CREATE TABLE IF NOT EXISTS user_statistics_cache (
    user_id INT PRIMARY KEY,
    total_clothing INT DEFAULT 0,
    total_outfits INT DEFAULT 0,
    favorite_brand VARCHAR(100),
    total_spent DECIMAL(15,2) DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建更新触发器
DELIMITER //
CREATE TRIGGER update_user_stats_after_clothing_insert
AFTER INSERT ON clothing
FOR EACH ROW
BEGIN
    INSERT INTO user_statistics_cache (user_id, total_clothing, total_spent) 
    VALUES (NEW.user_id, 1, NEW.price)
    ON DUPLICATE KEY UPDATE 
    total_clothing = total_clothing + 1,
    total_spent = total_spent + IFNULL(NEW.price, 0);
END//
DELIMITER ;
```

### 6. 分区表准备
```sql
-- 评估数据量
SELECT 
    table_name,
    table_rows,
    ROUND(data_length/1024/1024, 2) as data_size_mb
FROM information_schema.tables 
WHERE table_schema = 'styleVault' 
    AND table_name IN ('user_behaviors', 'recommendations')
ORDER BY data_length DESC;

-- 如果数据量>100万行，考虑分区
-- ALTER TABLE user_behaviors PARTITION BY RANGE (YEAR(created_at));
```

## 📊 长期规划（3-6月）

### 7. 读写分离架构
```yaml
# 数据库配置模板
# config/database.yml
production:
  write_db:
    host: master-db.stylevault.com
    port: 3306
    database: styleVault
  read_db:
    host: slave-db.stylevault.com
    port: 3306
    database: styleVault
    pool_size: 20
```

### 8. 监控告警系统
```sql
-- 创建监控存储过程
DELIMITER //
CREATE PROCEDURE check_slow_queries()
BEGIN
    SELECT 
        DIGEST_TEXT as query_pattern,
        COUNT_STAR as execution_count,
        AVG_TIMER_WAIT/1000000000 as avg_seconds
    FROM performance_schema.events_statements_summary_by_digest
    WHERE AVG_TIMER_WAIT > 1000000000  -- 1秒以上
    ORDER BY AVG_TIMER_WAIT DESC
    LIMIT 10;
END//
DELIMITER ;

-- 设置定时任务（每5分钟检查一次）
-- 需要配合系统定时任务或MySQL EVENT
```

## 🛠️ 工具与脚本

### 9. 性能测试脚本
```javascript
// scripts/db-performance-test.js
const mysql = require('mysql2/promise');

async function runPerformanceTests() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'sxk1997sxk',
        database: 'styleVault'
    });

    const tests = [
        {
            name: '用户衣物查询',
            sql: 'SELECT * FROM clothing WHERE user_id = ? AND category = ? AND status = "active"',
            params: [1, 'tops']
        },
        {
            name: '穿搭推荐',
            sql: 'SELECT * FROM outfits WHERE user_id = ? AND season = ?',
            params: [1, 'summer']
        }
    ];

    for (const test of tests) {
        const start = Date.now();
        await connection.execute(test.sql, test.params);
        const duration = Date.now() - start;
        console.log(`${test.name}: ${duration}ms`);
    }

    await connection.end();
}

runPerformanceTests();
```

### 10. 数据一致性检查
```sql
-- 检查外键完整性
SELECT 
    'clothing_orphaned' as check_name,
    COUNT(*) as orphaned_count
FROM clothing c 
LEFT JOIN users u ON c.user_id = u.id 
WHERE u.id IS NULL;

SELECT 
    'outfits_orphaned' as check_name,
    COUNT(*) as orphaned_count
FROM outfits o 
LEFT JOIN users u ON o.user_id = u.id 
WHERE u.id IS NULL;
```

## 📈 监控指标

### 关键性能指标(KPI)
```sql
-- 每日性能报告
SELECT 
    DATE(created_at) as date,
    COUNT(*) as daily_clothing_adds,
    AVG(LENGTH(JSON_EXTRACT(image_urls, '$'))) as avg_image_size
FROM clothing 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### 告警阈值
- 查询响应时间 > 100ms
- 表行数 > 100万
- 索引命中率 < 95%
- 连接数 > 80% 最大连接数

## 🎯 执行优先级

### 本周必做
1. ✅ 性能验证测试
2. ✅ 监控基线建立
3. ✅ 数据备份验证

### 下周计划
1. 🔄 attributes表重构方案评审
2. 🔄 用户画像表设计确认
3. 🔄 缓存层技术方案

### 本月重点
1. 📊 分区表数据评估
2. 🔄 读写分离架构设计
3. 📈 监控告警系统上线

## 📞 技术支持

### 紧急联系
- 数据库异常: 检查 `performance_schema.events_statements_summary_by_digest`
- 性能问题: 运行 `EXPLAIN ANALYZE` 分析查询
- 数据恢复: 使用已创建的备份文件

### 工具推荐
- **MySQL Workbench**: 可视化查询分析
- **pt-query-digest**: 慢查询分析
- **MySQLTuner**: 配置优化建议

---

**下一步行动**: 从"立即可执行"部分开始，按优先级逐步实施。每个阶段都有详细的验证步骤和回滚方案，确保系统稳定性。