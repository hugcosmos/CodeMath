# CodeMath

<p align="center">
  <b>🎮 通过交互与可视化，探索计算机科学中的数学概念</b>
</p>

<p align="center">
  <b>🇨🇳 中文</b> | <a href="README.md">🇺🇸 English</a>
</p>

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript" alt="TypeScript"></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite" alt="Vite"></a>
  <a href="https://threejs.org/"><img src="https://img.shields.io/badge/Three.js-WebGL-000000?logo=three.js" alt="Three.js"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License"></a>
</p>

---

## 简介

CodeMath 是一个基于 React + TypeScript 构建的交互式数学学习平台，通过丰富的动画、3D 效果和交互式演示，帮助学习者理解计算机科学中的核心数学概念。

---

## 技术栈

| 技术 | 用途 |
|------|------|
| React 19 | 前端框架 |
| TypeScript | 类型安全 |
| Vite | 构建工具 |
| Tailwind CSS | 样式 |
| shadcn/ui | UI 组件 |
| GSAP | 动画 |
| Three.js | 3D 渲染 |
| KaTeX | 数学公式 |
| Lenis | 平滑滚动 |

---

## 快速开始

### 一键启动

```bash
cd CodeMaths
./start.sh
```

访问：**http://localhost:5173/**

### 停止服务

```bash
./stop.sh
```

### 查看日志

```bash
tail -f logs/startup.log
```

---

## 启动脚本功能

| 功能 | 说明 |
|------|------|
| 🌏 智能镜像源 | 自动检测中国大陆环境，切换淘宝 npm 镜像 |
| 📦 自动安装 | 首次运行自动安装所有依赖 |
| 🔄 后台运行 | 服务器在后台运行，不占用终端 |
| 📝 日志记录 | 所有输出写入 `logs/startup.log` |
| 🔒 进程管理 | 自动检测重复启动，PID 保存在 `logs/vite.pid` |

---

## 项目结构

```
CodeMaths/
├── app/                    # 主应用目录
│   ├── src/
│   │   ├── components/     # 可复用组件
│   │   ├── sections/       # 页面区块
│   │   ├── chapters/       # 各章节交互组件
│   │   ├── hooks/          # 自定义 Hooks
│   │   ├── lib/            # 工具函数
│   │   └── i18n/           # 国际化配置
│   ├── package.json
│   └── vite.config.ts
├── logs/                   # 日志文件目录
├── start.sh                # 启动脚本 ⭐
├── stop.sh                 # 停止脚本 ⭐
├── README.md               # 项目说明（英文）
└── tech-spec.md            # 技术规格文档
```

---

## 学习章节

| 章节 | 主题 | 交互内容 |
|:---:|:---|:---|
| Ch.1 | 0 的故事 | 进制转换器、位运算可视化 |
| Ch.2 | 逻辑 | 逻辑门游乐场、真值表生成器 |
| Ch.3 | 余数 | 星期计算器、黑白棋魔术 |
| Ch.4 | 数学归纳法 | 多米诺骨牌模拟器 |
| Ch.5 | 排列组合 | 扑克牌实验室、韦恩图 |
| Ch.6 | 递归 | 汉诺塔求解器、分形图形 |
| Ch.7 | 指数爆炸 | 折纸登月、二分查找对比 |
| Ch.8 | 不可解问题 | 停机问题模拟器 |
| 附录 | 机器学习 | 感知器训练场 |

---

## 手动安装

```bash
cd app
npm install
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览生产构建
```

---

## 国际化

本项目支持中英文双语切换。语言文件位于 `app/src/i18n/` 目录。

---

## 常见问题

**Q: 端口 5173 被占用怎么办？**

A: 运行 `./stop.sh` 停止已有进程，或手动修改 `app/vite.config.ts` 中的端口配置。

**Q: 如何切换 npm 源？**

A: 脚本会自动检测环境。手动切换：
```bash
npm config set registry https://registry.npmmirror.com  # 淘宝镜像
npm config set registry https://registry.npmjs.org       # 官方源
```

**Q: 依赖安装失败？**

A: 删除 `app/node_modules` 和 `app/package-lock.json`，重新运行 `./start.sh`。

---

## 致谢

本项目灵感来源于 [结城浩](https://www.hyuki.com/) 的著作《程序员的数学》。章节主题和学习路径参考了该书的内容结构，但所有代码实现、交互组件和可视化均为原创。

---

## 许可证

[MIT](LICENSE)

---

<p align="center">
  💡 <b>数学不应该只是公式和定理，而应该是可触摸、可探索的体验。</b>
</p>
