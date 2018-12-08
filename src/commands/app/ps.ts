import { Command, flags } from '@oclif/command'
import cli from 'cli-ux'

export default class PS extends Command {
  static description = 'showing all [running/stoped] app'

  static examples = [
    `$ sakku app:ps [-a,--all]`,
  ]

  static flags = {
    help: flags.help({ char: 'h' }),
    all: flags.boolean({ char: 'a' }),
  }

  async run() {
    const { flags } = this.parse(PS)

    if (flags.all) {
      cli.action.start('please wait...')
      await cli.wait(2000)
      cli.action.stop('done')
      this.log('showing all apps')
    } else {
      cli.action.start('please wait...')
      await cli.wait(2000)
      cli.action.stop('done')
      this.log('showing all running apps')
    }
  }
}
