# 🔄 Node.js 升级指南 (macOS ARM)

## 当前状态
- **当前版本**: Node.js v16.17.0
- **项目要求**: Node.js v18.0.0+
- **架构**: ARM64 (Apple Silicon)

## 📥 升级方案

### 方案1: 使用Node版本管理器 (推荐)

#### 安装nvm (Node Version Manager)
```bash
# 安装nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重新加载shell
source ~/.zshrc

# 验证安装
nvm --version
```

#### 安装Node.js 18 LTS
```bash
# 安装Node.js 18 LTS版本
nvm install 18
nvm use 18
nvm alias default 18

# 验证版本
node --version  # 应显示 v18.x.x
npm --version   # 应显示 9.x.x+
```

### 方案2: 直接下载安装包

#### 从官网下载
1. 访问: https://nodejs.org/
2. 下载 **LTS** 版本 (18.x.x)
3. 选择 **macOS ARM 64-bit** 版本
4. 双击安装包安装

#### 验证安装
```bash
node --version  # v18.x.x
npm --version   # 9.x.x+
```

### 方案3: 使用Homebrew
```bash
# 更新Homebrew
brew update

# 安装Node.js 18
brew install node@18

# 链接到PATH
echo 'export PATH="/opt/homebrew/opt/node@18/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 验证
node --version
```

## 🔧 升级后操作

### 重新安装依赖
```bash
cd /Users/sunxiaokai/Desktop/stylevault-vue-project/backend
rm -rf node_modules package-lock.json
npm install --target_arch=arm64
```

### 验证兼容性
```bash
npm run check-env
# 应显示 Node: v18.x.x Arch: arm64
```

## ⚡ 快速修复命令

### 一键升级脚本
```bash
#!/bin/bash
# 保存当前目录
CURRENT_DIR=$(pwd)

# 安装nvm并升级Node
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.zshrc
nvm install 18
nvm use 18
nvm alias default 18

# 返回原目录
cd "$CURRENT_DIR"

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install --target_arch=arm64

echo "✅ Node.js升级完成！"
echo "当前版本: $(node --version)"
```

## 🚨 注意事项

### ARM架构特殊处理
- 确保使用 **arm64** 版本
- 避免安装x64版本导致兼容性问题

### 环境变量
升级后可能需要重新配置：
```bash
# 检查npm全局路径
npm config get prefix

# 如有需要，重新设置
npm config set prefix ~/.npm-global
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
```

### 项目特定依赖
某些依赖可能需要重新编译：
```bash
# 强制重新编译原生模块
npm rebuild --arch=arm64
```

## ✅ 升级验证清单

- [ ] Node.js版本 ≥ 18.0.0
- [ ] npm版本 ≥ 9.0.0
- [ ] 项目依赖安装无警告
- [ ] `npm run validate-models` 运行成功
- [ ] `npm test` 通过所有测试

## 📞 故障排除

### 版本切换问题
```bash
# 查看已安装版本
nvm ls

# 切换版本
nvm use 18
```

### 权限问题
```bash
# 修复npm权限
sudo chown -R $(whoami) ~/.npm
```

### 路径问题
```bash
# 检查which node
which node
which npm

# 确保使用正确版本
nvm which 18
```