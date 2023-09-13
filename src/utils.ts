import fs from 'node:fs'
import * as vscode from 'vscode'

export function getUrl(str: string) {
  // const importUrl = /import[\s\w\_,{}]+from[^(\'\"]+['\"]([^'\"]+)['\"]/
  const imporCsstUrl = /import\s+['\"]([^'\"]+)['\"]/
  // const requireUrl = /require\(['"]([^'"]+)['"]\)/
  // const srcUrl = /src="([^"]+)"/
  const match = str.match(imporCsstUrl)
  return match ? match[1] : ''
}

export function getRootUrl() {
  const workspaceFolders = vscode.workspace.workspaceFolders
  if (workspaceFolders && workspaceFolders.length > 0)
    return workspaceFolders[0].uri.fsPath
}

export function getAlias() {
  const aliasMap: any = {}
  try {
    const rootUrl = getRootUrl()
    const tsConfig = `${rootUrl}/tsconfig.json`
    const jsConfig = `${rootUrl}/jsconfig.json`
    const json = fs.existsSync(tsConfig)
      ? useJSONParse(fs.readFileSync(tsConfig, 'utf-8'))
      : fs.existsSync(jsConfig)
        ? useJSONParse(fs.readFileSync(jsConfig, 'utf-8'))
        : undefined
    if (!json)
      return
    const paths = json.compilerOptions.paths
    if (paths) {
      Object.keys(paths).forEach((key) => {
        aliasMap[key.split('/')[0]] = paths[key][0].split('/')[0]
      })
    }
    return aliasMap
  }
  catch (error) {
    console.error('tsconfig or jsconfig 文件格式存在问题')
    return aliasMap
  }
}

const extensions = ['.js', '.vue', '.jsx', '.tsx', '.ts']
export function findAliasExtensions(url: string) {
  if (isFile(url))
    return url

  for (const suffix of ['.js', '.ts', '.jsx', '.tsx']) {
    const extensionUrl = `${url}${suffix}`
    if (isFile(extensionUrl))
      return extensionUrl
  }
  for (const suffix of extensions) {
    const extensionUrl = `${url}/index${suffix}`
    if (isFile(extensionUrl))
      return extensionUrl
  }
  return ''
}

function isFile(url: string) {
  try {
    const stats = fs.statSync(url)
    return stats.isFile()
  }
  catch (error) {
    return false
  }
}

const keyReg = /\s+(?!['"])([\w_\-\$\.]+):/gm
const valueReg = /:\s*(?!['"])([\w_\-\$\.]+)/gm
const commaLackReg = /:\s*("[\w_\-\$\.]+")\s*(?!,)"/gm
const commaMoreReg = /:\s*("[\w_\-\$\.]+"\s*,)\s*}/gm
const moreCommaReg = /,(\s*})/gm
/**
 * 将字符串转为JSON.stringify的格式并parse出结果
 * @param { string } str 字符串
 * @returns
 */
export function useJSONParse(str: string) {
  return JSON.parse(
    str
      .replace(keyReg, (match, key) => match.replace(key, `"${key}"`))
      .replace(valueReg, (match, value) => match.replace(value, `"${value}"`))
      .replace(commaLackReg, (match, value) =>
        match.replace(value, `${value},`),
      )
      .replace(commaMoreReg, match => match.replace(',', ''))
      .replace(moreCommaReg, (_, v) => v),
  )
}
