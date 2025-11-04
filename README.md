<p align="center">
<img height="200" src="./assets/kv.png" alt="vscode-alias-jump">
</p>

<p align="center">
  <strong>🚀 Smart Path Alias Navigation for VS Code</strong>
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

<p align="center"> English | <a href="./README_zh.md">简体中文</a></p>

## ✨ Features

**vscode-alias-jump** is a powerful VS Code extension that provides intelligent path alias resolution and navigation. Say goodbye to broken `Cmd+Click` navigation when using path aliases like `@/components/Button`!

### 🎯 Core Capabilities

- **🔍 Smart Alias Resolution** - Automatically resolves path aliases from `tsconfig.json` / `jsconfig.json`
- **⚡️ Multi-Format Support** - Works with `import`, `require()`, `import()`, HTML `src`, and CSS `url()`
- **🔄 Hot Reload** - Auto-refreshes when config files change (no restart needed!)
- **📦 Monorepo Ready** - Per-document alias resolution for complex workspace structures
- **🎨 Multi-Language** - Supports Vue, React, TypeScript, JavaScript, CSS, SCSS, Less
- **💾 Smart Caching** - Intelligent cache invalidation for optimal performance
- **🔗 Multiple Paths** - Detects and resolves multiple import paths in a single line
- **🎯 Precise Navigation** - Click exactly on the path you want to navigate to
- **⚡️ Async I/O** - Non-blocking file resolution for smooth editing experience

### 🆚 Why Choose This Over Others?

Unlike other alias extensions that only work at the root level, **vscode-alias-jump**:
- ✅ Resolves aliases per-document (perfect for monorepos)
- ✅ Supports `tsconfig` references and project references
- ✅ Handles multiple alias candidates with priority order
- ✅ Auto-detects and strips query strings (`?raw`) and hash fragments
- ✅ Uses async I/O to avoid blocking the editor
- ✅ Provides retry mechanism for reliability

## 📦 Installation

1. Open VS Code
2. Press `Ctrl+P` / `Cmd+P`
3. Type `ext install simonhe.vscode-alias-jump`
4. Press Enter

Or search for **"vscode-alias-jump"** in the Extensions view.

## 🚀 Quick Start

### 1. Configure Your Project

Add path aliases to your `tsconfig.json` or `jsconfig.json`:

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

### 2. Start Using!

The extension works automatically once activated. Just `Cmd+Click` (macOS) or `Ctrl+Click` (Windows/Linux) on any aliased import:

```typescript
// ✅ All of these work!
import Button from '@/components/Button'
import { helper } from '~/utils/helper'
const Icon = () => import('#components/Icon')
require('@/config/constants')

// ✅ CSS/SCSS too!
@import '@/styles/variables.scss';
background: url('~/assets/logo.png');

// ✅ HTML/Vue templates
<img src="@/assets/image.png" />
```

## � Supported File Types

| Language | Extension | Support |
|----------|-----------|---------|
| Vue | `.vue` | ✅ |
| TypeScript | `.ts` | ✅ |
| JavaScript | `.js` | ✅ |
| React (JSX) | `.jsx` | ✅ |
| React (TSX) | `.tsx` | ✅ |
| CSS | `.css` | ✅ |
| SCSS | `.scss` | ✅ |
| Less | `.less` | ✅ |

## 🔥 Advanced Features

### Multiple Alias Candidates

If your `paths` config has multiple candidates, the extension will try them in order:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*", "lib/*", "packages/*/src/*"]
    }
  }
}
```

### TypeScript Project References

The extension automatically follows `tsconfig` references:

```json
{
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/utils" }
  ]
}
```

### Monorepo Support

Each file uses its nearest `tsconfig.json` / `jsconfig.json`, making it perfect for monorepos with multiple packages!

### Auto-Reload on Config Changes

When you update `tsconfig.json` or `jsconfig.json`, the extension automatically:
- 🔄 Invalidates cached aliases
- 📝 Reloads the configuration
- 🧹 Clears outdated navigation cache

No manual restart required!

## ⚙️ How It Works

1. **Discovery** - Finds the nearest `tsconfig.json` / `jsconfig.json` for each file
2. **Parsing** - Extracts `compilerOptions.paths` and merges from references
3. **Resolution** - Resolves aliases with support for multiple candidates
4. **Navigation** - Provides `Cmd+Click` links and `F12` "Go to Definition"
5. **Caching** - Intelligently caches results with document-level granularity

## 🐛 Troubleshooting

### Aliases not working?

1. ✅ Check that you have a `tsconfig.json` or `jsconfig.json` in your workspace
2. ✅ Verify the `paths` configuration is correct
3. ✅ Make sure the target files exist
4. ✅ Try reloading VS Code window (`Cmd+R` / `Ctrl+R`)

### Navigation goes to wrong file?

- Check if you have multiple alias candidates - the first match wins
- Verify your `baseUrl` is set correctly in the config

## 🤝 Contributing

Issues and pull requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## 🌱 Inspiration

This project is inspired by [alias-skip](https://github.com/seolhw/alias-skip) and enhanced with many powerful features for modern development workflows.

## 💖 Sponsor

If this extension helps you, consider buying me a coffee! ☕

[❤️ Sponsor on GitHub](https://github.com/Simon-He95/sponsor)

## 📄 License

[MIT](./LICENSE) © 2024 [Simon He](https://github.com/Simon-He95)

---

<p align="center">Made with ❤️ by <a href="https://github.com/Simon-He95">Simon He</a></p>
