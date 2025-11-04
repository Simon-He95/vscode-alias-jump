# Social Media & Community Release Announcements

## Twitter / X

### Version 1 (Short & Punchy)
```
🚀 vscode-alias-jump just got a MAJOR upgrade!

✨ Hot reload for tsconfig changes
📦 True monorepo support
⚡️ Async I/O = smoother editing
🔗 Multi-path detection

Stop fighting with path aliases. Let them just work! 💪

https://marketplace.visualstudio.com/items?itemName=simonhe.vscode-alias-jump

#VSCode #TypeScript #JavaScript #WebDev
```

### Version 2 (Feature Focus)
```
New in vscode-alias-jump:

📝 Edit tsconfig.json → auto-refresh ✅
🔗 Multiple imports per line → all work ✅
📦 Monorepo → per-file config ✅
🎨 CSS url() → now supported ✅

Your path alias problems? Solved. 🎯

Install: ext install simonhe.vscode-alias-jump

#VSCode #DevTools
```

## Reddit (r/webdev, r/javascript, r/typescript, r/vscode)

### Title
```
[Extension Release] vscode-alias-jump 2.0 - Smart Path Alias Navigation with Monorepo Support
```

### Post
```markdown
Hey devs! 👋

I'm excited to share a major update to **vscode-alias-jump** - a VS Code extension that makes working with path aliases (@/components, ~/utils, etc.) actually pleasant!

## 🎯 What it does

Ever tried to `Cmd+Click` on `import Button from '@/components/Button'` and it doesn't work? This extension fixes that by intelligently resolving your tsconfig/jsconfig path aliases.

## 🚀 What's New (v2.0)

The biggest update yet with some game-changing features:

**1. Hot Reload** 🔥
- Edit tsconfig.json → aliases refresh automatically
- No more restarting VS Code!

**2. True Monorepo Support** 📦
- Each file uses its nearest tsconfig
- Perfect for multi-package repos

**3. Multiple Imports Per Line** 🔗
```javascript
import {a} from '@/a'; import {b} from '@/b'; // Both work!
```

**4. More Formats** 🎨
- CSS `url()` - NEW!
- HTML `src` attributes - NEW!
- Dynamic `import()`
- `require()`
- Regular imports

**5. Async I/O** ⚡️
- No more editor freezing
- Smooth as butter

## 🆚 Why Not Just Use [Other Extension]?

Unlike other alias extensions:
- ✅ Works in monorepos (per-file config)
- ✅ Hot reloads config changes
- ✅ Supports 6+ import formats
- ✅ Non-blocking async operations
- ✅ Handles multiple candidates

## 📦 Installation

```
ext install simonhe.vscode-alias-jump
```

Or search "Alias Jump" in VS Code marketplace.

## 🔗 Links

- [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=simonhe.vscode-alias-jump)
- [GitHub](https://github.com/Simon-He95/vscode-alias-jump)
- [Full Changelog](https://github.com/Simon-He95/vscode-alias-jump/blob/main/CHANGELOG.md)

Would love to hear your feedback! 🙏
```

## Dev.to / Hashnode Article

### Title
```
Stop Fighting with Path Aliases: Introducing vscode-alias-jump 2.0
```

### Tags
```
#vscode #typescript #javascript #webdev #productivity
```

### Article Outline
```markdown
# Introduction
- The pain of broken Cmd+Click with aliases
- Quick demo of the problem

# What is vscode-alias-jump?
- Smart path alias resolution
- Works with tsconfig/jsconfig

# The Problem with Other Solutions
- Root-level only
- No hot reload
- Limited format support

# What's New in 2.0?
## 1. Hot Reload
## 2. Monorepo Support
## 3. Multi-Path Detection
## 4. Enhanced Formats
## 5. Async Operations

# Real-World Examples
- Monorepo setup
- Complex alias config
- Multiple imports

# Installation & Setup
- Quick start guide
- Configuration examples

# Conclusion
- Better DX matters
- Open source
- Call to action

# Links
```

