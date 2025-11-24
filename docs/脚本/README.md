# StyleVault 项目

## 一键启动脚本使用说明

### 功能说明
本项目提供了 `start-all.sh` 脚本，用于一键启动前后端服务。

### 使用方法

1. **确保已安装依赖**
   ```bash
   # 安装后端依赖
   cd backend
   npm install
   
   # 安装前端依赖
   cd ../front
   npm install
   ```

2. **执行一键启动脚本**
   ```bash
   # 在项目根目录执行
   ./start-all.sh
   ```

3. **访问项目**
   - 前端: http://localhost:8080
   - 后端API: http://localhost:3000

### 注意事项
- 脚本会同时启动前后端服务
- 按 Ctrl+C 可以停止所有服务
- 请确保8080和3000端口未被占用
- 在首次使用前请确保已安装所有依赖