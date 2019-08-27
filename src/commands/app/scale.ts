// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';

// Project Modules
import { appService } from '../../_service/app.service';
import { common } from '../../utils/common';
import { messages } from '../../consts/msg';

export default class Scale extends Command {
  static description = 'scale app';

  static examples = [
    `$ sakku app:scale
Enter your app id: APP-ID
Enter your new Configuration`,
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };

  static args = [
    {
      name: 'app',
      required: false,
      description: 'app id/name',
      hidden: false
    },
  ];

  async run() {
    const { args, flags } = this.parse(Scale);
    let self = this;
    let appData: any;
    let appId: string;
    if (args.hasOwnProperty('app') && args.app) {
      appId = args.app;
    }
    else {
      appId = await cli.prompt(messages.enter_app_id, { required: true });
    }
    let question = {
      name: 'config',
      message: 'Choose your configuration: ',
      type: 'list',
      choices: ['Manual', 'CPU', 'Memory', 'CPU and Memory', 'CPU or Memory']
    };
    let scalingMode;
    // {
    //   "cpu": 0,
    //   "disk": 0,
    //   "instances": 0,
    //   "mem": 0,
    //   "ports": [
    //     {
    //       "containerPort": 0,
    //       "protocol": "HTTP"
    //     }
    //   ],
    //   "scalingMode": "OFF"
    // }
    let sendData = {
      cpu: null,
      disk: null,
      instances: 0,
      mem: null,
      ports: null,
      scalingMode: ''
    }
    let mode: string;
    let minInstances: number;
    let maxInstances: number;


    appService.get(this, appId)
      .then(function (result) {
        appData = result.data.result; minInstances = appData.configuration.minInstances; maxInstances = appData.configuration.maxInstances;
        let scalingMode = appData.configuration.scalingMode;
        if (scalingMode.toLowerCase() === 'off') {
          scalingMode = 'Manual'
        }
        else if (scalingMode.toLowerCase() === 'and') {
          scalingMode = 'CPU and Memory'
        }
        else if (scalingMode.toLowerCase() === 'mem') {
          scalingMode = 'Memory'
        }
        else if (scalingMode.toLowerCase() === 'or') {
          scalingMode = 'CPU or Memory'
        }
        console.log('Your Current Scaling Mode is: ', scalingMode);
        return inquirer.prompt([question])
      })
      .then(function (answer) {
        // @ts-ignore
        mode = getScalingMode(answer);
        sendData.scalingMode = mode;
        // @ts-ignore
        if (answer.config === 'Manual') {
          return getInstanceValue('Enter your scale value:', minInstances, maxInstances)
          // @ts-ignore
          // return getInstanceValue(enter_your_core_msg, 1, 10)
          //   // @ts-ignore
          //   .then(function (answer) {
          //     sendData.cpu = parseInt(answer);
          //     return getInstanceValue(enter_your_ram_msg, 1, 10)
          //   })
          //   // @ts-ignore
          //   .then(function (answer) {
          //     sendData.mem = parseInt(answer);
          //     return getInstanceValue(enter_your_disk_msg, 1, 10)
          //   })
          //   // @ts-ignore
          //   .then(function (answer) {
          //     sendData.disk = parseInt(answer);
          //     return;
          //   })
        }
      })
      .then(function (answer) {
        sendData.instances = answer;
        return appService.scale(self, appId, sendData)
      })
      .then(function (result) {
        console.log('Your new Configuration is saved.');
      })
      .catch(function (err) {
        common.logError(err);
      });

    // @ts-ignore
    function getInstanceValue(message: string, minInstances: number, maxInstances: number) {
      let newMessage = message + ' (min:' + minInstances + ' ,max: ' + maxInstances + ')';
      return cli.prompt(newMessage, { required: true })
        .then(function (answer) {
          if (!(parseInt(answer) >= minInstances && parseInt(answer) <= maxInstances)) {
            return getInstanceValue(message, minInstances, maxInstances);
          }
          else {
            return answer;
          }
        });
    }

    function getScalingMode(answer: { config: string }) {
      let mode: string = '';
      switch (answer.config) {
        case 'Manual':
          mode = 'OFF'
          break;
        case 'CPU':
          mode = 'CPU'
          break;
        case 'Memory':
          mode = 'MEM'
          break;
        case 'CPU and Memory':
          mode = 'AND'
          break;
        case 'CPU or Memory':
          mode = 'OR'
          break;
      }
      return mode;
    }
  }
}
