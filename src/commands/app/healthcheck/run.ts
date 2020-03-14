// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';

// Project Modules
import { appService } from '../../../_service/app.service';
import { messages } from '../../../consts/msg';

export default class Run extends Command {
  static description = 'Get app health check states';

  static examples = [
    `$ sakku app:healthcheck:run
    Enter your app id: APP-ID`,
  ];

  static args = [
    {
      name: 'app',
      required: false,
      description: 'sakku app:healthcheck:rm [appId]',
      hidden: false
    },
    {
      name: 'hid',
      required: false,
      description: 'sakku helthCheck:rm [appId] [hid]',
      hidden: false
    }
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    force: flags.boolean({ char: 'f' }),
    app: flags.string({ char: 'a', description: 'App ID' }),
    hid: flags.string({ char: 'i', description: 'Health Check ID' }),

  };


  async run() {
    const { args, flags } = this.parse(Run);
    let self = this;
    let result: any;
    let appId: string;
    let hId: string;

    if (args.hasOwnProperty('app') && args.app) {
      appId = args.app;
    }
    else if (flags.hasOwnProperty('app') && flags.app) {
      appId = flags.app;
    }
    else {
      appId = await cli.prompt(messages.enter_app_id, { required: true });
    }

    if (args.hasOwnProperty('hid') && args.hid) {
        hId = args.hid;
    }
    else if (flags.hasOwnProperty('hid') && flags.hid) {
        hId = flags.hid;
    }
    else {
        hId = await cli.prompt(messages.enter_health_check_id, { required: true });
    }

    try{
      result = await appService.runHealthCheck(self, appId, hId);
      this.log(JSON.stringify(result.data ,null, 2));
    }catch(e) {
      console.log(e);
    }
  }
}