// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';

// Project Modules
import { appService } from '../../_service/app.service';
import { messages } from '../../consts/msg';

export default class Restart extends Command {
  static description = 'Restart application by id';

  static examples = [
    `$ sakku image:restart
Enter your app id : APP-ID
Do you want to commit this application before stopping it? : (y/n)
Enter tag for stopped application : TAG-STOP
Do you want to start this application from specific version? : (y/n)
Enter version of application you want to start from : TAG-START
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    app: flags.integer({ char: 'a', description: 'App ID' }),
    cstart: flags.boolean({ char: 's', description: 'Start aplication from spesific version' }),
    tstart: flags.string({ char: 'v', description: 'Start application from this tag', dependsOn:['cstart'] }),
    cstop: flags.boolean({ char: 'c', description: 'Commit application before stop it' }),
    tstop: flags.string({ char: 't', description: 'Tag for stopped application', dependsOn:['cstop'] }),
  };

  static args = [
    {
      name: 'app',
      required: false,
      description: 'app id/name',
      hidden: false
    },
  ];

  async run() {
    const { flags, args } = this.parse(Restart);
    let self = this;
    let result: any;
    let appId: number;
    let tagStart: string = '';
    let tagStop: string = '';
    let commitStop: boolean = false;
    let commitStart: boolean = false;
    let data = {};

    if (args.hasOwnProperty('app') && args.app) {
      appId = args.app;
    }
    else if (flags.hasOwnProperty('app') && flags.app) {
        appId = flags.app;
    }
    else {
        do{
            appId = await cli.prompt(messages.enter_app_id, { required: true });
        } while(isNaN(Number(appId)));
    }

    if (flags.hasOwnProperty('cstop')) {
      commitStop = true;
    } 
    else {
      commitStop = await cli.confirm(messages.commit_before_stop_app);
    }

    if(commitStop) {
      if (flags.hasOwnProperty('tstop') && flags.tstop) {
        tagStop = flags.tstop;
      } 
      else {
          tagStop = await cli.prompt(messages.enter_tag_for_commit, { required: false });
      }
    }

    if (flags.hasOwnProperty('cstart')) {
      commitStart = true;
    } 
    else {
      commitStart = await cli.confirm(messages.start_app_from_specific_version);
    }

    if(commitStart) {
      if (flags.hasOwnProperty('tstart') && flags.tstart) {
        tagStart = flags.tstart;
      } 
      else {
        tagStart = await cli.prompt(messages.enter_tag_for_start, { required: false });
      }
    }

    data = {
      commitStart,
      tagStart,
      commitStop,
      tagStop
    }
    
    try {
      result = await appService.restart(self, appId, data);
      this.log(JSON.stringify(result.data ,null, 2));
    } catch(e) {
      console.log(e);
    }
  }
}