# StyleVault 数据迁移实施指南

## 🎯 迁移目标

将现有数据结构平滑迁移到优化后的架构，确保数据完整性、业务连续性，并最小化停机时间。

## 📊 当前数据结构映射

### 现有表结构分析
```sql
-- 现有表清单
SHOW TABLES;

-- 数据量统计
SELECT 
    table_name,
    table_rows,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'stylevault';
```

### 数据映射关系

| 现有表 | 新结构 | 映射说明 | 处理策略 |
|--------|--------|----------|----------|
| users | User | 字段基本一致 | 直接迁移 |
| clothing_items | ClothingItem | 结构优化 | 分批迁移 |
| outfits | Outfit | 关系重构 | 增量迁移 |
| categories | ClothingCategory | 枚举标准化 | 数据转换 |
| tags | Tag + EntityTag | 多对多关系 | 关联表迁移 |

## 🚀 分阶段迁移计划

### Phase 1: 准备工作 (Day 1-2)

#### 1.1 环境准备
```bash
# 创建迁移环境
mkdir -p migration/{backup,scripts,logs,validation}

# 安装依赖
npm install --save-dev typeorm sequelize-cli mysql2

# 数据库备份
mysqldump -u root -p stylevault > migration/backup/stylevault_$(date +%Y%m%d_%H%M%S).sql
```

#### 1.2 创建新表结构
```sql
-- 创建新表（与现有表并存）
CREATE TABLE IF NOT EXISTS users_v2 (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    profile JSON,
    preferences JSON,
    settings JSON,
    stats JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

CREATE TABLE IF NOT EXISTS clothing_items_v2 (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    basic_info JSON,
    specifications JSON,
    media JSON,
    tags JSON,
    metadata JSON,
    compatibility JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_category ((specifications->>'$.category')),
    INDEX idx_created_at (created_at)
);
```

### Phase 2: 数据验证 (Day 3)

#### 2.1 数据一致性检查
```javascript
// 数据验证脚本 migration/validate-data.js
const { validate } = require('./validators');

async function validateData() {
    const checks = [
        {
            name: '用户数据完整性',
            query: 'SELECT COUNT(*) as count FROM users WHERE email IS NULL OR username IS NULL',
            expected: 0
        },
        {
            name: '衣物数据关联性',
            query: 'SELECT COUNT(*) as count FROM clothing_items WHERE user_id NOT IN (SELECT id FROM users)',
            expected: 0
        },
        {
            name: '重复标签检查',
            query: 'SELECT name, COUNT(*) as count FROM tags GROUP BY name HAVING count > 1',
            expected: 0
        }
    ];
    
    for (const check of checks) {
        const result = await db.query(check.query);
        if (result[0].count !== check.expected) {
            throw new Error(`${check.name}: 发现 ${result[0].count} 条异常数据`);
        }
    }
}
```

#### 2.2 数据清洗
```sql
-- 清理无效数据
DELETE FROM clothing_items WHERE user_id IS NULL;
DELETE FROM outfits WHERE user_id IS NULL;

-- 标准化标签
UPDATE tags SET name = TRIM(LOWER(name));

-- 处理重复用户
DELETE u1 FROM users u1
INNER JOIN users u2 
WHERE u1.email = u2.email AND u1.id > u2.id;
```

### Phase 3: 增量迁移 (Day 4-7)

