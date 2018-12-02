import {Command, flags} from '@oclif/command'
import makeId from '../utils/makeid'
import opn = require('opn')

export default class Login extends Command {
  static description = 'login to Sakku command-line'

  static examples = [
    `$ sakku hello
hello world from ./src/hello.ts!
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Login)
    const token = makeId()
    opn('https://sakku.cloud/oauth?token='+token)
  }
}
