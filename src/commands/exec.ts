import {Command, flags} from '@oclif/command'
import axios from 'axios'

import {appService} from '../_service/app.service'
import {execService} from '../_service/exec.service'
import {exec_exit_msg} from '../consts/msg'
import {DetachKey} from '../consts/val'
import {IApp} from '../interfaces/app.interface'
import * as inquirer from './login'

let readline = require('readline')

export default class Exec extends Command {
  static description = 'execute command on instance'

  static examples = [
    `$ sakku exec
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    interactive: flags.boolean({char: 'i'}),
    tty: flags.boolean({char: 't'})
  }

  static args = [
    {
      name: 'app',
      required: true,
      description: 'app id/name',
      hidden: false
    }, {
      name: 'cmd',
      required: false,
      description: 'command',
      hidden: false,
      default: 'bash'
    }
  ]

  async run() {
    const {args, flags} = this.parse(Exec)
    let appUrl = "http://127.0.0.1:2375" //todo
    let appFromFile: IApp = appService.getAppFromFile(this, args.app)
    await inquirer.prompt({
      name: 'instance',
      message: 'which instance :',
      type: 'list',
      choices: [
        {name: 'instance-num1-siavash-soraya-1474'},
        {name: 'instance-num2-siavash-soraya-1474'},
        {name: 'instance-num3-siavash-soraya-1474'}],
    })
    let firstLine = false
    let data = {
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      DetachKeys: 'ctrl-c',
      Tty: flags.tty,
      Cmd: [
        args.cmd
      ],
      Env: []
    }
    let rl = readline.createInterface(process.stdin, process.stdout)
    let id = await execService.create(this, data, appUrl, args.app)
    if (flags.interactive || args.cmd === 'bash') {
      axios.post(appUrl + `/exec/${id}/start`,
        {
          Detach: false,
          Tty: flags.tty
        }, {
          responseType: 'stream'
        }).then(response => {
          let stream = response.data
          let socket = stream.socket
          socket.on('data', (data: string) => {
            process.stdin.pause()
            if (!firstLine)
              process.stdout.write(data)
            firstLine = false
            process.stdin.resume()
          })

          process.stdout.on('data', i => {
            socket.write(i.toString())
            if (i == DetachKey) {
              rl.emit('SIGINT')
            }
          })

          rl.on('SIGINT', function () {
            // stop input
            socket.emit('end')
            process.stdin.pause()
            process.stdout.write(exec_exit_msg)
            //rl.close()
          //  process.stdin.end()
            process.exit(0)
          })
        })
    } else {
      axios.post<string>(appUrl + `/exec/${id}/start`,
        {
          Detach: false,
          Tty: flags.tty
        }).then(response => {
          rl.write(response.data)
          rl.close()
        })
    }
  }
}
