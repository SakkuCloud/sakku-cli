import color from '@oclif/color'
import {Command, flags} from '@oclif/command'
import axios from 'axios'
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

  static auth = {token: ''}

  static question = {
    name: 'way',
    message: 'there is two way you can login:',
    type: 'list',
    choices: [{name: 'Login by Usernam/Password'}, {name: 'Login by Browser'}],
  }

  async run() {
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
            Login.auth = {token: ''}
            writeToConfig(this, Login.auth)
            this.log(color.green(`you logged in by Username:${Login.user.username} & Password:${Login.user.password}`))
          })
        })
        break
      case Login.question.choices[1].name:
        opn('https://panel.sakku.cloud/auth/cli/' + token, {wait: false}).catch(() => {
          cli.url(`${color.green('CLICK HERE TO LOGIN TO SAKKU!')}`,
              `https://panel.sakku.cloud/auth/cli/${token}`)
        }).then(async () => {
          cli.action.start('logging in to Sakku...')
          await cli.wait(5000)
          let isLoggedin = false
          while (!isLoggedin) {
            try {
              let resp = await axios.post('https://api.sakku.cloud/users/cli', token)
              this.log(resp.statusText)
              Login.auth = {token: resp.data.result}
              writeToConfig(this, Login.auth)
              isLoggedin = true
            } catch (e) {
              this.log(color.red('Oops!\nthere is a problem with login!'))
              break
            }
            await cli.wait(5000)
          }
          if (isLoggedin) {
            cli.action.stop('done')
            this.log(`${color.green('you are logged in :)')}`)
          } else {
            cli.action.stop('canceled :(')
          }
        })
      }
    })
  }
}
