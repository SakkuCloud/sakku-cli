// Native Modules
import * as readline from 'readline';

// External Modules
import { Command, flags } from '@oclif/command';
import { cli } from 'cli-ux';
import inquirer = require('inquirer');
const btoa = require('btoa');
const WebSocket = require('ws');

// Project Modules
import { appService } from '../_service/app.service';
import { messages } from '../consts/msg';
import { DetachKey, socketPort } from '../consts/val';
import { common } from '../utils/common';

export default class Exec extends Command {
  static description = 'Execute command on the selected instance';

  static examples = [
    `$ sakku exec`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    interactive: flags.boolean({ char: 'i' }),
    tty: flags.boolean({ char: 't' })
  };

  static args = [
    {
      name: 'app',
      required: true,
      description: 'app id/name',
      hidden: false
    },
    {
      name: 'cmd',
      required: false,
      description: 'command',
      hidden: false,
      default: 'bash'
    }
  ];

  async run() {
    const { args, flags } = this.parse(Exec);
    let appId: string;
    let data;

    if (args.app)
      appId = args.app;
    else
      appId = await cli.prompt(messages.appIdName);


    try {
      // @ts-ignore
      if (!isNaN(appId)) {
        data = (await appService.get(this, appId)).data;
      }
      else {
        data = (await appService.getByName(this, appId)).data
      }

      if (data.error) {
        throw { code: data.code, message: data.message };
      }

      let result = data.result!;
      if (result.instances.length === 0) {
        this.log(messages.noInstance);
      }
      else {
        let instances = result.instances;
        let choices: { name: string }[] = [];
        // @ts-ignore
        instances.forEach(ins => {
          // @ts-ignore
          choices.push({ name: ins.containerId });
        });
        await inquirer.prompt({
          name: 'instance',
          message: 'which instance :',
          type: 'list',
          choices
        })
          .then(async answer => {
            let firstLine = false;
            let initData = {
              AttachStdin: true,
              AttachStdout: true,
              AttachStderr: true,
              DetachKeys: 'ctrl-d',
              Tty: flags.tty,
              Cmd: [
                args.cmd
              ],
              Env: []
            };

            // @ts-ignore
            let url = await instances.find(value => value.containerId === answer.instance!)!.workerHost as string;
            let originUrl = 'https://' + url + ':' + socketPort;

            // @ts-ignore
            let appUrl = 'wss://' + url + ':' + socketPort + '/exec/' + answer.instance + ',' + btoa(args.cmd) + '?app-id=' + appId;

            if (args.cmd.toLowerCase() === 'seyed') {
              this.log('Salam Seyed! 1398/05/06');
            }

            const ws = new WebSocket(appUrl, {
              perMessageDeflate: false,
              origin: originUrl
            });

            ws.on('open', function open() {
              console.log('Connection established successfully');
            });

            ws.on('message', function incoming(data: any) {
              process.stdin.pause();
              process.stdout.write(data);
              process.stdin.resume();
            });

            ws.on('error', function incoming(error: any) {
              console.log('Can not connect to remote host!');
            });

            // @ts-ignore
            let rl = readline.createInterface({
              input: process.stdin,
              output: process.stdout,
              terminal: false,
            });

            if (flags.interactive) {
              process.stdin.on('data', data => {
                data = data.toString();
                ws.send(data);
                if (data == DetachKey) {
                  rl.emit('SIGINT', 'ctrl-d');
                }
              });

              // @ts-ignore
              process.stdin.setRawMode(true);
              process.stdin.resume();

              rl.on('SIGINT', function (data: any) { // SIGINT Signal
                if (data === 'ctrl-d') {
                  ws.emit('end');
                  process.stdin.pause();
                  process.stdout.write(messages.exec_exit_msg);
                  process.exit(0);
                }
              });
            }
          });
      }

    }
    catch (err) {
      common.logError(err);
    }
  }
}
