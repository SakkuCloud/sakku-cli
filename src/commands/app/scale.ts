import { Command, flags } from '@oclif/command'
import cli from 'cli-ux'
import { isNumber } from 'util';

export default class Scale extends Command {
  static description = 'scale app'

  static examples = [
    `$ sakku app:scale`,
  ]

  static flags = {
    help: flags.help({ char: 'h' })
  }

  async run() {
    var appId = await cli.prompt('Enter your app id', { required: true })
    var appScale = await cli.prompt('Enter your app scale', { required: true , type: "normal"})
    while(isNaN(appScale)){
      appScale = await cli.prompt(`\nEnter your app scale`, { required: true , type: "normal"})
    }
    await cli.action.start('please wait...')
    await cli.wait(2000)
    cli.action.stop('done!')
    this.log(`your app scaled to ${appScale}`)
  }
}
