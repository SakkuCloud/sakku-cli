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
    },
    {
      name: 'type',
      required: false,
      description: 'sakku domain:record:update [domain] [recordName] [type]',
      hidden: false
    }
  ];

  async run() {
    const { args, flags } = this.parse(Update);
    let self = this;
    let result: any;
    let domain: string;
    let name: string;
    let type: string;
    let typeObj: {'type' : string};
    let data : {
      name: string, 
      ttl: number, 
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
      comments: [], 
      records: []
    };
    let question = {
      name: 'type',
      message: messages.select_type_of_record_for_update,
      type: 'list',
      choices: ['SOA','A','AAAA','CAA','CNAME','MX','PTR','SPF','SRV','TXT','LOC','NS']
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
      typeObj = await inquirer.prompt([question]);
      type = typeObj.type;
    }

    do {
      data.ttl = await cli.prompt(messages.enter_record_ttl, { required: true });
    } while (isNaN(Number(data.ttl)));

    do {
      let recordDomain : {'content': string,'disabled': boolean} = {'content': '','disabled': false};
      recordDomain.content = await cli.prompt(messages.enter_record_content, { required: true });
      recordDomain.disabled = await cli.prompt(messages.record_is_disabled, { required: true });
      data.records.push(recordDomain); 
    } while (await cli.confirm(messages.add_any_records));

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
      result = await domainService.updateRecord(self, domain, name, type, data);
      this.log(JSON.stringify(result.data ,null, 2));
    } catch(e) {
      console.log(e);
    }
  }
}