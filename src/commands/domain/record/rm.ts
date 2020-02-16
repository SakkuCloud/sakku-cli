import { Command, flags } from '@oclif/command';
import * as inquirer from 'inquirer';
import cli from 'cli-ux';

// Project Modules
import { domainService } from '../../../_service/domain.service';
import { messages } from '../../../consts/msg';

export default class RM extends Command {
  static description = 'Remove record of domain by name and type that are unique';

  static examples = [
    `$ sakku domain:record:rm
Enter domain: DOMAIN-NAME
Enter name of record: RECORD-NAME
Enter type of record: RECORD-TYPE
are you really sure to remove this record of domain? (y/n): y`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    force: flags.boolean({ char: 'f' })
  };
  static args = [
    {
      name: 'domain',
      required: false,
      description: 'sakku domain:record:rm [domain]',
      hidden: false
    },
    {
      name: 'recordName',
      required: false,
      description: 'sakku domain:record:rm [domain] [recordName]',
      hidden: false
    },
    {
      name: 'type',
      required: false,
      description: 'sakku domain:record:rm [domain] [recordName] [type]',
      hidden: false
    },
  ];

  async run() {
    let self = this;
    let result: any;
    let type: string;
    let domain: string;
    let name: string;
    let data = {};
    const { args, flags } = this.parse(RM);

    let question = {
      name: 'type',
      message: messages.select_record_type,
      type: 'list',
      choices: ['SOA','A','AAAA','CAA','CNAME','MX','PTR','SPF','SRV','TXT',
'LOC',
        'NS']
    };
  
    if (args.hasOwnProperty('domain') && args.domain) {
      domain = args.domain;
    }
    else {
      domain = await cli.prompt(messages.enter_domain, { required: true });
    }

    if (args.hasOwnProperty('recordName') && args.recordName) {
      name = args.recordName;
    }
    else {
      name = await cli.prompt(messages.enter_record_name, { required: true });
    }

    if (args.hasOwnProperty('type') && args.type) {
      type = args.type;
    }
    else {
      type = await inquirer.prompt([question]);
    }

    let sendObj = {
      domain,
      name,
      type
    };

    if (flags.force) {
      await cli.action.start(messages.w8_msg);
      try {
        result = await domainService.rmRecord(self, sendObj);
        this.log(JSON.stringify(result.data ,null, 2));
        cli.action.stop(messages.domain_removed_successfully);
      } catch(e) {
        cli.action.stop(JSON.stringify(e ,null, 2));
      } 
    } 
    else {
      let confimation = await cli.confirm(messages.domain_delete_confirmation);
      if (confimation) {
        await cli.action.start(messages.w8_msg);
        try {
          result = await domainService.rmRecord(self, sendObj);
          this.log(JSON.stringify(result.data ,null, 2));
          cli.action.stop(messages.domain_removed_successfully);
        } catch(e) {
          cli.action.stop(JSON.stringify(e ,null, 2));
        }
      } 
      else {
        this.log(messages.domain_delete_operation_was_canceled);
      }
    }
  }
}
