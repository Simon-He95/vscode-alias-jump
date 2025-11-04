import fs, { existsSync, promises } from 'node:fs'
import path, { resolve } from 'node:path'
import { getCurrentFileUrl, getRootPath } from '@vscode-use/utils'
import { findUp } from 'find-up'
import { isArray, toArray, useJSONParse } from 'lazy-js-utils'
import * as vscode from 'vscode'

export function getUrl(str: string) {
  const first = getUrls(str)[0]
  return first ? first.url : ''
}

export interface FoundUrl {
  url: string
  start: number
  end: number
}

// 提取一行内的所有 URL（import/from、纯样式 import、动态 import、require、HTML src）
export function getUrls(str: string): FoundUrl[] {
  const patterns: RegExp[] = [
    /import\s+['"]([^'"]+)['"]/g, // import '...'
    /import[\s\w,{}]+from[^('")]+['"]([^'"]+)['"]/g, // import x from '...'
    /import\(\s*['"]([^'"]+)['"]\s*\)/g, // import('...')
    /require\(\s*['"]([^'"]+)['"]\s*\)/g, // require('...')
    /src\s*=\s*['"]([^'"]+)['"]/g, // src="..."
    /url\(\s*['"]?([^'")]+)['"]?\s*\)/g, // url("...") in CSS
  ]

  const results: FoundUrl[] = []
  for (const re of patterns) {
    let m: RegExpExecArray | null
    while ((m = re.exec(str)) !== null) {
      const full = m[0]
      const captured = m[1]
      const start = (m.index ?? 0) + full.indexOf(captured)
      const end = start + captured.length
      results.push({ url: captured, start, end })
    }
  }
  // 保持按出现顺序排序
  results.sort((a, b) => a.start - b.start)
  return results
}

export function getRootUrl() {
  const workspaceFolders = vscode.workspace.workspaceFolders
  if (workspaceFolders && workspaceFolders.length > 0)
    return workspaceFolders[0].uri.fsPath
}

const workspaceMap = new Map<string, string | undefined>()
export async function getCurrentWorkspaceUrl(filePath?: string) {
  const currentFileUrl = filePath || getCurrentFileUrl()!
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

// 根据文件路径解析对应 ts/jsconfig 的绝对路径
export async function getConfigPathForFile(filePath: string) {
  const ws = await getCurrentWorkspaceUrl(filePath)
  if (!ws)
    return
  let configPath = resolve(ws, 'tsconfig.json')
  if (!existsSync(configPath))
    configPath = resolve(ws, 'jsconfig.json')
  if (!existsSync(configPath))
    return
  return configPath
}

// 获取当前package.json下的配置
const aliasMap = new Map()

// 允许外部主动清理别名与工作区缓存（配置文件变化时调用）
export function invalidateAliasCache(configPath?: string) {
  if (configPath)
    aliasMap.delete(configPath)
  else
    aliasMap.clear()
  workspaceMap.clear()
}

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
  // 标记占位，避免并发重复读取
  aliasMap.set(cacheKey, undefined)

  // 安全读取配置
  let fileText = ''
  try {
    fileText = await promises.readFile(configPath, 'utf-8')
  }
  catch {
    aliasMap.delete(cacheKey)
    return
  }
  const _config = useJSONParse(fileText)
  if (!_config) {
    aliasMap.delete(cacheKey)
    return
  }

  const result: Record<string, string | string[]> = {}

  // 递归处理 references
  if (_config.references && Array.isArray(_config.references)) {
    const refPromises = _config.references
      .filter((ref: any) => ref.path)
      .map((ref: any) => {
        let refConfigPath = resolve(path.dirname(configPath!), ref.path)
        try {
          const stat = fs.statSync(refConfigPath)
          if (stat.isDirectory()) {
            const tsconfig = resolve(refConfigPath, 'tsconfig.json')
            const jsconfig = resolve(refConfigPath, 'jsconfig.json')
            if (existsSync(tsconfig))
              refConfigPath = tsconfig
            else if (existsSync(jsconfig))
              refConfigPath = jsconfig
            else
              return Promise.resolve({})
          }
        }
        catch {
          // 既不是文件也不是目录，或不存在
          return Promise.resolve({})
        }
        if (existsSync(refConfigPath))
          return getAlias(refConfigPath, visited)
        return Promise.resolve({})
      })
    const refAliases = await Promise.all(refPromises)
    for (const refAlias of refAliases) {
      for (const key in refAlias) {
        const prev = result[key]
        const incoming = refAlias[key] as any
        if (prev && prev !== incoming) {
          const arr = toArray(prev)
          for (const v of toArray(incoming)) {
            if (!arr.includes(v))
              arr.push(v)
          }
          result[key] = arr as any
        }
        else {
          result[key] = incoming
        }
      }
    }
  }

  const paths = _config?.compilerOptions?.paths
  if (paths) {
    Object.keys(paths).forEach((key: any) => {
      const value = paths[key]
      // 支持多候选路径，先以第一个为主，后续按顺序合并
      const values = isArray(value) ? value : [value]
      key = key.replace(/\/\*\*/g, '').replace(/\/\*/g, '')
      const normalizedValues = values.map((v: string) => v.replace(/\/\*\*/g, '').replace(/\/\*/g, ''))
      if (key === '@') {
        key = '@/'
        normalizedValues[0] = `${normalizedValues[0]}/`
      }
      for (const nv of normalizedValues) {
        if (result[key] && result[key] !== nv) {
          // 已有同名 alias，合并为数组，去重
          const arr = toArray(result[key])
          if (!arr.includes(nv))
            arr.push(nv)
          result[key] = arr as any
        }
        else {
          result[key] = nv
        }
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

export async function findAliasExtensionsAsync(url: string) {
  if (await isFileAsync(url))
    return url

  for (const suffix of ['.js', '.ts', '.jsx', '.tsx', '.vue']) {
    const extensionUrl = `${url}${suffix}`
    if (await isFileAsync(extensionUrl))
      return extensionUrl
  }
  for (const suffix of extensions) {
    const extensionUrl = `${url}/index${suffix}`
    if (await isFileAsync(extensionUrl))
      return extensionUrl
  }
  return ''
}

async function isFileAsync(url: string) {
  try {
    const stats = await promises.stat(url)
    return stats.isFile()
  }
  catch (error) {
    return false
  }
}
