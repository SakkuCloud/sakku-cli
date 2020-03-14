// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';

// Project Modules
import { appService } from '../../../_service/app.service';
import { messages } from '../../../consts/msg';

export default class All extends Command {
  static description = 'Get app health check states';

  static examples = [
    `$ sakku app:healthcheck:all
    Enter your app id: APP-ID`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    app: flags.string({ char: 'a', description: 'App ID' }),
  };

  static args = [
    {
      name: 'app',
      required: false,
      description: 'sakku app:healthcheck:create [App-ID]',
      hidden: false
    }
  ];

  async run() {
    const { args, flags } = this.parse(All);
    let self = this;
    let result: any;
    let appId: string;

    if (args.hasOwnProperty('app') && args.app) {
      appId = args.app;
    }
    else if (flags.hasOwnProperty('app') && flags.app) {
      appId = flags.app;
    }
    else {
      appId = await cli.prompt(messages.enter_app_id, { required: true });
    }
    try{
      result = await appService.allHealthCheck(self, appId);
      this.log(JSON.stringify(result.data ,null, 2));
    }catch(e) {
      console.log(e);
    }
  }
}