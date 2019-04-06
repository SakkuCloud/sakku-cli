import {Command, flags} from '@oclif/command'
import axios from 'axios'

let request = require('request')

const httpAdapter = require('axios/lib/adapters/http')

export default class Exec extends Command {
  static description = 'execute command on instance'

  static examples = [
    `$ sakku exec
`,
  ]

  static flags = {
    help: flags.help({char: 'h'})
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Exec)
    //test data
    let data = {
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      DetachKeys: 'ctrl-p,ctrl-q',
      Tty: true,
      Cmd: [
        'bash'
      ],
      Env: []
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
