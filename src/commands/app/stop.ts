import { Command, flags } from '@oclif/command'
import cli from 'cli-ux'

export default class Stop extends Command {
    static description = 'stop app'

    static examples = [
        `$ sakku app:stop`,
    ]

    static flags = {
        help: flags.help({ char: 'h' })
    }

    async run() {
        var appId = await cli.prompt('Enter your app-id', { required: true })
        await cli.action.start('please wait...')
        await cli.wait(2000)
        cli.action.stop('stoped!')
        this.log(`your app (${appId}) is stoped`)
    }
}
