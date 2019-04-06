import {Command, flags} from '@oclif/command'
import {string} from '@oclif/command/lib/flags'
import axios from 'axios'
import {socket} from 'axon'
import {Duplex} from 'stream'
let readline = require('readline')

export default class Exec extends Command {
  static description = 'execute command on instance'

  static examples = [
    `$ sakku exec
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    interactive: flags.boolean({char: 'i'})
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
    //test data
    let data = {
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      DetachKeys: 'ctrl-c,ctrl-q',
      Tty: true,
      Cmd: [
        args.cmd
      ],
      Env: []
    }
    let rl = readline.createInterface(process.stdin, process.stdout)
    let id = await axios.post(`http://127.0.0.1:2375/containers/${args.app}/exec`, data)
      .then(value => value.data.Id)
    if (flags.interactive || args.cmd === 'bash') {
      axios.post(`http://127.0.0.1:2375/exec/${id}/start`,
        {
          Detach: false,
          Tty: true
        }, {
          responseType: 'stream'
        }).then(response => {
          let stream = response.data
          let socket = stream.socket

          socket.on('error', (data: string) => {
            process.stdin.pause()
            process.stderr.write(data)
            process.stdin.resume()
          })

          socket.on('data', (data: string) => {
            process.stdin.pause()
            process.stdout.write(data)
            process.stdin.resume()
          })

          rl.on('line', (input: string) => {
            socket.write(input.trim() + '\n')
          })

          rl.on('SIGINT', function () {
            // stop input
            process.stdin.pause()
            process.stderr.write('\nEnding session\n')
            rl.close()
            socket.emit('end')
          })
        })
    } else {
      axios.post<string>(`http://127.0.0.1:2375/exec/${id}/start`,
        {
          Detach: false,
          Tty: true
        }).then(response => {
          rl.write(response.data)
          rl.close()
        })
    }
  }
}

function sendCommand(ctx: Command, cm: string, cid: string) {
  cm = cm.replace('/\\r?\\n|\\r/g', '')
    .replace('/\\r?\\n|\\r/', '')
    .replace('\n', '')
  let myCm
  if (cm && (cm === 'bash' || !cm.includes(' ')))
    myCm = [cm]
  else
    myCm = ['bash', '-c', cm]
  let data = {
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    DetachKeys: 'ctrl-p,ctrl-q',
    Tty: true,
    Cmd: myCm,
    Env: [
    ]
  }
  axios.post<{ Id: '' }>(`http://127.0.0.1:2375/containers/${cid}/exec`, data)
    .then(value => value.data.Id)
    .then(id => {
      axios.post(`http://127.0.0.1:2375/exec/${id}/start`,
        {
          Detach: false,
          Tty: true
        }, {
          responseType: 'stream',
          headers: {
            Connection: 'Upgrade',
            Upgrade: 'tcp'
          }
        }).then(response => {
          let stream = response.data
          ctx.log('done')
          stream.pipe(process.stdout)
          process.stdin.pipe(stream)
        }).catch(reason => ctx.log(reason.toString()))
    }
    ).catch(reason => ctx.log(reason.toString()))
}
