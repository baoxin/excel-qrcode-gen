#!/bin/bash

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    echo "错误: 未找到Python3，请先安装Python3"
    exit 1
fi

# 检查dist目录是否存在
if [ ! -d "dist" ]; then
    echo "错误: dist目录不存在，请先运行 npm run build"
    exit 1
fi

# 进入dist目录并启动服务器
cd dist
echo "正在启动HTTP服务器..."
echo "您可以通过以下地址访问应用："
echo "- 本地访问: http://localhost:8000"
echo "- 网络访问: http://$(hostname -I | awk '{print $1}'):8000"
echo ""
echo "按 Ctrl+C 停止服务器"
python3 -m http.server 8000 