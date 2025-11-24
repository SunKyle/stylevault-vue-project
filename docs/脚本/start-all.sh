#!/bin/bash

# StyleVault 前后端一键启动脚本
# 使用方法: ./start-all.sh

set -e

echo "========================================"
echo "StyleVault 项目一键启动脚本"
echo "========================================"
echo "正在启动后端服务..."

# 启动后端服务
cd "$(dirname "$0")/backend"
npm run dev &
BACKEND_PID=$!
echo "后端服务已启动，PID: $BACKEND_PID"

# 等待后端服务初始化
echo "等待后端服务初始化..."
sleep 3

echo "正在启动前端服务..."

# 启动前端服务
cd "$(dirname "$0")/front"
npm run dev &
FRONTEND_PID=$!
echo "前端服务已启动，PID: $FRONTEND_PID"

echo "========================================"
echo "✅ 所有服务已启动成功！"
echo "- 后端服务正在运行，PID: $BACKEND_PID"
echo "- 前端服务正在运行，PID: $FRONTEND_PID"
echo "========================================"
echo "前端访问地址: http://localhost:8080"
echo "后端API地址: http://localhost:3000"
echo "========================================"
echo "按 Ctrl+C 停止所有服务"
echo "========================================"

# 等待所有进程结束
wait $BACKEND_PID $FRONTEND_PID