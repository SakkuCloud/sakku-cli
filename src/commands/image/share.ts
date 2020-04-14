// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';

// Project Modules
import { dockerRepositoryService } from '../../_service/docker.repository.service';
import { messages } from '../../consts/msg';

export default class Share extends Command {
  static description = 'Share image';

  static examples = [
    `$ sakku image:share
Enter your repoName : REPO-NAME
Enter your repoTag : REPO-TAG
Enter email of target person: EMAIL `,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    name: flags.string({ char: 'n', description: 'Repository Name' }),
    tag: flags.string({ char: 't', description: 'Repository Tag' }),
    email: flags.string({ char: 'e', description: 'Target User Email' }),
  };

  static args = [
    {
      name: 'repoName',
      required: false,
      description: 'sakku image:share [repoName]',
      hidden: false
    },
    {
      name: 'repoTag',
      required: false,
      description: 'sakku image:share [repoName] [repoTag]',
      hidden: false
    },
    {
      name: 'email',
      required: false,
      description: 'sakku image:share [repoName] [repoTag] [email]',
      hidden: false
    },
  ];

  async run() {
    const { args, flags } = this.parse(Share);
    let self = this;
    let result: any;
    let repoName: string;
    let repoTag: string;
    let email: string;
    let data = {};

    if (flags.hasOwnProperty('name') && flags.name) {
        repoName = flags.name;
    }
    else if (args.hasOwnProperty('repoName') && args.repoName) {
      repoName = args.repoName;
    }
    else {
      repoName = await cli.prompt(messages.enter_image_name, { required: true });
    }

    if (flags.hasOwnProperty('tag') && flags.tag) {
        repoTag = flags.tag;
    } 
    else if (args.hasOwnProperty('repoTag') && args.repoTag) {
        repoTag = args.repoTag;
    }
    else {
        repoTag = await cli.prompt(messages.enter_local_image_tag, { required: true });
    }

    if (flags.hasOwnProperty('email') && flags.email) {
        email = flags.email;
    } 
    else if (args.hasOwnProperty('email') && args.email) {
        email = args.email;
    }
    else {
      email = await cli.prompt(messages.enter_target_user_email, { required: true });
    }

    data = {
      email
    }
    
    try {
      result = await dockerRepositoryService.share(self, repoName, repoTag, data);
      this.log(JSON.stringify(result.data ,null, 2));
      
    } catch(e) {
      console.log(e);
    }
  }
}