<p align="center">
<img height="200" src="./assets/kv.png" alt="vscode-alias-jump">
</p>

<p align="center">
  <strong>🚀 VS Code 智能路径别名导航插件</strong>
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=simonhe.vscode-alias-jump">
    <img src="https://img.shields.io/visual-studio-marketplace/v/simonhe.vscode-alias-jump?color=blue&label=VS%20Code%20Marketplace" alt="Version">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=simonhe.vscode-alias-jump">
    <img src="https://img.shields.io/visual-studio-marketplace/d/simonhe.vscode-alias-jump?color=4BC51D" alt="Downloads">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=simonhe.vscode-alias-jump">
    <img src="https://img.shields.io/visual-studio-marketplace/r/simonhe.vscode-alias-jump?color=yellow" alt="Rating">
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/github/license/Simon-He95/vscode-alias-jump" alt="License">
  </a>
</p>

<p align="center"><a href="./README.md">English</a> | 简体中文</p>

## ✨ 特性

**vscode-alias-jump** 是一个强大的 VS Code 扩展，提供智能的路径别名解析和导航功能。告别使用 `@/components/Button` 这类路径别名时 `Cmd+Click` 导航失效的困扰！

### 🎯 核心能力

- **🔍 智能别名解析** - 自动从 `tsconfig.json` / `jsconfig.json` 解析路径别名
- **⚡️ 多格式支持** - 支持 `import`、`require()`、`import()`、HTML `src` 和 CSS `url()`
- **🔄 热重载** - 配置文件变更时自动刷新（无需重启！）
- **📦 Monorepo 就绪** - 为复杂工作区结构提供按文档的别名解析
- **🎨 多语言支持** - 支持 Vue、React、TypeScript、JavaScript、CSS、SCSS、Less
- **💾 智能缓存** - 智能缓存失效机制，性能最优
- **🔗 多路径识别** - 检测并解析单行中的多个导入路径
- **🎯 精确导航** - 点击你想要导航的确切路径
- **⚡️ 异步 I/O** - 非阻塞文件解析，编辑体验流畅

### 🆚 为什么选择这个插件？

与其他只在根目录工作的别名插件不同，**vscode-alias-jump**：
- ✅ 按文档解析别名（完美支持 monorepo）
- ✅ 支持 `tsconfig` 引用和项目引用
- ✅ 处理多个别名候选项，支持优先级排序
- ✅ 自动检测并剥离查询字符串（`?raw`）和哈希片段
- ✅ 使用异步 I/O 避免阻塞编辑器
- ✅ 提供重试机制确保可靠性

## 📦 安装

1. 打开 VS Code
2. 按 `Ctrl+P` / `Cmd+P`
3. 输入 `ext install simonhe.vscode-alias-jump`
4. 按回车

或在扩展视图中搜索 **"vscode-alias-jump"**。

## 🚀 快速开始

### 1. 配置项目

在 `tsconfig.json` 或 `jsconfig.json` 中添加路径别名：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "~/*": ["src/*"],
      "#components/*": ["src/components/*"],
      "#utils/*": ["src/utils/*"]
    }
  }
}
```

### 2. 开始使用！

扩展激活后会自动工作。只需在任何别名导入上 `Cmd+Click`（macOS）或 `Ctrl+Click`（Windows/Linux）：

```typescript
// ✅ 这些都能用！
import Button from '@/components/Button'
import { helper } from '~/utils/helper'
const Icon = () => import('#components/Icon')
require('@/config/constants')

// ✅ CSS/SCSS 也可以！
@import '@/styles/variables.scss';
background: url('~/assets/logo.png');

// ✅ HTML/Vue 模板
<img src="@/assets/image.png" />
```

## 🎨 支持的文件类型

| 语言 | 扩展名 | 支持 |
|----------|-----------|---------|
| Vue | `.vue` | ✅ |
| TypeScript | `.ts` | ✅ |
| JavaScript | `.js` | ✅ |
| React (JSX) | `.jsx` | ✅ |
| React (TSX) | `.tsx` | ✅ |
| CSS | `.css` | ✅ |
| SCSS | `.scss` | ✅ |
| Less | `.less` | ✅ |

## 🔥 高级功能

### 多个别名候选项

如果你的 `paths` 配置有多个候选项，扩展会按顺序尝试：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*", "lib/*", "packages/*/src/*"]
    }
  }
}
```

### TypeScript 项目引用

扩展会自动跟随 `tsconfig` 引用：

```json
{
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/utils" }
  ]
}
```

### Monorepo 支持

每个文件使用其最近的 `tsconfig.json` / `jsconfig.json`，完美支持多包的 monorepo！

### 配置变更自动重载

当你更新 `tsconfig.json` 或 `jsconfig.json` 时，扩展会自动：
- 🔄 使缓存的别名失效
- 📝 重新加载配置
- 🧹 清理过时的导航缓存

无需手动重启！

## ⚙️ 工作原理

1. **发现** - 为每个文件找到最近的 `tsconfig.json` / `jsconfig.json`
2. **解析** - 提取 `compilerOptions.paths` 并从引用中合并
3. **解析** - 解析别名，支持多个候选项
4. **导航** - 提供 `Cmd+Click` 链接和 `F12` "转到定义"
5. **缓存** - 以文档级粒度智能缓存结果

## 🐛 故障排除

### 别名不工作？

1. ✅ 检查工作区中是否有 `tsconfig.json` 或 `jsconfig.json`
2. ✅ 验证 `paths` 配置是否正确
3. ✅ 确保目标文件存在
4. ✅ 尝试重新加载 VS Code 窗口（`Cmd+R` / `Ctrl+R`）

### 导航到错误的文件？

- 检查是否有多个别名候选项 - 第一个匹配的会生效
- 验证配置中的 `baseUrl` 是否设置正确

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 这个仓库
2. 创建你的特性分支（`git checkout -b feat/amazing-feature`）
3. 提交你的更改（`git commit -m 'feat: add amazing feature'`）
4. 推送到分支（`git push origin feat/amazing-feature`）
5. 开启一个 Pull Request

## 🌱 灵感来源

本项目受 [alias-skip](https://github.com/seolhw/alias-skip) 启发，并增强了许多强大功能以适应现代开发工作流。

## 💖 赞助

如果这个扩展对你有帮助，请考虑请我喝杯咖啡！☕

[❤️ 在 GitHub 上赞助](https://github.com/Simon-He95/sponsor)

## 📄 许可证

[MIT](./LICENSE) © 2024 [Simon He](https://github.com/Simon-He95)

---

<p align="center">用 ❤️ 制作，作者 <a href="https://github.com/Simon-He95">Simon He</a></p>
