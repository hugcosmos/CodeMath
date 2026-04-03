# CodeMath 技术规格文档

## 项目架构

### 技术栈
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **UI组件**: shadcn/ui
- **动画**: GSAP (ScrollTrigger, Flip)
- **3D/Canvas**: Three.js + React Three Fiber (用于主视觉区公式雨)
- **数学公式渲染**: KaTeX
- **代码高亮**: PrismJS
- **平滑滚动**: Lenis

### 项目结构
```
/mnt/okcomputer/output/app/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── ui/             # shadcn/ui 组件
│   │   ├── FormulaRain.tsx # 主视觉区公式雨效果
│   │   ├── CodeBlock.tsx   # 代码展示组件
│   │   ├── ChapterCard.tsx # 章节卡片
│   │   └── MathFormula.tsx # 数学公式组件
│   ├── sections/           # 页面区块
│   │   ├── Hero.tsx        # 主视觉区
│   │   ├── CodePlayground.tsx # 代码游乐场
│   │   ├── ChapterExplorer.tsx # 章节探索器
│   │   ├── VisualLearning.tsx  # 视觉学习
│   │   ├── LearningPath.tsx    # 学习路径
│   │   ├── Testimonials.tsx    # 用户评价
│   │   └── CTAFooter.tsx       # CTA和页脚
│   ├── chapters/           # 各章节交互组件
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
│   │   ├── useScrollProgress.ts
│   │   ├── useMousePosition.ts
│   │   └── useInView.ts
│   ├── lib/                # 工具函数
│   │   ├── utils.ts
│   │   └── math-utils.ts
│   ├── styles/             # 样式文件
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── public/                 # 静态资源
│   └── assets/
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## 组件规格

### 1. FormulaRain (主视觉区背景)
**功能**: WebGL渲染的数学公式粒子效果
**Props**:
- `density: number` - 粒子密度
- `speed: number` - 下落速度
- `opacity: number` - 透明度

**实现**:
- 使用Three.js Points粒子系统
- 粒子纹理为数学符号 (π, ∑, ∫, ∞等)
- 物理模拟：下落、碰撞、堆积、消散

### 2. ChapterCard (章节卡片)
**功能**: 展示章节信息的交互式卡片
**Props**:
- `title: string`
- `description: string`
- `icon: ReactNode`
- `color: string`
- `href: string`

**动画**:
- 悬停：缩放1.05，阴影增强
- 磁性排斥效果
- 图标变形动画

### 3. CodeBlock (代码展示)
**功能**: 带语法高亮的代码块
**Props**:
- `code: string`
- `language: string`
- `runnable: boolean`
- `onRun: () => void`

**动画**:
- 扫描器揭示效果
- 打字机效果
- 行高亮聚焦

## 动画实现规划

| 动画效果 | 库 | 实现方式 | 复杂度 |
|---------|-----|---------|--------|
| 公式雨背景 | Three.js | 自定义着色器粒子系统 | 高 |
| 主标题3D揭示 | GSAP | rotateX + translateY | 中 |
| 副标题解码 | GSAP | 随机字符替换 | 中 |
| 按钮磁性效果 | 原生JS | mousemove事件 + transform | 低 |
| 代码扫描揭示 | GSAP | clip-path动画 | 中 |
| 代码3D倾斜 | GSAP ScrollTrigger | rotateX随滚动变化 | 中 |
| Bento网格扇形展开 | GSAP | rotate + scale | 中 |
| 卡片呼吸动画 | CSS | scale关键帧动画 | 低 |
| 视频快门打开 | GSAP | scaleY + clip-path | 中 |
| 路径SVG绘制 | GSAP DrawSVG | stroke-dashoffset | 中 |
| 评价圆柱旋转 | CSS 3D | rotateY + perspective | 中 |
| 行动召唤文字填充 | GSAP | text-stroke动画 | 中 |

## 各章节交互组件规格

### Chapter 1: 进制转换器
**功能**:
- 十进制/二进制/十六进制实时转换
- 可视化位运算
- 占位符0的动画演示

**技术**:
- 位运算可视化使用Canvas
- 数字转换动画

### Chapter 2: 逻辑门游乐场
**功能**:
- 拖拽式逻辑门放置
- AND/OR/NOT/XOR门
- 真值表生成器
- 卡诺图工具

**技术**:
- 拖拽使用react-dnd
- 电路连接使用SVG
- 灯泡状态动画

### Chapter 3: 星期计算器 & 黑白棋魔术
**功能**:
- 大数星期计算
- 黑白棋魔术游戏
- 奇偶校验可视化

**技术**:
- 模运算计算
- 游戏状态管理
- 校验位动画

### Chapter 4: 多米诺骨牌模拟器
**功能**:
- 多米诺骨牌倒下的动画
- 错误证明展示
- 循环不变式可视化

**技术**:
- 物理引擎模拟
- 步骤高亮
- 错误检测动画

### Chapter 5: 扑克牌实验室
**功能**:
- 植树问题可视化
- 容斥原理韦恩图
- 排列组合计算

**技术**:
- SVG韦恩图
- 拖拽交互
- 公式计算

### Chapter 6: 汉诺塔求解器
**功能**:
- 汉诺塔动画演示
- 递归调用栈可视化
- 分形图形生成

**技术**:
- Canvas动画
- 递归算法
- 调用栈展示

### Chapter 7: 折纸登月
**功能**:
- 折纸厚度增长曲线
- 对数坐标切换
- 二分查找vs线性查找对比

**技术**:
- 图表使用Chart.js
- 坐标轴切换
- 动画演示

### Chapter 8: 停机问题模拟器
**功能**:
- 伪代码编辑器
- 停机检测演示
- 对角论证法动画

**技术**:
- 简单代码解析
- 状态机模拟
- 无限循环检测

### Appendix: 感知器训练场
**功能**:
- 数据点绘制
- 决策边界调整
- 梯度下降可视化

**技术**:
- Canvas交互
- 简单神经网络
- 动画训练过程

## 依赖列表

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "gsap": "^3.12.2",
    "@gsap/react": "^2.0.0",
    "three": "^0.158.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.92.0",
    "katex": "^0.16.9",
    "prismjs": "^1.29.0",
    "lenis": "^1.0.42",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "lucide-react": "latest"
  }
}
```

## 性能优化策略

1. **代码分割**: 每个章节组件懒加载
2. **GPU加速**: 所有动画使用transform3d
3. **粒子优化**: 公式雨使用GPU实例化
4. **滚动优化**: 使用Lenis平滑滚动
5. **响应式降级**: 移动端禁用复杂3D效果

## 响应式断点

- **Desktop**: > 1024px - 完整效果
- **Tablet**: 768px - 1024px - 简化3D
- **Mobile**: < 768px - 基础动画

## 无障碍支持

- `prefers-reduced-motion`: 禁用复杂动画
- 键盘导航支持
- ARIA标签
- 高对比度模式
