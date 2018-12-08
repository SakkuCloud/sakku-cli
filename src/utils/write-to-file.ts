import * as fs from 'fs-extra'
import * as path from 'path'

export default async function writeToConfig(ctx: any, data:any) {
    fs.writeFile(path.join(ctx.config.cacheDir, 'config.json'),data,{encoding:'utf-8'})
}