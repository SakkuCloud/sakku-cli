// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';

// Project Modules
import { appService } from '../../_service/app.service';
import { common } from '../../utils/common';
import { messages } from '../../consts/msg';

export default class Collab extends Command {
  static description = 'Adds new collaborators, as well as showing the list of collaborators';

  static examples = [
    `$ sakku app:Collab`,
    `$ sakku app:Collab -a`,
    `$ sakku app:Collab -e`,
    `$ sakku app:Collab -r`
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    add: flags.boolean({ char: 'a', description: 'Add collaborators', exclusive: ['edit', 'delete'] }),
    edit: flags.boolean({ char: 'e', description: 'Edit collaborators', exclusive: ['add', 'delete'] }),
    delete: flags.boolean({ char: 'r', description: 'Remove collaborators', exclusive: ['add', 'edit'] }),
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
    const { args, flags } = this.parse(Collab);
    let self = this;
    let collaborators;
    let appId: string;

    let accessLevelQuestion = {
      name: 'accessLevel',
      message: messages.choose_collab_access_level,
      type: 'list',
      choices: ['VIEW', 'MODERATE', 'MODIFY']
    };

    let notifSensLevelQuestion = {
      name: 'level',
      message: messages.choose_notif_sens_level,
      type: 'list',
      choices: [
        {name:'0: no email for apps!', value:0 },
        {name:'1: delete, transfer, create', value: 1 },
        {name:'2: stop, run', value:2 }, 
        {name:'3: git, docker (pull and push)', value:3 },
        {name:'4: cert, domain, cmd, issue', value:4 },
        {name:'5: collaborator', value:5 },
        {name:'6: docker failed, health check', value:6 },
        {name:'7: status changed', value:7 }
      ]
    };

    if (args.hasOwnProperty('app') && args.app) {
      appId = args.app;
    }
    else {
      appId = await cli.prompt(messages.enter_app_id, { required: true });
    }

    if (flags.add) {
      addCollaborator();
    }
    else if (flags.edit) {
      editCollaborator();
    }
    else if (flags.delete) {
      deleteCollaborator();
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

    function addCollaborator() {
      let collabData: { accessLevel: string, email: string, imageRegistry: string } = {
        accessLevel: 'VIEW',
        email: '',
        imageRegistry: ''
      };
      let queryParam = {
        level: '7'
      };
      return cli.prompt(messages.enter_collab_email, { required: true })
        .then(answer => {
          collabData.email = answer;
          return inquirer.prompt([accessLevelQuestion])
        })
        .then(function (answer: any) {
          // @ts-ignore
          collabData.accessLevel = answer.accessLevel;
          return inquirer.prompt([notifSensLevelQuestion])
        }).
        then((answer: any) => {
          queryParam.level = answer.level;
          return cli.prompt(messages.enter_collab_image_reg, { required: false });
        })
        .then(function (answer:any) {
          collabData.imageRegistry = answer;
          return appService.addCollaborator(self, appId, queryParam ,collabData)
        })
        .then(result => {
          console.log(messages.col_add_success);
          console.log(JSON.stringify(result.data ,null, 2));
        })
        .catch(function (err) {
          common.logError(err);
        })
    }

    function editCollaborator() {
      let cid: string;
      let collabData = {
        accessLevel: 'VIEW',
        email: '',
        imageRegistry: ''
      };
      let queryParam = {
        level: '7'
      };
      
      cli.prompt(messages.enter_collab_id, { required: true })
        .then(function (answer) {
          cid = answer;
          return cli.prompt(messages.enter_collab_email, { required: true })
        })
        .then(answer => {
          collabData.email = answer;
          return inquirer.prompt([accessLevelQuestion])
        })
        .then(function (answer: any) {
          // @ts-ignore
          collabData.accessLevel = answer.accessLevel;
          return inquirer.prompt([notifSensLevelQuestion])
        }).
        then((answer: any) => {
          queryParam.level = answer.level;
          return cli.prompt(messages.enter_collab_image_reg, { required: false });
        })
        .then(function (answer) {
          collabData.imageRegistry = answer;
          return appService.editCollaborator(self, appId, cid, queryParam, collabData)
        })
        .then(result => {
          console.log(messages.col_edit_success);
          console.log(JSON.stringify(result.data ,null, 2));
        })
        .catch(function (err) {
          common.logError(err);
        })
    }

    function deleteCollaborator() {
      let cid: string;
      cli.prompt(messages.enter_collab_id, { required: true })
        .then(function (answer) {
          cid = answer;
          return appService.deleteCollaborator(self, appId, cid)
        })
        .then(result => {
          console.log(messages.collab_del_success);
        })
        .catch(function (err) {
          common.logError(err);
        })
    }
  }
}
