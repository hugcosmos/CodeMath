#!/bin/bash

# CodeMath 启动脚本
# 功能：自动检测环境、安装依赖、后台运行开发服务器

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 项目路径
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$SCRIPT_DIR/app"
LOG_DIR="$SCRIPT_DIR/logs"
LOG_FILE="$LOG_DIR/startup.log"
PID_FILE="$LOG_DIR/vite.pid"

# 创建日志目录
mkdir -p "$LOG_DIR"

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# 检查是否在中国大陆
check_china_region() {
    local cn_region=false

    # 检查时区
    if timedatectl 2>/dev/null | grep -q "Asia/Shanghai\|Asia/Chongqing\|Asia/Harbin\|Asia/Urumqi"; then
        cn_region=true
    fi

    # 检查语言环境
    if echo "$LANG" | grep -q "zh_CN"; then
        cn_region=true
    fi

    # 尝试访问淘宝镜像 API (超时2秒)
    if curl -s --connect-timeout 2 --max-time 2 "https://registry.npmmirror.com" > /dev/null 2>&1; then
        cn_region=true
    fi

    echo "$cn_region"
}

# 配置 npm 源
setup_npm_registry() {
    log "检查 npm 源配置..."

    if [ "$(check_china_region)" = "true" ]; then
        log "检测到中国大陆环境，配置淘宝镜像源..."
        npm config set registry https://registry.npmmirror.com
    else
        log "使用 npm 官方源..."
        npm config set registry https://registry.npmjs.org
    fi
}

# 检查依赖是否已安装
check_dependencies() {
    log "检查依赖安装状态..."

    if [ ! -d "$APP_DIR/node_modules" ] || [ ! -d "$APP_DIR/node_modules/react" ]; then
        log "依赖未安装或安装不完整"
        return 1
    fi

    log "依赖已安装"
    return 0
}

# 安装依赖
install_dependencies() {
    log "开始安装依赖..."
    log "项目目录: $APP_DIR"

    cd "$APP_DIR"

    # 配置 npm 源
    setup_npm_registry

    # 安装依赖
    log "执行 npm install..."
    if npm install >> "$LOG_FILE" 2>&1; then
        log "依赖安装成功"
        cd "$SCRIPT_DIR"
        return 0
    else
        log "依赖安装失败"
        cd "$SCRIPT_DIR"
        return 1
    fi
}

# 检查服务器是否已运行
is_server_running() {
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            return 0
        fi
        # PID 文件存在但进程不存在，清理
        rm -f "$PID_FILE"
    fi

    # 检查端口 5173 是否被占用
    if lsof -i :5173 > /dev/null 2>&1; then
        return 0
    fi

    return 1
}

# 启动开发服务器
start_server() {
    log "启动开发服务器..."

    cd "$APP_DIR"

    # 后台运行并重定向输出（直接调用 vite，确保 PID 准确）
    nohup npx vite --host >> "$LOG_FILE" 2>&1 &
    local pid=$!

    # 等待进程启动
    sleep 3

    # 验证进程是否还在运行
    if ps -p "$pid" > /dev/null 2>&1; then
        echo "$pid" > "$PID_FILE"
        log "开发服务器启动成功 (PID: $pid)"
        cd "$SCRIPT_DIR"
        return 0
    else
        log "开发服务器启动失败"
        cd "$SCRIPT_DIR"
        return 1
    fi
}

# 主函数
main() {
    # 清空日志文件
    > "$LOG_FILE"

    log "=========================================="
    log "CodeMath 启动脚本开始执行"
    log "=========================================="

    # 检查服务器是否已运行
    if is_server_running; then
        echo -e "${YELLOW}开发服务器已在运行中${NC}"
        log "服务器已在运行，跳过启动"
        return 0
    fi

    # 检查并安装依赖
    if ! check_dependencies; then
        echo -e "${YELLOW}正在安装依赖，请稍候...${NC}"
        if ! install_dependencies; then
            echo -e "${RED}依赖安装失败，请查看日志: $LOG_FILE${NC}"
            return 1
        fi
        echo -e "${GREEN}依赖安装完成${NC}"
    fi

    # 启动服务器
    echo -e "${YELLOW}正在启动开发服务器...${NC}"
    if start_server; then
        echo ""
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}  CodeMath 开发服务器启动成功！${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo -e "  访问地址: ${GREEN}http://localhost:5173/${NC}"
        echo ""
        echo -e "  日志文件: $LOG_FILE"
        echo -e "  PID 文件: $PID_FILE"
        echo ""
        echo -e "  停止服务器: ${YELLOW}./stop.sh${NC}"
        echo -e "  查看日志:   ${YELLOW}tail -f $LOG_FILE${NC}"
        echo ""
        log "=========================================="
        log "启动脚本执行完成"
        log "=========================================="
    else
        echo -e "${RED}服务器启动失败，请查看日志: $LOG_FILE${NC}"
        return 1
    fi
}

# 执行主函数
main
