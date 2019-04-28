import {Command, flags} from '@oclif/command';
import {cli} from 'cli-ux';
import * as readline from 'readline';

import {appService} from '../_service/app.service';
import {execService} from '../_service/exec.service';
import {exec_exit_msg} from '../consts/msg';
import {DetachKey} from '../consts/val';
import inquirer = require('inquirer');

export default class Exec extends Command {
  static description = 'execute command on instance';

  static examples = [
    `$ sakku exec
`,
  ];

  static flags = {
    help: flags.help({char: 'h'}),
    interactive: flags.boolean({char: 'i'}),
    tty: flags.boolean({char: 't'})
  };

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
  ];

  async run() {
    const {args, flags} = this.parse(Exec);
    let appId: string;
    if (args.app)
      appId = args.app;
    else
      appId = await cli.prompt('enter app id/name');

    let data;
    try {
      // @ts-ignore
      if (!isNaN(appId)) {
        data = await appService.get(this, appId)
          .then(value => value.data);
      } else {
        data = await appService.getByName(this, appId)
          .then(value => value.data);
      }
      if (data.error) {
        this.log('error code:', data.code, data.message);
      } else {
        let result = data.result!;
        if (result.instances.length === 0) {
          this.log('there is no instance!');
        } else {
          let instances = result.instances;
          let choices: {name: string}[] = [];
          // @ts-ignore
          instances.forEach(ins => {
            // @ts-ignore
            choices.push({name : ins.containerId});
          });
          await inquirer.prompt({
            name: 'instance',
            message: 'which instance :',
            type: 'list',
            choices
          }).then(async answer => {
            let firstLine = false;
            let initData = {
              AttachStdin: true,
              AttachStdout: true,
              AttachStderr: true,
              DetachKeys: 'ctrl-c',
              Tty: flags.tty,
              Cmd: [
                args.cmd
              ],
              Env: []
            };
            // @ts-ignore
            let url = await instances.find(value => value.containerId === answer.instance!)!.workerHost as string;
            let appUrl = 'http://' + url;
            // @ts-ignore
            let id = await execService.create(this, initData, appUrl, answer.instance);
            let rl = readline.createInterface(process.stdin, process.stdout);
            if (flags.interactive || args.cmd === 'bash') {
              execService.exec(this, id, appUrl, {Detach: false, Tty: flags.tty}).then(response => {
                let stream = response.data;
                let socket = stream.socket;
                socket.on('data', (data: string) => {
                  process.stdin.pause();
                  if (!firstLine)
                    process.stdout.write(data);
                  firstLine = false;
                  process.stdin.resume();
                });

                process.stdout.on('data', i => {
                  socket.write(i.toString());
                  if (i == DetachKey) {
                    rl.emit('SIGINT');
                  }
                });

                rl.on('SIGINT', function () {
                  // stop input
                  socket.emit('end');
                  process.stdin.pause();
                  process.stdout.write(exec_exit_msg);
                  process.exit(0);
                });
              });
            } else {
              execService.exec(this, id, appUrl, {Detach: false, Tty: flags.tty}).then(response => {
                rl.write(response.data);
                rl.close();
              });
            }
          });
        }
      }
    } catch (err) {
      const code = err.code || (err.response && err.response.status.toString());
      this.log('code:', code, err.response.data.message || '');
    }
  }
}
