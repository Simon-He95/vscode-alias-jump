import fs, { existsSync, promises } from 'node:fs'
import path, { resolve } from 'node:path'
import { getCurrentFileUrl, getRootPath } from '@vscode-use/utils'
import { findUp } from 'find-up'
import { isArray, toArray, useJSONParse } from 'lazy-js-utils'
import * as vscode from 'vscode'

export function getUrl(str: string) {
  const importUrl = /import[\s\w,{}]+from[^('"]+['"]([^'"]+)['"]/
  const imporCsstUrl = /import\s+['"]([^'"]+)['"]/
  // const requireUrl = /require\(['"]([^'"]+)['"]\)/
  // const srcUrl = /src="([^"]+)"/
  const match = str.match(imporCsstUrl) || str.match(importUrl)
  return match ? match[1] : ''
}

export function getRootUrl() {
  const workspaceFolders = vscode.workspace.workspaceFolders
  if (workspaceFolders && workspaceFolders.length > 0)
    return workspaceFolders[0].uri.fsPath
}

const workspaceMap = new Map()
async function getCurrentWorkspaceUrl() {
  const currentFileUrl = getCurrentFileUrl()!
  if (!currentFileUrl)
    return

  if (workspaceMap.has(currentFileUrl))
    return workspaceMap.get(currentFileUrl)

  const currentWorkspaceUrl = await findUp('package.json', {
    cwd: currentFileUrl,
    stopAt: getRootPath(),
    type: 'file',
  })
  if (currentWorkspaceUrl) {
    const url = path.resolve(currentWorkspaceUrl, '..')
    workspaceMap.set(currentFileUrl, url)
    return url
  }
  workspaceMap.set(currentFileUrl, undefined)
}

// 获取当前package.json下的配置
const aliasMap = new Map()
export async function getAlias(configUrl?: string, visited = new Set<string>()) {
  let configPath = configUrl
  if (!configPath) {
    const currentWorkspaceUrl = await getCurrentWorkspaceUrl()
    if (!currentWorkspaceUrl)
      return
    configPath = resolve(currentWorkspaceUrl, 'tsconfig.json')
    if (!existsSync(configPath))
      configPath = resolve(currentWorkspaceUrl, 'jsconfig.json')
    if (!existsSync(configPath))
      return
  }

  if (visited.has(configPath))
    return {}
  visited.add(configPath)

  const cacheKey = configPath
  if (aliasMap.has(cacheKey))
    return aliasMap.get(cacheKey)
  aliasMap.set(cacheKey, undefined)

  const _config = useJSONParse(await promises.readFile(configPath, 'utf-8'))
  if (!_config)
    return

  const result: Record<string, string> = {}

  // 递归处理 references
  if (_config.references && Array.isArray(_config.references)) {
    const refPromises = _config.references
      .filter((ref: any) => ref.path)
      .map((ref: any) => {
        const refConfigPath = resolve(path.dirname(configPath), ref.path)
        if (existsSync(refConfigPath)) {
          return getAlias(refConfigPath, visited)
        }
        return Promise.resolve({})
      })
    const refAliases = await Promise.all(refPromises)
    for (const refAlias of refAliases) {
      for (const key in refAlias) {
        if (result[key] && result[key] !== refAlias[key]) {
          // 已有同名 alias，合并为数组，去重
          const arr = toArray(result[key])
          if (!arr.includes(refAlias[key]))
            arr.push(refAlias[key])
          result[key] = arr as any
        }
        else {
          result[key] = refAlias[key]
        }
      }
    }
  }

  const paths = _config?.compilerOptions?.paths
  if (paths) {
    Object.keys(paths).forEach((key: any) => {
      let value = paths[key]
      if (isArray(value))
        value = value[0]
      key = key.replace(/\/\*\*/g, '').replace(/\/\*/g, '')
      value = value.replace(/\/\*\*/g, '').replace(/\/\*/g, '')
      if (key === '@') {
        key = '@/'
        value = `${value}/`
      }
      if (result[key] && result[key] !== value) {
        // 已有同名 alias，合并为数组，去重
        const arr = toArray(result[key])
        if (!arr.includes(value))
          arr.push(value)
        result[key] = arr as any
      }
      else {
        result[key] = value
      }
    })
  }

  aliasMap.set(cacheKey, result)
  return result
}

const extensions = ['.js', '.vue', '.jsx', '.tsx', '.ts']
export function findAliasExtensions(url: string) {
  if (isFile(url))
    return url

  for (const suffix of ['.js', '.ts', '.jsx', '.tsx', '.vue']) {
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
