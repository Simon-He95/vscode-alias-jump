<p align="center">
<img height="200" src="./assets/kv.png" alt="vscode-alias-jump">
</p>
<p align="center"> English | <a href="./README_zh.md">简体中文</a></p>

## ⚠️ 注意
- 此项目正在开发中，不建议在生产环境中使用。
- 此项目只生效于根目录下配置的tsconfig.json 或 jsconfig.json
- 目前仅支持tsconfig.json 或 jsconfig.json 中的 compilerOptions.paths 配置
- 目前不支持monorepo项目

## 🌰 例子
### 配置完才可对 import '@/xxx' 进行解析, 实现路径映射跳转
```json
{ 
  "compilerOptions": {
    "paths": {
        "@/*": ["src/*"],
        "~/*": ["src/*"]
    }
  }
}

```
### 🌱 灵感来源于[alias-skip](https://github.com/seolhw/alias-skip.git)

## :coffee:
[buy me a cup of coffee](https://github.com/Simon-He95/sponsor)

## License

[MIT](./license)
