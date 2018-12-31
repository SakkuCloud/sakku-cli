import * as fs from 'fs-extra'
import * as path from 'path'

export default async function readFromConfigSync(ctx: any) {
  return fs.readFile(path.join(ctx.config.cacheDir, 'config.json'), 'utf-8')
}
