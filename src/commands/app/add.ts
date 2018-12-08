import { Command, flags } from '@oclif/command'
import cli from 'cli-ux'

export default class Add extends Command {
  static description = 'add new app'

  static examples = [
    `$ sakku app:add`,
  ]

  static flags = {
    help: flags.help({ char: 'h' })
  }

  async run() {
    let appName = await cli.prompt('Enter your app name') || 'random-name'
    await cli.action.start('please wait...')
    await cli.wait(2000)
    
    cli.action.stop('created!')
    this.log(`${appName} is ready to deploy :)`)
  }
}
