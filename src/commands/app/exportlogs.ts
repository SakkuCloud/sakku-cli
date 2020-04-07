// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import color from '@oclif/color';
const fs = require("fs");
// const moment = require('moment')

// Project Modules
import { appService } from '../../_service/app.service';
import { common } from '../../utils/common';
import { messages } from '../../consts/msg';
import { readToken } from '../../utils/read-token';
import { emptyDir } from 'fs-extra';

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
    file: flags.string({ char: 'f', description: 'sakku app:logsexport -f/-file [FILE-ADDRESS]' }),
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
    {
      name: 'file',
      required: false,
      description: 'app:logsexport [APP-ID] [FROM-DATE] [TO-DATE] [FILE-ADRRESS]',
      hidden: false
    },
  ];

  async run() {
    const { args, flags } = this.parse(ExportLogs);
    let self = this;
    let appId: string;
    let from: string;
    let fileDir: string;
    let to: string;
    let data : any = {};
    let result : any;
    let dateReg = /^\d{4}([./-])\d{2}\1\d{2}$/;

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

    if (args.hasOwnProperty('file') && args.file) {
        fileDir = args.file;
    }
    else if (flags.hasOwnProperty('file') && flags.file) {
        fileDir = flags.file;
    }
    else {
        fileDir = await cli.prompt(messages.enter_file_dir, { required: false });
    }

    if (typeof from !== 'undefined') {
        let matches = from.match(dateReg);
        let dt_from = matches ? new Date(from + ' 00:00:00') : new Date(from);
        data.fromDate = dt_from.getTime();
    }

    if (typeof to !== 'undefined') {
        let matches = from.match(dateReg);
        let dt_to = matches ? new Date(to + ' 23:59:59'): new Date(from);
        data.toDate = dt_to.getTime();
    }
    
    try {
        result = await appService.exportLogs(self, appId, data);
        if (typeof fileDir !== 'undefined'){
            console.log(fileDir);
            let today = new Date();
            let date = today.getFullYear() +'-' + (today.getMonth() + 1) + '-' + today.getDate();
            let time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
            let nowDateTime = date + '_' + time;
            let fileName = 'log_' + appId + '_' + nowDateTime + '.txt';
            let file_full_path = fileDir + '/' + fileName;
            fs.writeFile(file_full_path, result.data, (error: any) => {
              if(error){
                  return console.log('fileError:' + error);
              }
              else
              {
                this.log(messages.log_file_create_success + file_full_path);
              }
            });   
        }else if (result.data === ''){  
            console.log(messages.empty_log);
        }
        else {
            console.log(JSON.stringify(result.data, null , 2));
        }
      } catch(e) {
        common.logError(e);
    }
  }
}

