# Changelog

All notable changes to the "vscode-alias-jump" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 🎉 Major Feature Release

This release includes a complete overhaul of the extension with significant improvements and new features!

### ✨ Added

- **Retry Mechanism**: Automatic retry with exponential backoff when alias loading fails
- **Hot Reload**: Watch `tsconfig.json` / `jsconfig.json` changes and auto-refresh alias maps
- **Per-Document Resolution**: Each document uses its nearest config file (perfect for monorepo!)
- **Multi-URL Detection**: Extract and resolve multiple import/require paths in a single line
- **Multi-Candidate Alias**: Support multiple path candidates with priority order resolution
- **Enhanced Path Recognition**: Support for:
  - `import` statements
  - `require()` calls
  - Dynamic `import()` 
  - HTML `src` attributes
  - CSS `url()` functions
- **TypeScript React Support**: Added `.tsx` file support
- **Async I/O**: Non-blocking file resolution for smoother editing experience
- **Query/Hash Stripping**: Automatically strip `?raw`, `#fragment` from URLs before resolution
- **Cache Refinement**: Document + line + aliasUrl granularity to avoid conflicts
- **Project References**: Support `tsconfig` references as directory paths

### 🔧 Changed

- Improved relative path resolution using `path.dirname` instead of string concatenation
- Enhanced cache invalidation strategy with document-level tracking
- Optimized alias loading to be on-demand instead of upfront
- Better error handling with try-catch blocks and safe fallbacks

### 🐛 Fixed

- Fixed cache collision when same alias URL appears in different documents
- Fixed relative path resolution edge cases
- Fixed issues with `tsconfig` references pointing to directories
- Fixed multiple imports on same line only detecting the first one

### 🚀 Performance

- Switched from synchronous to asynchronous file I/O
- Implemented smart caching with precise invalidation
- Reduced memory footprint with on-demand alias loading

### 📝 Documentation

- Comprehensive README with feature highlights
- Added Chinese README (README_zh.md)
- Enhanced package.json metadata with keywords and better description

## [0.0.10] - Previous Release

### Initial Features

- Basic path alias resolution from `tsconfig.json` / `jsconfig.json`
- Support for `compilerOptions.paths` configuration
- Cmd+Click navigation for aliased imports
- Support for Vue, JavaScript, TypeScript, CSS, SCSS, Less files

---

## Upgrade Guide

If you're upgrading from version 0.0.10 or earlier, you'll automatically get all the new features! No configuration changes required.

### What to expect:

1. **Automatic Config Reload**: Your editor will now automatically detect changes to tsconfig/jsconfig files
2. **Better Monorepo Support**: Each file will use its nearest config file
3. **More Path Formats**: CSS `url()` and HTML `src` will now work
4. **Improved Performance**: Less blocking, smoother editing experience

### Breaking Changes

None! This release is fully backward compatible.

---

**Note**: Dates will be added when versions are officially released.
