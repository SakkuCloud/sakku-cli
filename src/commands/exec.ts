// Native Modules
import * as readline from 'readline';

// External Modules
import { Command, flags } from '@oclif/command';
import { cli } from 'cli-ux';
import inquirer = require('inquirer');
const btoa = require('btoa');
const WebSocket = require('ws');
const keypress = require('keypress');

// Project Modules
import { appService } from '../_service/app.service';
import { execService } from '../_service/exec.service';
import { exec_exit_msg } from '../consts/msg';
import { DetachKey } from '../consts/val';
import { originUrl } from '../consts/urls';

export default class Exec extends Command {
  static description = 'execute command on instance';

  static examples = [
    `$ sakku exec
`,
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
    }, {
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
          }).then(async answer => {
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
            console.log(answer, url)

            let appUrl = 'wss://worker.sakku.cloud:7221/exec/bb8fa29e323177f32e6c1ed96e7e2de9b1a25de17774d403c942fbf613918b76,YmFzaA==?app-id=556'

            // @ts-ignore
            let rl = readline.createInterface({
              input: process.stdin,
              output: process.stdout,
              terminal: false,
            });

            if (flags.interactive || args.cmd === 'bash') {
              let whatIsTyped = '';
              let lastPressedKey = null;
              // let flag = true;

              const ws = new WebSocket(appUrl, {
                perMessageDeflate: false,
                origin: originUrl
              });

              keypress(process.stdin);

              process.stdin.on('keypress', function (ch, key) {
                lastPressedKey = key;
                // console.log('========>!!!', whatIsTyped, key.sequence, whatIsTyped !== key.sequence);
                //if (whatIsTyped !== key.sequence) {
                  if (key && key.name === 'up') { // up key pressed
                    // console.log('up key is pressed');
                    //whatIsTyped = '';
                    ws.send(key.sequence);
                  }
                  else if (key && key.name === 'down') { // down key pressed
                    // console.log('down key is pressed');
                    //whatIsTyped = '';
                    ws.send(key.sequence);
                  }
                  else if (key && key.name === 'tab') { // tab pressed
                    // console.log('tab is pressed');
                    //if (lastPressedKey.name != 'tab' && whatIsTyped.length === 0) {
                      ws.send(key.sequence);
                    //}
                  }
                  else if (key && key.name === 'return') { // enter pressed
                    // console.log('enter key is pressed');
                    whatIsTyped = key.sequence;
                    ws.send(whatIsTyped);
                    //whatIsTyped = '';
                  }
                  else if (key && key.ctrl && key.name == 'd') { // ctrl + d pressed
                    // console.log('ctrl + d is pressed');
                    rl.emit('SIGINT', 'ctrl-d');
                  }
                  else {
                    whatIsTyped = key.sequence;
                    ws.send(whatIsTyped);
                    // process.stdout.write(whatIsTyped);
                  }
                //}
              });

              // @ts-ignore
              process.stdin.setRawMode(true);
              process.stdin.resume();

              rl.on('SIGINT', function (data: any) { // SIGINT Signal
                if (data === 'ctrl-d') {
                  ws.emit('end');
                  process.stdin.pause();
                  process.stdout.write(exec_exit_msg);
                  process.exit(0);
                }
                else {
                  // ws.send()
                }
              });

              ws.on('open', function open() {
                // console.log('Socket Initialized Sucessfully.');
              });

              ws.on('message', function incoming(data: any) {
                process.stdin.pause();
                process.stdout.write(data);
                process.stdin.resume();
              });

              ws.on('error', function incoming(error: any) {
                console.log('Socket Error.');
              });
            }
            else {
              console.log('Currently just bash is supported');
              rl.close();
            }
          });
        }
      }
    } catch (err) {
      this.log(err);
      const code = err.code || (err.response && err.response.status.toString());
      // this.log('code:', code, err.response.data.message || '');
    }
  }
}