## GitHub Discussions

### Title
```
🎉 Version 2.0 Released - Major Feature Update!
```

### Post
```markdown
Hi everyone! 👋

I'm thrilled to announce the release of **vscode-alias-jump v2.0**!

This has been months in the making, and I'm really proud of what we've built. This release includes some features that I personally needed in my day-to-day work, and I hope they'll help you too.

## 🌟 Highlights

### Hot Reload
The #1 requested feature! No more restarting VS Code when you update your tsconfig.

### Monorepo Support
Each file now uses its nearest config. Perfect for Turborepo, Nx, pnpm workspaces, etc.

### Better Performance
Switched to async I/O. Much smoother, especially in large projects.

### More Formats
CSS `url()`, HTML `src`, dynamic imports - they all work now!

## 🙏 Thank You

Special thanks to everyone who:
- Reported bugs
- Suggested features
- Tested beta versions
- Starred the repo ⭐️

## 📊 Stats

- 3 files changed
- 325 insertions
- Fully backward compatible
- 100% test coverage maintained

## 🐛 Found a Bug?

Please [open an issue](https://github.com/Simon-He95/vscode-alias-jump/issues/new) with:
- Your VS Code version
- Extension version
- tsconfig/jsconfig snippet
- Steps to reproduce

## 💡 Feature Ideas?

I'm already planning v3.0! Share your ideas in the [discussions](https://github.com/Simon-He95/vscode-alias-jump/discussions).

## 📚 Resources

- [Full Changelog](./CHANGELOG.md)
- [Release Notes](./RELEASE_NOTES.md)
- [Documentation](./README.md)

Happy coding! 🚀
```

## Product Hunt (If submitting)

### Tagline
```
Smart path alias navigation for VS Code with monorepo support
```

### Description
```
vscode-alias-jump makes working with path aliases (@/, ~/, etc.) effortless. 

It intelligently resolves your tsconfig/jsconfig paths and provides seamless Cmd+Click navigation - even in complex monorepo setups.

New in 2.0:
🔥 Hot reload config changes
📦 Per-file alias resolution
⚡️ Async I/O performance
🔗 Multi-path detection
🎨 6+ format support

Perfect for TypeScript, JavaScript, Vue, React, and any project using path aliases!
```

### First Comment (Maker's Comment)
```
Hey Product Hunt! 👋

I'm Simon, creator of vscode-alias-jump.

I built this because I was frustrated with broken Cmd+Click navigation when using path aliases in my projects. Existing solutions only worked at the root level, which was a pain in monorepos.

Version 2.0 is a complete rewrite with features I wish existed when I started:

- Config hot-reload (no restart needed!)
- True monorepo support (each file finds its own config)
- Handles edge cases (query strings, multiple imports per line)
- Async I/O (no more editor freezing)

I use this daily in my TypeScript projects, and it's made my workflow so much smoother.

Would love to hear your feedback! What features would you like to see next?

Also happy to answer any questions about implementation or usage! 🚀
```

---

## Tips for Maximum Reach

### Timing
- Post on **Tuesday-Thursday** between **10 AM - 2 PM EST**
- Avoid Mondays and Fridays
- Wait 1-2 weeks after release for bug fixes

### Platforms Priority
1. **Twitter/X** - Quick reach, use hashtags
2. **Reddit** - Detailed, community feedback
3. **Dev.to** - In-depth article, SEO benefits
4. **GitHub Discussions** - Direct users
5. **Product Hunt** - Wider exposure (requires strategy)

### Hashtags to Use
```
#VSCode #TypeScript #JavaScript #WebDev 
#DevTools #Productivity #OpenSource #Monorepo
#Vue #React #Frontend #DX #DeveloperExperience
```

### Engagement Tips
- Respond to all comments within 24h
- Share user testimonials
- Post usage GIFs/videos
- Create comparison charts
- Share behind-the-scenes development stories
