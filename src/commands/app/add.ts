import {Command, flags} from '@oclif/command'
import cli from 'cli-ux'
import * as fs from 'fs-extra'
import * as path from 'path'

export default class Add extends Command {
  static description = 'add new app'

  static examples = [
    '$ sakku app:add',
  ]

  static flags = {
    help: flags.help({char: 'h'})
  }

  async run() {
    let appsUri = path.join(this.config.configDir, 'apps')
    let appName = await cli.prompt('Enter your app name', {required: true})
    await cli.action.start('please wait...')
    await fs.mkdirSync(appName)
    await fs.realpath(appName, (err, resolvedPath) => {
      if (!fs.pathExistsSync(appsUri)) {
        if (!fs.pathExistsSync(this.config.configDir)) fs.mkdirSync(this.config.configDir)
        fs.writeFileSync(appsUri, '', {encoding: 'utf-8'})
      }
      fs.appendFileSync(appsUri, `${appName}:'${resolvedPath}'\n`, {encoding: 'utf-8'})
    })
    cli.action.stop('created!')
    this.log(`${appName} is ready to deploy :)`)
  }
}
