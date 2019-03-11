import color from '@oclif/color'
import {
  Command,
  flags
} from '@oclif/command'
import cli from 'cli-ux'
import * as inquirer from 'inquirer'
import opn = require('opn')

import {authService} from '../_service/auth.service'
import {
  abort_msg, click_here_to_login_msg,
  done_msg,
  password_req,
  problem_in_login_msg,
  username_req
} from '../consts/msg'
import {
  auth_url
} from '../consts/urls'
import makeId from '../utils/make-id'
import {writeOverview, writeToken} from '../utils/writer'

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
    const code = makeId()

    inquirer.prompt([
      Login.question
    ]).then(answers => {
      // @ts-ignore
      switch (answers.way) {
      case Login.question.choices[0].name:
        cli.prompt(username_req, {required: true}).then(i => {
          Login.user.username = i
        }).then(() => {
          cli.prompt(password_req, {required: true, type: 'hide'}).then(i => {
            Login.user.password = i
          }).then(() => {
              // TODO
            Login.auth = {token: ''}
            writeToken(this, Login.auth)
            this.log(color.green(`you logged in by Username:${Login.user.username} & Password:${Login.user.password}`))
          })
        })
        break
      case Login.question.choices[1].name:
        opn(`${auth_url}${code}`, {wait: false}).catch(() => {
          cli.url(`${color.green(click_here_to_login_msg)}`,
              `${auth_url}${code}`)
        }).then(async () => {
          cli.action.start('logging in to Sakku...')
          await cli.wait(5000)
          let isLoggedin = false
          let repeatedCount = 0
          while (!isLoggedin) {
            await cli.wait(5000)
            try {
              let resp = await authService.authenticate(code)
              Login.auth = {token: resp.data.result}
              writeToken(this, Login.auth.token)
              isLoggedin = true
            } catch (_) {
              if (repeatedCount > 10) {
                this.log(color.red(problem_in_login_msg))
                break
              }
              repeatedCount ++
            }
          }
          if (isLoggedin) {
            try {
              let overview = await authService.overview(this).then(value => JSON.stringify(value.data.result))
              writeOverview(this, overview)
            } catch (e) {
              this.log(e)
            }
            cli.action.stop(done_msg)
            this.log(`${color.green('you are logged in :)')}`)
          } else {
            cli.action.stop(abort_msg)
          }
        })
      }
    })
  }
}
