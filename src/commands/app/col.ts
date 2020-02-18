// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';

// Project Modules
import { appService } from '../../_service/app.service';
import { common } from '../../utils/common';
import { messages } from '../../consts/msg';

export default class Col extends Command {
  static description = 'Adds new collaborators, as well ad showing the list of collaborators';

  static examples = [
    `$ sakku app:col`,
    `$ sakku app:col -a`,
    `$ sakku app:col -e`,
    `$ sakku app:col -d`
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    add: flags.boolean({ char: 'a', description: 'Add collaborators', exclusive: ['edit', 'delete'] }),
    edit: flags.boolean({ char: 'e', description: 'Edit collaborators', exclusive: ['add', 'delete'] }),
    delete: flags.boolean({ char: 'e', description: 'Delete collaborators', exclusive: ['add', 'edit'] }),
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
    let appId: string;

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
      appId = await cli.prompt(messages.enter_app_id, { required: true });
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
        console.log(messages.empty_list);
      }
      else {
        for (let i = 0; i < collaborators.length; i++) {
          console.log((i + 1) + '-', JSON.stringify(collaborators[i], null, 2));
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
          common.logError(err);
        });
    }

    function addCol() {
      let colData: { accessLevel: string, email: string, imageRegistry: string } = {
        accessLevel: 'VIEW',
        email: '',
        imageRegistry: ''
      }
      return cli.prompt(messages.enter_col_email, { required: true })
        .then(answer => {
          colData.email = answer;
          return inquirer.prompt([question])
        })
        .then(function (answer: any) {
          // @ts-ignore
          console.log(answer);
          colData.accessLevel = answer.accessLevel;
          return cli.prompt(messages.enter_col_image_reg, { required: false });
        })
        .then(function (answer) {
          colData.imageRegistry = answer;
          return appService.addCollaborator(self, appId, colData)
        })
        .then(result => {
          console.log(messages.col_add_success);
        })
        .catch(function (err) {
          common.logError(err);
        })
    }

    function editCol() {
      let cid: string;
      let colData = {
        accessLevel: 'VIEW',
        email: '',
        imageRegistry: ''
      }
      cli.prompt(messages.enter_col_id, { required: true })
        .then(function (answer) {
          cid = answer;
          return cli.prompt(messages.enter_col_email, { required: true })
        })
        .then(answer => {
          colData.email = answer;
          return inquirer.prompt([question])
        })
        .then(function (answer) {
          // @ts-ignore
          colData.accessLevel = answer;
          return cli.prompt(messages.enter_col_image_reg, { required: false });
        })
        .then(function (answer) {
          colData.imageRegistry = answer;
          return appService.editCollaborator(self, appId, cid, colData)
        })
        .then(result => {
          console.log(messages.col_edit_success);
        })
        .catch(function (err) {
          common.logError(err);
        })
    }

    function deleteCol() {
      let cid: string;
      cli.prompt(messages.enter_col_id, { required: true })
        .then(function (answer) {
          cid = answer;
          return appService.deleteCollaborator(self, appId, cid)
        })
        .then(result => {
          console.log(messages.col_del_success);
        })
        .catch(function (err) {
          common.logError(err);
        })
    }
  }
}
