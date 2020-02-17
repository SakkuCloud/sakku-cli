// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';

// Project Modules
import { domainService } from '../../../_service/domain.service';
import { messages } from '../../../consts/msg';

export default class Add extends Command {
  static description = 'add domain';

  static examples = [
    `$ sakku domain:add
Enter your app id: APP-ID
Enter your app domain`,
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };

  static args = [
    {
      name: 'domain',
      required: false,
      description: 'sakku domain:record:add [domain]',
      hidden: false
    }
  ];

  async run() {
    const { args, flags } = this.parse(Add);
    let self = this;
    let result: any;
    let domain: string;

    if (args.hasOwnProperty('domain') && args.domain) {
      domain = args.domain;
    }
    else {
      domain = await cli.prompt(messages.enter_domain, { required: true });
    }

      let data : {
        name: string, 
        ttl: number, 
        type: string, 
        comments: {
          'account': string,
          'content': string,
          'modified_at': number,
        }[], 
        records: {
          'content': string,
          'disabled': boolean
        }[]
      } = {
        name: '', 
        ttl: 0, 
        type: '', 
        comments: [], 
        records: []
      };
      let question = {
        name: 'type',
        message: messages.select_record_type,
        type: 'list',
        choices: ['SOA','A','AAAA','CAA','CNAME','MX','PTR','SPF','SRV','TXT','LOC','NS']
      };

      data.name = await cli.prompt(messages.enter_record_name, { required: true });

      do {
        data.ttl = parseInt(await cli.prompt(messages.enter_record_ttl, { required: true }));
      } while (isNaN(Number(data.ttl)));

      data.type = (await inquirer.prompt([question])).type;
      while (await cli.confirm(messages.add_any_records)){
        let recordDomain : {'content': string,'disabled': boolean} = {'content': '','disabled': false};
        recordDomain.content = await cli.prompt(messages.enter_record_content, { required: true });
        recordDomain.disabled = await cli.prompt(messages.record_is_disabled, { required: true });
        data.records.push(recordDomain); 
      }

      while (await cli.confirm(messages.add_any_record_comments)){
        let comment : {'account':string ,'content': string, 'modified_at': number} = {'account': '', 'content': '','modified_at': 0};
        comment.account = await cli.prompt(messages.enter_record_comment_account, { required: true });
        comment.content = await cli.prompt(messages.enter_record_comment_content, { required: true });
        do {
          comment.modified_at = parseInt(await cli.prompt(messages.record_comment_modified_at, { required: true }));
        } while (isNaN(Number(data.ttl)));
        data.comments.push(comment); 
      }

    try {
      result = await domainService.addRecord(self, domain, data
      );
      this.log(result);
    } catch(e) {
      console.log(e);
    }
  }
}