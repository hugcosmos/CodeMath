#!/bin/bash

# CodeMath 停止脚本
# 功能：停止运行中的开发服务器

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

# 停止服务器
stop_server() {
    local stopped=false

    # 方法1: 使用 PID 文件
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            log "停止开发服务器 (PID: $pid)..."
            kill "$pid"
            sleep 1

            # 如果进程还在，强制杀死
            if ps -p "$pid" > /dev/null 2>&1; then
                log "强制停止服务器..."
                kill -9 "$pid"
            fi

            stopped=true
        fi
        rm -f "$PID_FILE"
    fi

    # 方法2: 查找并杀死占用 5173 端口的进程
    local port_pid=$(lsof -t -i :5173 2>/dev/null)
    if [ -n "$port_pid" ]; then
        log "停止占用 5173 端口的进程 (PID: $port_pid)..."
        # 不加引号，支持 lsof -t 返回多个 PID
        kill $port_pid 2>/dev/null || true
        sleep 1

        # 如果进程还在，强制杀死
        port_pid=$(lsof -t -i :5173 2>/dev/null || true)
        if [ -n "$port_pid" ]; then
            log "强制停止进程..."
            kill -9 $port_pid 2>/dev/null || true
        fi

        stopped=true
    fi

    # 方法3: 查找本项目目录下的 vite 进程（兜底）
    local vite_pids=$(pgrep -f "vite.*$APP_DIR" 2>/dev/null || true)
    if [ -n "$vite_pids" ]; then
        log "停止 vite 进程..."
        kill $vite_pids 2>/dev/null || true
        sleep 1

        vite_pids=$(pgrep -f "vite.*$APP_DIR" 2>/dev/null || true)
        if [ -n "$vite_pids" ]; then
            log "强制停止 vite 进程..."
            kill -9 $vite_pids 2>/dev/null || true
        fi

        stopped=true
    fi

    echo "$stopped"
}

# 主函数
main() {
    log "=========================================="
    log "CodeMath 停止脚本执行"
    log "=========================================="

    if [ "$(stop_server)" = "true" ]; then
        echo -e "${GREEN}开发服务器已停止${NC}"
        log "服务器已停止"
    else
        echo -e "${YELLOW}没有运行中的开发服务器${NC}"
        log "没有运行中的服务器"
    fi
}

# 执行主函数
main
