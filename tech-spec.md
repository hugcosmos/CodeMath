# CodeMath 技术规格文档

## 项目架构

### 技术栈
- **框架**: React 19 + TypeScript 5.9
- **构建工具**: Vite 7
- **样式**: Tailwind CSS 3.4
- **UI组件**: shadcn/ui + Radix UI
- **动画**: GSAP 3.14 + @gsap/react
- **3D/Canvas**: Three.js 0.183 + React Three Fiber 9 + Drei 10
- **数学公式渲染**: KaTeX 0.16
- **代码高亮**: PrismJS 1.30
- **平滑滚动**: Lenis 1.3
- **图表**: Chart.js 4.5 + Recharts 2.15
- **国际化**: i18next 26 + react-i18next 17
- **表单**: React Hook Form 7.70 + Zod 4.3

### 项目结构
```
app/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── ui/             # shadcn/ui 组件 (54个组件)
│   │   └── LanguageSwitcher.tsx  # 语言切换组件
│   ├── sections/           # 页面区块
│   │   ├── Hero.tsx        # 主视觉区
│   │   ├── ChapterExplorer.tsx   # 章节探索器
│   │   ├── LearningPath.tsx      # 学习路径
│   │   └── CTAFooter.tsx         # CTA和页脚
│   ├── chapters/           # 各章节内容组件
│   │   ├── Chapter1/       # 0的故事
│   │   ├── Chapter2/       # 逻辑
│   │   ├── Chapter3/       # 余数
│   │   ├── Chapter4/       # 数学归纳法
│   │   ├── Chapter5/       # 排列组合
│   │   ├── Chapter6/       # 递归
│   │   ├── Chapter7/       # 指数爆炸
│   │   ├── Chapter8/       # 不可解问题
│   │   └── Appendix/       # 机器学习附录
│   ├── hooks/              # 自定义Hooks
│   │   └── use-mobile.ts   # 移动端检测
│   ├── i18n/               # 国际化配置
│   │   ├── index.ts        # i18n初始化
│   │   └── locales/
│   │       ├── en.json     # 英文翻译
│   │       └── zh-CN.json  # 中文翻译
│   ├── lib/                # 工具函数
│   │   └── utils.ts        # 通用工具 (cn函数等)
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx            # 入口文件
│   ├── App.css             # 应用样式
│   └── index.css           # 全局样式 + Tailwind
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## 主要组件

### LanguageSwitcher
**功能**: 中英文语言切换
**实现**:
- 使用 i18next 切换语言
- 检测当前语言状态
- 触发页面文本重渲染

## 页面区块 (Sections)

### Hero
**功能**: 主视觉区，项目介绍和入口
**内容**:
- 项目标题和副标题
- 主要功能介绍
- 开始按钮

### ChapterExplorer
**功能**: 章节探索器，展示所有学习章节
**内容**:
- 8个主要章节 + 附录
- 章节卡片网格布局
- 每个章节包含：图标、标题、描述、交互内容预览

### LearningPath
**功能**: 学习路径展示
**内容**:
- 推荐学习顺序
- 章节依赖关系图
- 进度追踪 (待实现)

### CTAFooter
**功能**: 行动召唤和页脚
**内容**:
- 开始学习的CTA
- 许可证信息
- 致谢和版权声明

## 各章节组件

所有章节组件目前为占位实现：

| 章节 | 组件 | 状态 |
|------|------|------|
| Ch.1 | Chapter1Content.tsx | 占位符 |
| Ch.2 | Chapter2Content.tsx | 占位符 |
| Ch.3 | Chapter3Content.tsx | 占位符 |
| Ch.4 | Chapter4Content.tsx | 占位符 |
| Ch.5 | Chapter5Content.tsx | 占位符 |
| Ch.6 | Chapter6Content.tsx | 占位符 |
| Ch.7 | Chapter7Content.tsx | 占位符 |
| Ch.8 | Chapter8Content.tsx | 占位符 |
| Appendix | AppendixContent.tsx | 占位符 |

## 国际化 (i18n)

### 配置
- **库**: i18next + react-i18next + i18next-browser-languagedetector
- **语言**: 中文 (zh-CN)、英文 (en)
- **默认语言**: 中文
- **检测**: 自动检测浏览器语言

### 翻译文件结构
```json
{
  "title": "项目标题",
  "description": "项目描述",
  "chapters": {
    "ch1": { "title": "", "description": "" },
    ...
  }
}
```

## 依赖列表

### 核心依赖
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "typescript": "~5.9.3",
  "vite": "^7.2.4"
}
```

### UI/样式
```json
{
  "tailwindcss": "^3.4.19",
  "@radix-ui/*": "各种组件",
  "class-variance-authority": "^0.7.1",
  "tailwind-merge": "^3.4.0",
  "lucide-react": "^0.562.0"
}
```

### 动画/3D
```json
{
  "gsap": "^3.14.2",
  "@gsap/react": "^2.1.2",
  "three": "^0.183.2",
  "@react-three/fiber": "^9.5.0",
  "@react-three/drei": "^10.7.7",
  "lenis": "^1.3.21"
}
```

### 数据/图表
```json
{
  "chart.js": "^4.5.1",
  "react-chartjs-2": "^5.3.1",
  "recharts": "^2.15.4"
}
```

### 国际化
```json
{
  "i18next": "^26.0.3",
  "react-i18next": "^17.0.2",
  "i18next-browser-languagedetector": "^8.2.1"
}
```

### 表单/验证
```json
{
  "react-hook-form": "^7.70.0",
  "@hookform/resolvers": "^5.2.2",
  "zod": "^4.3.5"
}
```

### 其他工具
```json
{
  "katex": "^0.16.44",
  "prismjs": "^1.30.0",
  "date-fns": "^4.1.0",
  "sonner": "^2.0.7"
}
```

## 性能优化策略

1. **代码分割**: Vite 自动代码分割
2. **Tree Shaking**: 移除未使用代码
3. **懒加载**: 章节组件可按需加载
4. **响应式**: Tailwind 断点优化移动端体验
5. **图片优化**: 建议使用 WebP 格式

## 响应式断点

- **Desktop**: > 1024px - 完整布局
- **Tablet**: 768px - 1024px - 适配平板
- **Mobile**: < 768px - 单列布局

## 无障碍支持

- shadcn/ui 组件内置 ARIA 支持
- 键盘导航支持
- `prefers-reduced-motion` 媒体查询支持

## 开发规范

### 组件命名
- PascalCase: `ChapterExplorer.tsx`
- 功能组件 + Section 后缀

### 文件组织
- 组件与样式分离
- 通用工具放入 `lib/`
- 页面区块放入 `sections/`
