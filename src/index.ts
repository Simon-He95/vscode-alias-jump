import path from 'node:path'
import * as vscode from 'vscode'
import { findAliasExtensions, getAlias, getRootUrl, getUrl } from './utils'

// todo: 支持monorepo
export function activate(context: vscode.ExtensionContext) {
  const aliasMap = getAlias()
  const rootUrl = getRootUrl()
  const cacheMap = new Map()
  if (!rootUrl)
    return
  const hoverHander = vscode.languages.registerDefinitionProvider([
    { scheme: 'file', language: 'vue' },
    { scheme: 'file', language: 'scss' },
    { scheme: 'file', language: 'css' },
    { scheme: 'file', language: 'less' },
    { scheme: 'file', language: 'javascript' },
    { scheme: 'file', language: 'typescript' },
    { scheme: 'file', language: 'javascriptreact' },
  ], {
    provideDefinition(document, position) {
      const linetext = document.lineAt(position).text // 当前行字符串
      const aliasUrl = getUrl(linetext)
      if (!aliasUrl)
        return
      if (cacheMap.has(aliasUrl)) {
        const cache = cacheMap.get(aliasUrl)
        if (!cache)
          return
        const { columnStart, columnEnd, result } = cache
        if ((position.character < columnStart) || (position.character > columnEnd))
          return

        return result
      }
      const alias = aliasUrl.split('/')[0]
      let absolutePath = ''
      if (alias[0] === '.') {
        if (aliasUrl.split('/').slice(-1)[0].includes('.'))
          return
        absolutePath = findAliasExtensions(path.resolve(document.uri.fsPath, '../', aliasUrl))
      }
      else {
        const aliasName = aliasMap[alias]
        if (!aliasName)
          return

        absolutePath = findAliasExtensions(aliasUrl.replace(alias, path.resolve(rootUrl, aliasName)))
      }

      if (!absolutePath) {
        cacheMap.set(aliasUrl, undefined)
        return
      }

      const columnStart = linetext.indexOf(aliasUrl)
      const columnEnd = columnStart + aliasUrl.length

      const originSelectionRange = new vscode.Range(position.line, columnStart - 1, position.line, columnEnd + 1)
      const result = [
        {
          originSelectionRange,
          targetRange: new vscode.Range(0, 0, 0, 0),
          targetUri: vscode.Uri.file(absolutePath),
        },
      ]
      cacheMap.set(aliasUrl, { columnStart, columnEnd, result })
      if ((position.character < columnStart) || (position.character > columnEnd))
        return

      return result
    },
  })
  context.subscriptions.push(hoverHander)
}

export function deactivate() {

}
