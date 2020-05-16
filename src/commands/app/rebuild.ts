// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';
const util = require('util');
const exec = util.promisify(require('child_process').exec);


// Project Modules
import { appService } from '../../_service/app.service';
import { messages } from '../../consts/msg';
import { sakkuRegUrl, gitlabRegUrl } from '../../consts/val';
import { common } from '../../utils/common';
import { triggerAsyncId } from 'async_hooks';

export default class Rebuild extends Command {
  static description = 'rebuild application source';

  static examples = [
    `$ sakku app:rebuild
      Enter your app id : APP-ID
      Enter build Arguments : BUILD-ARGS`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    app: flags.integer({ char: 'a', description: 'App ID' }),
    build_args: flags.string({ char: 'b', description: 'Build Arguments' }),
  };


  async run() {
    const { flags } = this.parse(Rebuild);
    let self = this;
    let appId: number;
    let buildArgs: string = '';
    let result: any;
  
    // let buildArgs: string[] = [];

    if (flags.hasOwnProperty('app') && flags.app) {
      appId = flags.app;
    }
    else {
        do{
            appId = await cli.prompt(messages.enter_app_id, { required: true });
        } while(isNaN(Number(appId)));
    }

    // build arguments
    if (flags.hasOwnProperty('build_args') && flags.build_args) {
      buildArgs = flags.build_args;
    }
    else {
      while (await cli.confirm(messages.more_build_args)) {
        // let inpArg: string = await cli.prompt(messages.enter_build_arg);
        // buildArgs.push(inpArg);
        buildArgs = buildArgs + ',' + await cli.prompt(messages.enter_build_arg, { required: false });
      }
    }

    let data = [
      buildArgs
    ]

    try {
      result = await appService.rebuild(self, appId, data);
      this.log(JSON.stringify(result.data ,null, 2));
    } catch(e) {
      console.log(e);
    }
  }
}
