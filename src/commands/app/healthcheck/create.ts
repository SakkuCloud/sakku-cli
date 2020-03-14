// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';

// Project Modules
import { appService } from '../../../_service/app.service';
import { messages } from '../../../consts/msg';

export default class Create extends Command {
  static description = 'Create health check';

  static examples = [
    `$ sakku app:healthcheck:create
Enter App ID: APP-ID`,
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
    const { args, flags } = this.parse(Create);
    let self = this;
    let result: any;
    let appId: string;
    let data: {
      checkRate: number,
      endpoint: string,
      initialDelay: number,
      responseCode: number,
      responseString: string,
      scheme: string
    } = {
      checkRate: 0,
      endpoint: '',
      initialDelay: 0,
      responseCode: 0,
      responseString: '',
      scheme: '',
    };
  
    if (args.hasOwnProperty('app') && args.app) {
      appId = args.app;
    }
    else if (flags.hasOwnProperty('app') && flags.app) {
      appId = flags.app;
    }
    else {
      appId = await cli.prompt(messages.enter_app_id, { required: true });
    }

    data.checkRate = await cli.prompt(messages.enter_check_rate_for_helath_check, { required: true });
    data.endpoint = await cli.prompt(messages.enter_endpoint_for_helath_check, { required: true });
    data.initialDelay = await cli.prompt(messages.enter_intial_delay_for_helath_check, { required: true });
    data.responseCode = await cli.prompt(messages.enter_response_code_for_helath_check, { required: true });
    data.responseString = await cli.prompt(messages.enter_response_message_for_helath_check, { required: true });
    data.scheme = await cli.prompt(messages.enter_scheme_for_helath_check, { required: true });

    try {
      result = await appService.createHealthCheck(self, appId, data);
      this.log(JSON.stringify(result.data ,null, 2));
    } catch(e) {
      console.log(e);
    }
  }
}