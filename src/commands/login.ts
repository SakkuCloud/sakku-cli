import color from '@oclif/color'
import {Command, flags} from '@oclif/command'
import cli from 'cli-ux'
import * as inquirer from 'inquirer'
import opn = require('opn')

import makeId from '../utils/make-id'
import writeToConfig from '../utils/write-to-file'

export default class Login extends Command {
  static description = `${color.blueBright('login to Sakku cli interface.')}`

  static flags = {
    help: flags.help({char: 'h'})
  }

  static user = {username: '', password: ''}

  static auth = {username: '', token: ''}

  static question = {
    name: 'way',
    message: 'there is two way you can login:',
    type: 'list',
    choices: [{name: 'Login by Usernam/Password'}, {name: 'Login by Browser'}],
  }

  async run() {
    const {args, flags} = this.parse(Login)
    const token = makeId()

    inquirer.prompt([
      {
        name: 'way',
        message: 'there is two way you can login:',
        type: 'list',
        choices: [{name: 'Login by Usernam/Password'}, {name: 'Login by Browser'}],
      }
    ]).then(answers => {
      // @ts-ignore
      switch (answers.way) {
      case Login.question.choices[0].name:
        cli.prompt('please type your Username (Hint: sometimes username is equal to email)', {required: true}).then(i => {
          Login.user.username = i
        }).then(() => {
          cli.prompt('please type your Password', {required: true, type: 'hide'}).then(i => {
            Login.user.password = i
          }).then(() => {
              // TODO
            Login.auth = {username: '', token: ''}
            writeToConfig(this, Login.auth)
            this.log(color.green(`you logged in by Username:${Login.user.username} & Password:${Login.user.password}`))
          })
        })
        break
      case Login.question.choices[1].name:
        opn('https://cli-auth.sakku.cloud/' + token, {wait: false}).catch(() => {
          cli.url(`${color.green('https://cli-auth.sakku.cloud/') + token}`,
              `https://cli-auth.sakku.cloud/${token}`)
        }).then(async () => {
          cli.action.start('loggin to Sakku...')
          Login.auth = {username: '', token: ''}
          writeToConfig(this, Login.auth)
          await cli.wait(5000)
          cli.action.stop('done')
          this.log(`${color.green('you are logged in :)')}`)

        })
      }
    })
  }
}
