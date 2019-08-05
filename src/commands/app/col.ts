// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';

// Project Modules
import { appService } from '../../_service/app.service';


export default class Scale extends Command {
  static description = 'add new collaborators, as well ad showing the list of collaborators';

  static examples = [
    `$ sakku app:col`,
    `$ sakku app:col -a`
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    add: flags.boolean({ char: 'a' })
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
    const { args, flags } = this.parse(Scale);
    let self = this;
    let collaborators;
    // @ts-ignore
    let appData, appId: any;
    let colData = {
      accessLevel: 'VIEW',
      email: '',
      imageRegistry: ''
    }

    if (args.hasOwnProperty('app') && args.app) {
      appId = args.app;
    }
    else {
      appId = await cli.prompt('Enter your app id', { required: true });
    }

    appService.getCollaborators(this, appId)
      .then(result => {
        collaborators = result.data.result
        printCollaborators(collaborators);
        if (flags.add) {
          return cli.prompt('Enter your collaborator\'s email: ', { required: true })
            .then(answer => {
              colData.email = answer;
              return appService.addCollaborator(self, appId, colData)
            })
            .then(result => {
              console.log('collaborator added successfully!');
            })
        }
      })
      .catch(function (err) {
        const code = err.code || (err.response && err.response.status.toString());
        if (err.response && err.response.data) {
          console.log('An error occured!', code + ':', err.response.data.message || '');
        }
        else if (err.response && err.response.statusText) {
          console.log('An error occured!', code + ':', err.response.data.statusText || '');
        }
        else if (code === 'ENOENT') {
          console.log('An error occured!', 'You are not logged in');
        }
        else {
          console.log('An error occured!', code);
        }
      });

    function printCollaborators(collaborators: Array<Object>) {
      if (collaborators.length === 0) {
        console.log('Collaborator List is Empty');
      }
      else {
        for (let i = 0; i < collaborators.length; i++) {
          console.log('#', i + 1, '->', JSON.stringify(collaborators[i], null, 2));
        }
      }

    }
  }
}
