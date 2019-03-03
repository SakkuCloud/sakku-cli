import * as fs from 'fs-extra'
import * as path from 'path'

export async function writeToken(ctx: any, data: any) {
  let configUri = path.join(ctx.config.configDir, 'token')
  if (!fs.pathExistsSync(ctx.config.configDir)) fs.mkdirSync(ctx.config.configDir)
  fs.writeFileSync(configUri, data, {encoding: 'utf-8'})
}

export async function writeOverview(ctx: any, data: string) {
  let configUri = path.join(ctx.config.configDir, 'overview')
  if (!fs.pathExistsSync(ctx.config.configDir)) fs.mkdirSync(ctx.config.configDir)
  fs.writeFileSync(configUri, data, {encoding: 'utf-8'})
}

export async function writeApps(ctx: any, data: any) {
  let configUri = path.join(ctx.config.configDir, 'apps')
  if (!fs.pathExistsSync(configUri)) {
    if (!fs.pathExistsSync(ctx.config.configDir)) fs.mkdirSync(ctx.config.configDir)
    fs.writeFileSync(configUri, '', {encoding: 'utf-8'})
  }
  fs.appendFileSync(configUri, `{${data}},\n`, {encoding: 'utf-8'})
}
