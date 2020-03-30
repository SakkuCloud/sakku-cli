// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import color from '@oclif/color';

// Project Modules
import { appService } from '../../_service/app.service';
import { common } from '../../utils/common';
import { messages } from '../../consts/msg';
import { readToken } from '../../utils/read-token';

export default class ExportLogs extends Command {
  static description = 'Shows logs of an app';

  static examples = [
    `$ sakku app:logs`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    app: flags.string({ char: 'a', description: 'sakku app:logsexport -a/-app [APP-ID]' }),
    from: flags.string({ char: 'f', description: 'sakku app:logsexport -f/-from  [FROM-DATE]' }),
    to: flags.string({ char: 't', description: 'sakku app:logsexport -t/-to [TO-DATE]' }),
  };

  static args = [
    {
      name: 'app',
      required: false,
      description: 'app:logsexport [APP-ID]',
      hidden: false
    },
    {
        name: 'from',
        required: false,
        description: 'app:logsexport [APP-ID] [FROM-DATE]',
        hidden: false
    },
    {
        name: 'to',
        required: false,
        description: 'app:logsexport [APP-ID] [FROM-DATE] [TO-DATE]',
        hidden: false
    },
  ];

  async run() {
    const { args, flags } = this.parse(ExportLogs);
    let self = this;
    let appId: string;
    let from: string;
    let to: string;
    let data : any = {};
    let result : any;

    data.token = readToken(self);
    if (args.hasOwnProperty('app') && args.app) {
        appId = args.app;
    }
    else if (flags.hasOwnProperty('app') && flags.app) {
        appId = flags.app;
    }
    else {
        appId = await cli.prompt(messages.enter_app_id, { required: true });
    }

    if (args.hasOwnProperty('from') && args.from) {
        from = args.from;
    }
    else if (flags.hasOwnProperty('from') && flags.from) {
        from = flags.from;
    }
    else {
        from = await cli.prompt(messages.enter_from_date, { required: false });
    }

    if (args.hasOwnProperty('to') && args.to) {
        to = args.to;
    }
    else if (flags.hasOwnProperty('to') && flags.to) {
        to = flags.to;
    }
    else {
        to = await cli.prompt(messages.enter_to_date, { required: false });
    }

    if (typeof from !== 'undefined') {
        let dt_from = new Date(from + ' 00:00:00');
        data.fromDate = dt_from.getTime();
    }

    if (typeof to !== 'undefined') {
        let dt_to = new Date(to + ' 23:59:59');
        data.toDate = dt_to.getTime();
    }
    
    try {
        result = await appService.exportLogs(self, appId, data);
        this.log(JSON.stringify(result.data ,null, 2));
      } catch(e) {
        common.logError(e);
    }
  }
}

