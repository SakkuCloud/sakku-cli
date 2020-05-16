// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';

// Project Modules
import { appService } from '../../_service/app.service';
import { messages } from '../../consts/msg';

export default class Commit extends Command {
  static description = 'Commit application container';

  static examples = [
    `$ sakku image:commit
        Enter your app id : APP-ID
        Enter container id : CONTAINER-ID
        Change restart image to this image? : (y/n)
        Enter version of application : TAG
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    app: flags.integer({ char: 'a', description: 'App ID' }),
    cid: flags.integer({ char: 'c', description: 'CONTAINER ID' }),
    tag: flags.string({ char: 't', description: 'Repository Tag' }),
    isRestart: flags.boolean({ char: 'r', description: 'Is Restart Image' }),
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
    const { flags, args } = this.parse(Commit);
    let self = this;
    let result: any;
    let appId: number;
    let containerId: number;
    let tag: string;
    let isRestartImage: boolean;
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

    if (flags.hasOwnProperty('cid') && flags.cid) {
        containerId = flags.cid;
    }
    else {
        containerId = await cli.prompt(messages.enter_container_id + messages.commit_oldest_contailer, { required: false });
    }

    if (flags.hasOwnProperty('tag') && flags.tag) {
        tag = flags.tag;
    } 
    else {
        tag = await cli.prompt(messages.enter_tag_for_commit, { required: false });
    }

    if (flags.hasOwnProperty('isRestart')) {
        isRestartImage = true;
    } 
    else {
        isRestartImage = await cli.confirm(messages.change_restart_image_to_this_image);
    }

    data = {
        containerId,
        tag,
        isRestartImage
    }
    
    try {
      result = await appService.commit(self, appId, data);
      this.log(JSON.stringify(result.data ,null, 2));
    } catch(e) {
      console.log(e);
    }
  }
}