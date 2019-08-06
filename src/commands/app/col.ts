// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';

// Project Modules
import { appService } from '../../_service/app.service';

export default class Col extends Command {
  static description = 'add new collaborators, as well ad showing the list of collaborators';

  static examples = [
    `$ sakku app:col`,
    `$ sakku app:col -a`
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    add: flags.boolean({ char: 'a', exclusive: ['edit', 'delete'] }),
    edit: flags.boolean({ char: 'e', exclusive: ['add', 'delete'] }),
    delete: flags.boolean({ char: 'e', exclusive: ['add', 'edit'] }),
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
    const { args, flags } = this.parse(Col);
    let self = this;
    let collaborators;
    // @ts-ignore
    let appData, appId: any;

    let question = {
      name: 'accessLevel',
      message: 'Choose your Access Level: ',
      type: 'list',
      choices: ['VIEW', 'MODERATE', 'MODIFY']
    };

    if (args.hasOwnProperty('app') && args.app) {
      appId = args.app;
    }
    else {
      appId = await cli.prompt('Enter your app id', { required: true });
    }

    if (flags.add) {
      addCol();
    }
    else if (flags.edit) {
      editCol();
    }
    else if (flags.delete) {
      deleteCol();
    }
    else {
      getAllCollaborators();
    }

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

    function getAllCollaborators() {
      appService.getCollaborators(self, appId)
        .then(result => {
          collaborators = result.data.result
          printCollaborators(collaborators);
        })
        .catch(function (err) {
          handleError(err);
        });
    }

    function addCol() {
      let colData = {
        accessLevel: 'VIEW',
        email: '',
        imageRegistry: ''
      }
      return cli.prompt('Enter your collaborator\'s email', { required: true })
        .then(answer => {
          colData.email = answer;
          return inquirer.prompt([question])
        })
        .then(function (answer) {
          // @ts-ignore
          colData.accessLevel = answer;
          return cli.prompt('Enter your collaborator\'s image registry (Optional)', { required: false });
        })
        .then(function (answer) {
          // @ts-ignore
          colData.imageRegistry = answer;
          return appService.addCollaborator(self, appId, colData)
        })
        .then(result => {
          console.log('collaborator added successfully!');
        })
        .catch(function (err) {
          handleError(err);
        })
    }

    function editCol() {
      let cid: string;
      let colData = {
        accessLevel: 'VIEW',
        email: '',
        imageRegistry: ''
      }
      cli.prompt('Enter your collaborator\'s id', { required: true })
        .then(function (answer) {
          cid = answer;
          return cli.prompt('Enter your collaborator\'s email', { required: true })
        })
        .then(answer => {
          colData.email = answer;
          return inquirer.prompt([question])
        })
        .then(function (answer) {
          // @ts-ignore
          colData.accessLevel = answer;
          return cli.prompt('Enter your collaborator\'s image registry (Optional)', { required: false });
        })
        .then(function (answer) {
          // @ts-ignore
          colData.imageRegistry = answer;
          return appService.editCollaborator(self, appId, cid, colData)
        })
        .then(result => {
          console.log('collaborator edited successfully!');
        })
        .catch(function (err) {
          handleError(err);
        })
    }

    function deleteCol() {
      let cid: string;
      let colData = {
        accessLevel: 'VIEW',
        email: '',
        imageRegistry: ''
      }
      cli.prompt('Enter your collaborator\'s id', { required: true })
        .then(function (answer) {
          cid = answer;
          return appService.deleteCollaborator(self, appId, cid)
        })
        .then(result => {
          console.log('collaborator deleted successfully!');
        })
        .catch(function (err) {
          handleError(err);
        })
    }

    // @ts-ignore
    function handleError(err) {
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
    }
  }
}
