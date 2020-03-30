// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';

// Project Modules
import { domainService } from '../../_service/domain.service';
import { common } from '../../utils/common';
import { messages } from '../../consts/msg';

export default class GetByApp extends Command {
  static description = 'Get domains of app';

  static examples = [
    `$ sakku domain:getByApp
Enter your app id: APP-ID`,
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
    const { args, flags } = this.parse(GetByApp);
    let self = this;
    let domainResult: any;
    let appId: string;
    if (args.hasOwnProperty('app') && args.app) {
      appId = args.app;
    }
    else {
      appId = await cli.prompt(messages.enter_app_id, { required: true });
    }
    
    try {
      domainResult = await domainService.getByApp(self, appId);
      this.log(domainResult.data);
    } catch(e) {
      console.log(e);
    }
  }
}