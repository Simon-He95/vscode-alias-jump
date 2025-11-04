import path from 'node:path'
import * as vscode from 'vscode'
import { findAliasExtensionsAsync, getAlias, getConfigPathForFile, getRootUrl, getUrls, invalidateAliasCache } from './utils'

// todo: 支持monorepo
export function activate(context: vscode.ExtensionContext) {
  const rootUrl = getRootUrl()
  if (!rootUrl)
    return

  // 结果缓存，细化到文档 + 行 + aliasUrl
  const cacheMap = new Map<string, { columnStart: number, columnEnd: number, result: vscode.LocationLink[] } | undefined>()

  const cacheKeyOf = (document: vscode.TextDocument, aliasUrl: string, line: number) => `${document.uri.toString()}|${line}|${aliasUrl}`

  async function loadAliasForDocument(document: vscode.TextDocument, withRetry = false) {
    const configPath = await getConfigPathForFile(document.uri.fsPath)
    if (!configPath)
      return {}
    if (!withRetry)
      return (await getAlias(configPath)) || {}
    const max = 3
    let delay = 200
    for (let i = 0; i < max; i++) {
      const map = await getAlias(configPath)
      if (map)
        return map
      await new Promise(r => setTimeout(r, delay))
      delay *= 2
    }
    return {}
  }

  function stripQueryHash(u: string) {
    const q = u.indexOf('?')
    const h = u.indexOf('#')
    const cut = [q, h].filter(x => x >= 0)
    if (!cut.length)
      return u
    const i = Math.min(...cut)
    return u.slice(0, i)
  }

  async function resolveAbsolute(document: vscode.TextDocument, aliasUrl: string, currentAliasMap: Record<string, string | string[]>): Promise<string> {
    aliasUrl = stripQueryHash(aliasUrl)
    const alias = aliasUrl.split('/')[0]
    let absolutePath = ''

    if (alias[0] === '.') {
      // 如果最后一段包含扩展名则跳过
      if (aliasUrl.split('/').slice(-1)[0].includes('.'))
        return ''
      absolutePath = await findAliasExtensionsAsync(path.resolve(path.dirname(document.uri.fsPath), aliasUrl))
    }
    else {
      const aliasName = currentAliasMap[alias]
      if (!aliasName)
        return ''
      const bases = Array.isArray(aliasName) ? aliasName : [aliasName]
      for (const base of bases) {
        const abs = await findAliasExtensionsAsync(aliasUrl.replace(alias, path.resolve(rootUrl!, base)))
        if (abs) {
          absolutePath = abs
          break
        }
      }
    }
    return absolutePath
  }

  // 添加 DocumentLinkProvider 来修正 Cmd+Click 跳转
  const linkProvider = vscode.languages.registerDocumentLinkProvider([
    { scheme: 'file', language: 'vue' },
    { scheme: 'file', language: 'scss' },
    { scheme: 'file', language: 'css' },
    { scheme: 'file', language: 'less' },
    { scheme: 'file', language: 'javascript' },
    { scheme: 'file', language: 'typescript' },
    { scheme: 'file', language: 'javascriptreact' },
    { scheme: 'file', language: 'typescriptreact' },
  ], {
    async provideDocumentLinks(document) {
      const currentAliasMap = await loadAliasForDocument(document, false)
      const links: vscode.DocumentLink[] = []
      const text = document.getText()
      const lines = text.split('\n')

      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const lineText = lines[lineIndex]
        const found = getUrls(lineText)
        if (!found.length)
          continue
        for (const f of found) {
          const absolutePath = await resolveAbsolute(document, f.url, currentAliasMap)
          if (!absolutePath)
            continue
          const range = new vscode.Range(
            lineIndex,
            f.start,
            lineIndex,
            f.end,
          )
          links.push(new vscode.DocumentLink(range, vscode.Uri.file(absolutePath)))
        }
      }

      return links
    },
  })

  const hoverHander = vscode.languages.registerDefinitionProvider([
    { scheme: 'file', language: 'vue' },
    { scheme: 'file', language: 'scss' },
    { scheme: 'file', language: 'css' },
    { scheme: 'file', language: 'less' },
    { scheme: 'file', language: 'javascript' },
    { scheme: 'file', language: 'typescript' },
    { scheme: 'file', language: 'javascriptreact' },
    { scheme: 'file', language: 'typescriptreact' },
  ], {
    async provideDefinition(document, position) {
      const linetext = document.lineAt(position).text // 当前行字符串
      const foundInLine = getUrls(linetext)
      if (!foundInLine.length)
        return
      // 定位光标所在的 url 片段
      const current = foundInLine.find(f => position.character >= f.start && position.character <= f.end)
      if (!current)
        return
      const aliasUrl = current.url

      const currentAliasMap = await loadAliasForDocument(document, false)

      const key = cacheKeyOf(document, aliasUrl, position.line)
      if (cacheMap.has(key)) {
        const cache = cacheMap.get(key)
        if (!cache)
          return
        const { columnStart, columnEnd, result } = cache
        if ((position.character < columnStart) || (position.character > columnEnd))
          return

        return result
      }

      const absolutePath = await resolveAbsolute(document, aliasUrl, currentAliasMap)
      if (!absolutePath) {
        cacheMap.set(key, undefined)
        return
      }

      const columnStart = current.start
      const columnEnd = current.end

      const originSelectionRange = new vscode.Range(position.line, columnStart - 1, position.line, columnEnd + 1)
      const result = [
        {
          originSelectionRange,
          targetRange: new vscode.Range(0, 0, 0, 0),
          targetUri: vscode.Uri.file(absolutePath),
        },
      ] as vscode.LocationLink[]
      cacheMap.set(key, { columnStart, columnEnd, result })
      if ((position.character < columnStart) || (position.character > columnEnd))
        return

      return result
    },
  })

  // 监听 tsconfig/jsconfig 变更，重载别名与清理缓存
  const configWatcher = vscode.workspace.createFileSystemWatcher('**/{tsconfig.json,jsconfig.json}')
  const onConfigChanged = () => {
    cacheMap.clear()
    invalidateAliasCache()
  }
  configWatcher.onDidChange(onConfigChanged, undefined, context.subscriptions)
  configWatcher.onDidCreate(onConfigChanged, undefined, context.subscriptions)
  configWatcher.onDidDelete(onConfigChanged, undefined, context.subscriptions)

  // 文档变更/关闭时，清理该文档的缓存
  const clearDocCache = (uri: vscode.Uri) => {
    const prefix = `${uri.toString()}|`
    for (const k of Array.from(cacheMap.keys())) {
      if (k.startsWith(prefix))
        cacheMap.delete(k)
    }
  }

  context.subscriptions.push(
    linkProvider,
    hoverHander,
    configWatcher,
    vscode.workspace.onDidChangeTextDocument(e => clearDocCache(e.document.uri)),
    vscode.workspace.onDidCloseTextDocument(doc => clearDocCache(doc.uri)),
  )

  // 初次无需预加载别名，按需加载
}

export function deactivate() {

}
