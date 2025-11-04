import path from 'node:path'
import * as vscode from 'vscode'
import { findAliasExtensions, getAlias, getRootUrl, getUrl } from './utils'

// todo: 支持monorepo
export function activate(context: vscode.ExtensionContext) {
  const rootUrl = getRootUrl()
  if (!rootUrl)
    return
  const aliasMapPromise = getAlias()
  const cacheMap = new Map()
  aliasMapPromise.then((aliasMap) => {
  // 添加 DocumentLinkProvider 来修正 Cmd+Click 跳转
    const linkProvider = vscode.languages.registerDocumentLinkProvider([
      { scheme: 'file', language: 'vue' },
      { scheme: 'file', language: 'scss' },
      { scheme: 'file', language: 'css' },
      { scheme: 'file', language: 'less' },
      { scheme: 'file', language: 'javascript' },
      { scheme: 'file', language: 'typescript' },
      { scheme: 'file', language: 'javascriptreact' },
    ], {
      provideDocumentLinks(document) {
        const links: vscode.DocumentLink[] = []
        const text = document.getText()
        const lines = text.split('\n')

        lines.forEach((lineText, lineIndex) => {
          const aliasUrl = getUrl(lineText)
          if (!aliasUrl)
            return

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

          if (!absolutePath)
            return

          const startIndex = lineText.indexOf(aliasUrl)
          if (startIndex === -1)
            return

          const range = new vscode.Range(
            lineIndex,
            startIndex,
            lineIndex,
            startIndex + aliasUrl.length,
          )

          const link = new vscode.DocumentLink(range, vscode.Uri.file(absolutePath))
          links.push(link)
        })

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

    context.subscriptions.push(linkProvider, hoverHander)
  })
}

export function deactivate() {

}
