# CodeMath

<p align="center">
  <b>🎮 通过交互与可视化，探索计算机科学中的数学概念</b><br>
  <b>🎮 Explore computer science mathematics through interaction & visualization</b>
</p>

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript" alt="TypeScript"></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite" alt="Vite"></a>
  <a href="https://threejs.org/"><img src="https://img.shields.io/badge/Three.js-WebGL-000000?logo=three.js" alt="Three.js"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License"></a>
</p>

---

## 简介 | Introduction

**中文**: CodeMath 是一个基于 React + TypeScript 构建的交互式数学学习平台，通过丰富的动画、3D 效果和交互式演示，帮助学习者理解计算机科学中的核心数学概念。

**English**: CodeMath is an interactive math learning platform built with React + TypeScript. Through rich animations, 3D effects, and interactive demonstrations, it helps learners understand core mathematical concepts in computer science.

---

## 技术栈 | Tech Stack

| 技术 | Tech | 用途 | Usage |
|-----|------|-----|-------|
| React 19 | React 19 | 前端框架 | Frontend Framework |
| TypeScript | TypeScript | 类型安全 | Type Safety |
| Vite | Vite | 构建工具 | Build Tool |
| Tailwind CSS | Tailwind CSS | 样式 | Styling |
| shadcn/ui | shadcn/ui | UI 组件 | UI Components |
| GSAP | GSAP | 动画 | Animation |
| Three.js | Three.js | 3D 渲染 | 3D Rendering |
| KaTeX | KaTeX | 数学公式 | Math Formulas |
| Lenis | Lenis | 平滑滚动 | Smooth Scroll |

---

## 快速开始 | Quick Start

### 一键启动 | One-Click Start

```bash
cd CodeMaths
./start.sh
```

启动成功后访问 | Visit: **http://localhost:5173/**

### 停止服务 | Stop Service

```bash
./stop.sh
```

### 查看日志 | View Logs

```bash
tail -f logs/startup.log
```

---

## 启动脚本功能 | Startup Script Features

| 功能 | Feature | 说明 | Description |
|------|---------|-----|-------------|
| 🌏 智能镜像源 | Smart Registry | 自动检测中国大陆环境，切换淘宝 npm 镜像 | Auto-detect China mainland, switch to Taobao npm registry |
| 📦 自动安装 | Auto Install | 首次运行自动安装所有依赖 | Auto-install dependencies on first run |
| 🔄 后台运行 | Background Run | 服务器在后台运行，不占用终端 | Run server in background |
| 📝 日志记录 | Logging | 所有输出写入 `logs/startup.log` | All output to `logs/startup.log` |
| 🔒 进程管理 | Process Management | 自动检测重复启动，PID 保存在 `logs/vite.pid` | Auto-detect duplicate starts, PID saved to `logs/vite.pid` |

---

## 项目结构 | Project Structure

```
CodeMaths/
├── app/                    # 主应用目录 | Main application
│   ├── src/
│   │   ├── components/     # 可复用组件 | Reusable components
│   │   ├── sections/       # 页面区块 | Page sections
│   │   ├── chapters/       # 各章节交互组件 | Chapter interactives
│   │   ├── hooks/          # 自定义 Hooks | Custom hooks
│   │   ├── lib/            # 工具函数 | Utilities
│   │   └── i18n/           # 国际化配置 | i18n configuration
│   ├── package.json
│   └── vite.config.ts
├── logs/                   # 日志文件目录 | Logs directory
├── start.sh                # 启动脚本 ⭐ | Start script
├── stop.sh                 # 停止脚本 ⭐ | Stop script
├── README.md               # 项目说明 | Project README
└── tech-spec.md            # 技术规格文档 | Tech specification
```

---

## 学习章节 | Learning Chapters

| 章节 | Chapter | 主题 | Topic | 交互内容 | Interactive Content |
|:---:|:---:|:---|:---|:---|:---|
| 1 | Ch.1 | 0 的故事 | The Story of Zero | 进制转换器、位运算可视化 | Base converter, bitwise visualization |
| 2 | Ch.2 | 逻辑 | Logic | 逻辑门游乐场、真值表生成器 | Logic gate playground, truth table generator |
| 3 | Ch.3 | 余数 | Remainders | 星期计算器、黑白棋魔术 | Day calculator, chess magic trick |
| 4 | Ch.4 | 数学归纳法 | Mathematical Induction | 多米诺骨牌模拟器 | Domino simulator |
| 5 | Ch.5 | 排列组合 | Permutations & Combinations | 扑克牌实验室、韦恩图 | Card lab, Venn diagrams |
| 6 | Ch.6 | 递归 | Recursion | 汉诺塔求解器、分形图形 | Tower of Hanoi, fractals |
| 7 | Ch.7 | 指数爆炸 | Exponential Explosion | 折纸登月、二分查找对比 | Paper folding, binary vs linear search |
| 8 | Ch.8 | 不可解问题 | Unsolvable Problems | 停机问题模拟器 | Halting problem simulator |
| 附录 | Appendix | 机器学习 | Machine Learning | 感知器训练场 | Perceptron training ground |

---

## 手动安装 | Manual Installation

```bash
cd app
npm install
npm run dev      # 启动开发服务器 | Start dev server
npm run build    # 构建生产版本 | Build for production
npm run preview  # 预览生产构建 | Preview production build
```

---

## 国际化 | Internationalization

本项目支持中英文双语切换。语言文件位于 `app/src/i18n/` 目录。

This project supports Chinese/English bilingual switching. Language files are located in `app/src/i18n/`.

---

## 常见问题 | FAQ

**Q: 端口 5173 被占用怎么办？ / What if port 5173 is occupied?**

A: 运行 `./stop.sh` 停止已有进程，或手动修改 `app/vite.config.ts` 中的端口配置。
   Run `./stop.sh` to stop existing process, or manually change port in `app/vite.config.ts`.

**Q: 如何切换 npm 源？ / How to switch npm registry?**

A: 脚本会自动检测环境。手动切换 / Script auto-detects environment. Manual switch:
```bash
npm config set registry https://registry.npmmirror.com  # 淘宝镜像 | Taobao
npm config set registry https://registry.npmjs.org       # 官方源 | Official
```

**Q: 依赖安装失败？ / Dependency installation failed?**

A: 删除 `app/node_modules` 和 `app/package-lock.json`，重新运行 `./start.sh`。
   Delete `app/node_modules` and `app/package-lock.json`, then re-run `./start.sh`.

---

## 致谢 | Acknowledgments

本项目灵感来源于 [结城浩](https://www.hyuki.com/) 的著作《程序员的数学》。章节主题和学习路径参考了该书的内容结构，但所有代码实现、交互组件和可视化均为原创。

This project is inspired by the book "Mathematics for Programmers" (程序员的数学) by [Hiroshi Yuki](https://www.hyuki.com/). The chapter topics and learning path are based on the book's structure, while all code implementations, interactive components, and visualizations are original work.

## 许可证 | License

[MIT](LICENSE)

---

> **免责声明**：CodeMath 是一个独立开发的开源教育项目，与《程序员的数学》出版社及作者无官方关联。项目代码采用 MIT 许可证，仅供学习交流使用。

---

<p align="center">
  💡 <b>数学不应该只是公式和定理，而应该是可触摸、可探索的体验。</b><br>
  💡 <b>Math shouldn't be just formulas and theorems — it should be tangible and explorable.</b>
</p>
