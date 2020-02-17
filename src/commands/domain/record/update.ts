// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';

// Project Modules
import { domainService } from '../../../_service/domain.service';
import { messages } from '../../../consts/msg';

export default class Update extends Command {
  static description = 'Update record of user domains';

  static examples = [
    `$ sakku domain:record:update
Enter domain: DOMAIN-NAME
Enter name of record: RECORD-NAME
Enter type of record: RECORD-TYPE`,
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };

  static args = [
    {
      name: 'domain',
      required: false,
      description: 'sakku domain:record:update [domain]',
      hidden: false
    },
    {
      name: 'recordName',
      required: false,
      description: 'sakku domain:record:update [domain] [recordName]',
      hidden: false
    }
  ];

  async run() {
    const { args, flags } = this.parse(Update);
    let self = this;
    let result: any;
    let domain: string;
    let name: string;
    let data = {};

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

      let record : {
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

      record.name = await cli.prompt(messages.enter_record_name, { required: true });

      do {
        record.ttl = await cli.prompt(messages.enter_record_ttl, { required: true });
      } while (isNaN(Number(record.ttl)));

      record.type = await inquirer.prompt([question]);
      while (await cli.confirm(messages.add_any_records)){
        let recordDomain : {'content': string,'disabled': boolean} = {'content': '','disabled': false};
        recordDomain.content = await cli.prompt(messages.enter_record_content, { required: true });
        recordDomain.disabled = await cli.prompt(messages.record_is_disabled, { required: true });
      }

      while (await cli.confirm(messages.add_any_record_comments)){
        let comment : {'account':string ,'content': string, 'modified_at': number} = {'account': '', 'content': '','modified_at': 0};
        comment.account = await cli.prompt(messages.enter_record_comment_account, { required: true });
        comment.content = await cli.prompt(messages.enter_record_comment_content, { required: true });
        do {
          comment.modified_at = await cli.prompt(messages.record_comment_modified_at, { required: true });
        } while (isNaN(Number(record.ttl)));
        record.comments.push(comment); 
      }

    try {
      result = await domainService.updateRecord(self, domain, name, record);
      this.log(JSON.stringify(result.data ,null, 2));
    } catch(e) {
      console.log(e);
    }
  }
}