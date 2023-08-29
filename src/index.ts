import path from 'node:path'
import * as vscode from 'vscode'
import { findAliasExtensions, getAlias, getRootUrl, getUrl } from './utils'
import a from './a'

// todo: 支持monorepo
export function activate(context: vscode.ExtensionContext) {
  const aliasMap = getAlias()
  const rootUrl = getRootUrl()
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
      const alias = aliasUrl.split('/')[0]
      if (alias[0] === '.')
        return
      const aliasName = aliasMap[alias]
      if (!aliasName)
        return
      const absolutePath = findAliasExtensions(aliasUrl.replace(alias, path.resolve(rootUrl, aliasName)))
      if (!absolutePath)
        return
      const columnStart = linetext.indexOf(aliasUrl)
      const columnEnd = columnStart + aliasUrl.length + 2
      const originSelectionRange = new vscode.Range(position.line, columnStart, position.line, columnEnd)
      return [
        {
          originSelectionRange,
          targetRange: new vscode.Range(0, 0, 0, 0),
          targetUri: vscode.Uri.file(absolutePath),
        },
      ]
    },
  })
  context.subscriptions.push(hoverHander)
}

export function deactivate() {

}
