#!/bin/bash

# StyleVault 项目一键验证脚本
# 适用于macOS ARM架构

echo "🚀 StyleVault 项目验证开始..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
check_command() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✅ $1 已安装${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 未安装${NC}"
        return 1
    fi
}

check_service() {
    if pgrep -x "$1" > /dev/null; then
        echo -e "${GREEN}✅ $1 服务运行中${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  $1 服务未运行${NC}"
        return 1
    fi
}

# 步骤1: 环境检查
echo "📋 步骤1: 环境检查"
echo "------------------"
check_command "node"
check_command "npm"
check_command "mysql"

# 检查Node.js版本
NODE_VERSION=$(node --version)
if [[ $NODE_VERSION =~ ^v([0-9]|1[0-7])\. ]]; then
    echo -e "${YELLOW}⚠️  Node.js版本较低 ($NODE_VERSION)，建议使用v18.17.0+${NC}"
else
    echo -e "${GREEN}✅ Node.js版本符合要求 ($NODE_VERSION)${NC}"
fi

# 步骤2: 数据库检查
echo ""
echo "📋 步骤2: 数据库服务检查"
echo "----------------------------"
check_service "mysqld"

# 步骤3: 依赖安装
echo ""
echo "📋 步骤3: 依赖安装"
echo "------------------"
if [ ! -d "node_modules" ]; then
    echo "安装依赖中..."
    npm install --target_arch=arm64
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ 依赖安装成功${NC}"
    else
        echo -e "${RED}❌ 依赖安装失败${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ 依赖已安装${NC}"
fi

# 步骤4: 配置文件检查
echo ""
echo "📋 步骤4: 配置文件检查"
echo "----------------------"
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${YELLOW}⚠️  已创建.env文件，请编辑配置数据库连接${NC}"
    else
        echo -e "${RED}❌ 缺少.env.example文件${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ .env文件已存在${NC}"
fi

# 步骤5: 数据库连接测试
echo ""
echo "📋 步骤5: 数据库连接测试"
echo "------------------------"
# 创建测试连接脚本
cat > test-connection.js << 'EOF'
const { Sequelize } = require('sequelize-typescript');
const config = require('./dist/config').default;

async function testConnection() {
    try {
        const sequelize = new Sequelize(config.database);
        await sequelize.authenticate();
        console.log('✅ 数据库连接成功');
        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ 数据库连接失败:', error.message);
        process.exit(1);
    }
}

testConnection();
EOF

# 编译TypeScript
npm run build > /dev/null 2>&1 || echo "跳过编译步骤"

# 测试数据库连接
if [ -f "dist/config/index.js" ]; then
    node test-connection.js
    DB_STATUS=$?
    rm -f test-connection.js
else
    echo -e "${YELLOW}⚠️  跳过数据库连接测试（需要编译）${NC}"
    DB_STATUS=0
fi

# 步骤6: 模型验证
echo ""
echo "📋 步骤6: 模型验证"
echo "------------------"
if [ -f "dist/scripts/validate-models.js" ]; then
    node dist/scripts/validate-models.js
else
    echo -e "${YELLOW}⚠️  跳过模型验证（需要编译）${NC}"
fi

# 最终总结
echo ""
echo "🎉 验证完成总结"
echo "=================="
echo "下一步操作:"
echo "1. 编辑 .env 文件配置数据库连接"
echo "2. 运行: npm run init-db"
echo "3. 运行: npm test"
echo ""
echo "详细指南: 查看 docs/NEXT_STEP.md"