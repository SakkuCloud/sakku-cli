import {Command} from '@oclif/command'
import * as fs from 'fs-extra'
import * as path from 'path'

export function readToken(ctx: Command) {
  return fs.readFileSync(path.join(ctx.config.configDir, 'token'), 'utf-8')
}

export function readConfig(ctx: Command) {
  return fs.readFileSync(path.join(ctx.config.configDir, 'config'), 'utf-8')
}