#### 3.1 用户数据迁移
```javascript
// migration/migrate-users.js
async function migrateUsers() {
    const batchSize = 1000;
    let offset = 0;
    
    while (true) {
        const users = await db.query(`
            SELECT * FROM users 
            LIMIT ${batchSize} OFFSET ${offset}
        `);
        
        if (users.length === 0) break;
        
        for (const user of users) {
            const newUser = {
                id: generateUUID(),
                username: user.username,
                email: user.email,
                profile: {
                    avatar: user.avatar_url,
                    nickname: user.username,
                    bio: null,
                    birthday: null,
                    location: null
                },
                preferences: {
                    theme: 'light',
                    language: 'zh-CN',
                    currency: 'CNY',
                    units: 'metric'
                },
                settings: {
                    privacy: {
                        profileVisibility: 'friends',
                        outfitVisibility: 'public',
                        allowComments: true,
                        allowLikes: true
                    },
                    notifications: {
                        email: true,
                        push: true,
                        like: true,
                        comment: true,
                        follow: true
                    }
                },
                stats: {
                    totalClothingItems: 0,
                    totalOutfits: 0,
                    totalLikesReceived: 0,
                    totalFollowers: 0,
                    totalFollowing: 0,
                    accountAge: 0,
                    lastActiveAt: new Date()
                },
                created_at: user.created_at,
                updated_at: user.updated_at,
                deleted_at: user.deleted_at
            };
            
            await db.query(`
                INSERT INTO users_v2 (id, username, email, profile, preferences, settings, stats, created_at, updated_at, deleted_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                newUser.id, newUser.username, newUser.email,
                JSON.stringify(newUser.profile),
                JSON.stringify(newUser.preferences),
                JSON.stringify(newUser.settings),
                JSON.stringify(newUser.stats),
                newUser.created_at, newUser.updated_at, newUser.deleted_at
            ]);
        }
        
        console.log(`Migrated ${offset + users.length} users`);
        offset += batchSize;
    }
}
```

#### 3.2 衣物数据迁移
```javascript
// migration/migrate-clothing.js
async function migrateClothingItems() {
    const categories = await db.query('SELECT * FROM categories');
    const categoryMap = new Map(categories.map(c => [c.id, c.name]));
    
    const batchSize = 500;
    let offset = 0;
    
    while (true) {
        const items = await db.query(`
            SELECT ci.*, GROUP_CONCAT(t.name) as tags
            FROM clothing_items ci
            LEFT JOIN clothing_item_tags cit ON ci.id = cit.clothing_item_id
            LEFT JOIN tags t ON cit.tag_id = t.id
            GROUP BY ci.id
            LIMIT ${batchSize} OFFSET ${offset}
        `);
        
        if (items.length === 0) break;
        
        for (const item of items) {
            const newItem = {
                id: generateUUID(),
                user_id: item.user_id,
                basic_info: {
                    name: item.name,
                    brand: item.brand || null,
                    model: null,
                    purchasePrice: item.price || 0,
                    purchaseDate: item.purchase_date,
                    purchaseLocation: null
                },
                specifications: {
                    category: categoryMap.get(item.category_id) || 'other',
                    subcategory: null,
                    color: item.color ? [{ name: item.color, hex: item.color }] : [],
                    size: {
                        system: 'CN',
                        size: item.size || 'M',
                        measurements: {}
                    },
                    material: item.material ? [item.material] : [],
                    season: item.season ? [item.season] : [],
                    gender: 'unisex',
                    ageGroup: 'adult'
                },
                media: {
                    images: item.image_url ? [{ url: item.image_url, isMain: true }] : [],
                    mainImage: item.image_url,
                    videoUrl: null
                },
                tags: item.tags ? item.tags.split(',').map(t => ({ name: t.trim(), category: 'user' })) : [],
                metadata: {
                    wearCount: item.wear_count || 0,
                    lastWorn: null,
                    condition: 'good',
                    isFavorite: item.favorite || false,
                    isArchived: false
                },
                compatibility: {
                    compatibleColors: [],
                    incompatibleColors: [],
                    styleTags: []
                }
            };
            
            await db.query(`
                INSERT INTO clothing_items_v2 (id, user_id, basic_info, specifications, media, tags, metadata, compatibility, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                newItem.id, newItem.user_id,
                JSON.stringify(newItem.basic_info),
                JSON.stringify(newItem.specifications),
                JSON.stringify(newItem.media),
                JSON.stringify(newItem.tags),
                JSON.stringify(newItem.metadata),
                JSON.stringify(newItem.compatibility),
                item.created_at, item.updated_at
            ]);
        }
        
        console.log(`Migrated ${offset + items.length} clothing items`);
        offset += batchSize;
    }
}
```

### Phase 4: 切换验证 (Day 8)

#### 4.1 并行验证
```javascript
// migration/parallel-validation.js
async function validateMigration() {
    const validations = [
        {
            name: '用户数量一致性',
            oldQuery: 'SELECT COUNT(*) as count FROM users',
            newQuery: 'SELECT COUNT(*) as count FROM users_v2',
            tolerance: 0
        },
        {
            name: '衣物数量一致性',
            oldQuery: 'SELECT COUNT(*) as count FROM clothing_items',
            newQuery: 'SELECT COUNT(*) as count FROM clothing_items_v2',
            tolerance: 0
        },
        {
            name: '数据完整性',
            newQuery: `
                SELECT COUNT(*) as count FROM clothing_items_v2 
                WHERE JSON_EXTRACT(basic_info, '$.name') IS NULL
            `,
            expected: 0
        }
    ];
    
    for (const validation of validations) {
        const oldResult = await db.query(validation.oldQuery);
        const newResult = await db.query(validation.newQuery);
        
        const oldCount = oldResult[0]?.count || 0;
        const newCount = newResult[0]?.count || 0;
        
        if (Math.abs(oldCount - newCount) > (validation.tolerance || 0)) {
            throw new Error(`${validation.name}: 数据不一致 (${oldCount} vs ${newCount})`);
        }
    }
    
    console.log('✅ 所有验证通过');
}
```

#### 4.2 应用切换
```sql
-- 创建视图实现无缝切换
CREATE OR REPLACE VIEW users_current AS
SELECT * FROM users_v2;

CREATE OR REPLACE VIEW clothing_items_current AS
SELECT * FROM clothing_items_v2;

-- 重命名表实现最终切换
RENAME TABLE users TO users_old, users_v2 TO users;
RENAME TABLE clothing_items TO clothing_items_old, clothing_items_v2 TO clothing_items;
```

### Phase 5: 清理回滚 (Day 9-10)

#### 5.1 回滚方案
```sql
-- 快速回滚脚本
CREATE PROCEDURE rollback_migration()
BEGIN
    START TRANSACTION;
    
    -- 回滚用户表
    RENAME TABLE users TO users_v2, users_old TO users;
    
    -- 回滚衣物表
    RENAME TABLE clothing_items TO clothing_items_v2, clothing_items_old TO clothing_items;
    
    COMMIT;
END;
```

#### 5.2 清理旧数据
```sql
-- 确认无误后清理旧表
DROP TABLE IF EXISTS users_old;
DROP TABLE IF EXISTS clothing_items_old;

-- 清理迁移相关表
DROP TABLE IF EXISTS migration_log;
```

## 🔍 监控与验证

### 实时监控指标
```javascript
// migration/monitor.js
const monitoring = {
    metrics: {
        migrationProgress: 0,
        errorCount: 0,
        processingSpeed: 0,
        estimatedCompletionTime: null
    },
    
    async updateProgress(current, total) {
        this.metrics.migrationProgress = (current / total) * 100;
        this.metrics.processingSpeed = current / (Date.now() - startTime) * 1000;
        
        console.log(`Progress: ${this.metrics.migrationProgress.toFixed(2)}%`);
        console.log(`Speed: ${this.metrics.processingSpeed.toFixed(0)} items/sec`);
    },
    
    async logError(error, context) {
        this.metrics.errorCount++;
        console.error(`Migration Error [${context}]:`, error);
        
        await db.query(`
            INSERT INTO migration_log (error_type, error_message, context, timestamp)
            VALUES (?, ?, ?, NOW())
        `, [error.name, error.message, context]);
    }
};
```

### 数据验证报告
```bash
# 生成迁移报告
node migration/generate-report.js

# 报告内容示例
Migration Report
================
Start Time: 2024-01-15 10:00:00
End Time: 2024-01-15 10:45:32
Duration: 45 minutes 32 seconds

Data Migrated:
- Users: 1,234 (100%)
- Clothing Items: 5,678 (100%)
- Outfits: 890 (100%)
- Tags: 456 (100%)

Validation Results:
- Data Integrity: ✅ PASS
- Referential Integrity: ✅ PASS
- Index Performance: ✅ PASS
- Application Tests: ✅ PASS

Errors:
- Total Errors: 0
- Critical Errors: 0
- Warnings: 2 (已处理)
```

## 🚨 应急处理

### 常见错误处理
```javascript
// migration/error-handler.js
const errorHandler = {
    async handleDuplicateUser(error) {
        console.log('发现重复用户，执行合并策略...');
        // 合并用户数据逻辑
    },
    
    async handleMissingCategory(error) {
        console.log('发现缺失类别，创建默认类别...');
        // 创建默认类别逻辑
    },
    
    async handleInvalidJson(error) {
        console.log('JSON格式错误，尝试修复...');
        // JSON修复逻辑
    }
};
```

### 性能优化建议
```sql
-- 迁移期间优化
SET GLOBAL innodb_buffer_pool_size = 2G;
SET GLOBAL max_connections = 200;
SET GLOBAL innodb_flush_log_at_trx_commit = 2;

-- 批量插入优化
SET autocommit = 0;
SET unique_checks = 0;
SET foreign_key_checks = 0;
```

## 📋 检查清单

### 迁移前检查
- [ ] 完整数据备份
- [ ] 验证脚本通过
- [ ] 测试环境验证
- [ ] 回滚方案准备
- [ ] 监控工具配置

### 迁移中检查
- [ ] 实时监控运行
- [ ] 错误日志检查
- [ ] 性能指标监控
- [ ] 数据一致性验证

### 迁移后检查
- [ ] 应用功能测试
- [ ] 性能基准测试
- [ ] 数据完整性验证
- [ ] 用户体验验证

## 🎯 成功标准

- ✅ 零数据丢失
- ✅ 零停机时间
- ✅ 性能提升 > 30%
- ✅ 数据一致性 100%
- ✅ 应用测试通过率 100%

通过以上分阶段实施，可以确保StyleVault数据架构的平滑升级，为未来的业务扩展奠定坚实基础。