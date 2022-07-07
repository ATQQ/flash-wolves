import { join } from 'path'
import dotenv from 'dotenv'
import { existsSync, readFileSync } from 'fs'

interface Options {
  // 模式
  mode?: string
  // 环境变量配置文件所在目录
  envDir?: string
  // 允许前缀
  prefix?: string
  // 不写入到process.env上
  ignoreProcessEnv?: boolean
}

const defaultOptions: Options = {
  mode: 'development',
  envDir: process.cwd(),
  prefix: '',
  ignoreProcessEnv: false
}
// eslint-disable-next-line import/prefer-default-export
export function loadEnv(options?: Options): Record<string, string> {
  // 设置默认值
  options = { ...defaultOptions, ...(options || {}) }
  const { mode, envDir, prefix, ignoreProcessEnv } = options

  if (mode === 'local') {
    throw new Error(
      '"local" cannot be used as a mode name because it conflicts with ' +
        'the .local postfix for .env files.'
    )
  }

  const env: Record<string, string> = {}

  const envFiles = [
    /** mode local file */ `.env.${mode}.local`,
    /** mode file */ `.env.${mode}`,
    /** local file */ '.env.local',
    /** default file */ '.env'
  ]

  for (const key in process.env) {
    if (key.startsWith(prefix) && env[key] === undefined) {
      env[key] = process.env[key] as string
    }
  }

  for (const file of envFiles) {
    const fullpath = join(envDir, file)
    const path = existsSync(fullpath) ? fullpath : undefined

    if (path) {
      const parsed = dotenv.parse(readFileSync(path))

      for (const [key, value] of Object.entries(parsed)) {
        if (key.startsWith(prefix) && env[key] === undefined) {
          env[key] = value
        } else if (key === 'NODE_ENV') {
          process.env.NODE_ENV = value
        }
      }
    }
  }
  if (!ignoreProcessEnv) {
    Object.assign(process.env, env)
  }
  return env
}

export function pathJoin(...paths: string[]) {
  return paths.join('/').replace(/\/+/g, '/')
}
