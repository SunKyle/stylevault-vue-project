-- 添加color字段到categories表
-- 执行时间: 2025-09-05
-- 作者: 系统维护

-- 检查color字段是否存在
SELECT CASE 
    WHEN NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'categories' AND COLUMN_NAME = 'color'
    ) THEN 
        ALTER TABLE `categories` ADD COLUMN `color` VARCHAR(7) DEFAULT NULL COMMENT '颜色值（十六进制）'
    ELSE 
        SELECT 'color column already exists' AS message
END;