import { Command, flags } from '@oclif/command'
import { help } from '@oclif/command/lib/flags';
import { cli } from 'cli-ux';

export default class App extends Command {

    static description = 'describe the command here'

    static examples = [
        `$ sakku app!
`,
    ]

    static flags = {
        all: flags.boolean({ char: 'a' , exclusive:['ps']})
    }

    static args = [{ name: 'command' }, { name: 'optional'}]

    static helps = [
        `ps  |  show all user running apps  [-a,--all | show all running and stoped app]`
    ]

    async run() {
        const { args, flags } = this.parse(App)

        const cm = args.command || ''

        switch (cm) {
            case '':
                this.log(App.helps[0])
                break
            case 'ps':
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
                break
            case 'add':
                this.log('add new app')
                let appName = await cli.prompt('Enter your app name') || 'random-name'
                await cli.action.start('please wait...')
                await cli.wait(2000)
                cli.action.stop('created!')
                this.log(`${appName} is ready to deploy :)`)
                break
            case 'stop':
                var appId = await cli.prompt('Enter your app id',{required:true})
                await cli.action.start('please wait...')
                await cli.wait(2000)
                cli.action.stop('stoped!')
                this.log(`your app (${appId}) is stoped`)
                break
            case 'rm':
                var appId = await cli.prompt('Enter your app id',{required:true})
                var confimation = await cli.confirm('are you really sure to remove?')
                if (confimation){
                    await cli.action.start('please wait...')
                    await cli.wait(2000)
                    cli.action.stop('removed!')
                    this.log('your app is not any more exist in this universe!')
                }else {
                    this.log('notting happend!')
                }
                break
            case 'scale':
                var appId = await cli.prompt('Enter your app id',{required:true})
                var appId = await cli.prompt('Enter your app scale',{required:true})
        }
    }
}