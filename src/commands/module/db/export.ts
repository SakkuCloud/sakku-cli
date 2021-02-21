// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';

// Project Modules
import { moduleService } from '../../../_service/module.service';
import { messages } from '../../../consts/msg';

export default class Export extends Command {
  static description = 'Export user database';

  static examples = [
    `$ sakku module:db:export
Enter database id: DB-ID`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    dbid: flags.integer({ char: 'd', description: 'Database ID' }),
  };

  async run() {
    const { flags } = this.parse(Export);
    let self = this;
    let result: any;
    let dbId: number;
    if (flags.hasOwnProperty('dbid') && flags.dbid) {
      dbId = flags.dbid;
    }
    else {
      dbId = await cli.prompt(messages.enter_db_id, { required: true });
    }
    
    try {
      result = await moduleService.dBaseExport(self, dbId);
      this.log(JSON.stringify(result.data ,null, 2));
    } catch(e) {
      console.log(e);
    }
  }
}