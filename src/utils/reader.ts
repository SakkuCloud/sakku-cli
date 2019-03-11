import {Command} from '@oclif/command'
import * as fs from 'fs-extra'
import * as path from 'path'

export default function reader(ctx: Command) {
  return fs.readFileSync(path.join(ctx.config.configDir, 'token'), 'utf-8')
}
