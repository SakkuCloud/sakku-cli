// External Modules
import { Command, flags } from '@oclif/command';
import * as inquirer from 'inquirer';
import cli from 'cli-ux';

// Project Modules
import { catalogService } from '../_service/catalog.service';
import { messages } from '../consts/msg';
import { common } from '../utils/common';

export default class Catalog extends Command {
  static description = 'List all different Program Catalogs';

  static examples = [
    `$ sakku catalog`,
    `$ sakku catalog -a`
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    add: flags.boolean({ char: 'a' })
  };

  async run() {
    const { args, flags } = this.parse(Catalog);
    let categories: any;
    let id: any;
    let appDataObj:
      { cpu: null | number, mem: null | number, disk: null | number, name: null | number }
      = { cpu: null, mem: null, disk: null, name: null };
    let self = this;
    let appId: string;
    let apps: any;

    if (flags.hasOwnProperty('add') && flags.add === true) {
      catalogService.getAllCatalogs(this)
        .then(function (result) {
          return result.data.result;
        })
        .then(function (result) {
          categories = result;
          let question = createQuestionCategoty(categories);
          return inquirer.prompt([question])
        })
        .then(function (answer) {
          id = findCategoryId(categories, answer);
          return catalogService.getAllCatalogApps(self, id)
        })
        .then(function (result) {
          apps = result.data.result;
          let question = createQuestionApp(apps);
          return inquirer.prompt([question])
        })
        .then(function (answer) {
          appId = findAppId(apps, answer);
          return cli.prompt(messages.enter_your_core_msg, { required: true });
        })
        .then(function (result) {
          appDataObj.cpu = parseFloat(result);
          return cli.prompt(messages.enter_your_ram_msg, { required: true });
        })
        .then(function (result) {
          appDataObj.mem = parseFloat(result);
          return cli.prompt(messages.enter_your_disk_msg, { required: true });
        })
        .then(function (result) {
          appDataObj.disk = parseFloat(result);
          return cli.prompt(messages.enter_your_app_name_msg, { required: true });
        })
        .then(function (result) {
          return catalogService.catalogDeploy(self, appId, appDataObj);
        })
        .then(function () {
          console.log('Your app is successfully submitted.');
        })
        .catch(function (err) {
          common.logError(err);
        });
    }
    else {
      catalogService.getAllCatalogs(this)
        .then(function (result) {
          return result.data.result;
        })
        .then(function (result) {
          categories = result;
          let question = createQuestionCategoty(categories);
          return inquirer.prompt([question])
        })
        .then(function (answer) {
          // @ts-ignore
          id = findCategoryId(categories, answer);
          return catalogService.getAllCatalogApps(self, id)
        })
        .then(function (result) {
          apps = result.data.result;
          printApps();
        })
        .catch(function (err) {
          common.logError(err);
        });
    }

    function createQuestionCategoty(categories: any) {
      let question:
        {
          name: string,
          message: string,
          type: string,
          choices: { name: string }[]
        } = {
        name: 'category',
        message: 'Choose your category: ',
        type: 'list',
        choices: []
      };

      for (let i = 0; i < categories.length; i++) {
        question.choices.push(categories[i].name);
      }

      return question;
    }


    function createQuestionApp(categories: any) {
      let question:
        {
          name: string,
          message: string,
          type: string,
          choices: { name: string }[]
        } = {
        name: 'app',
        message: 'Choose your app: ',
        type: 'list',
        choices: []
      };

      for (let i = 0; i < categories.length; i++) {
        question.choices.push(categories[i].name);
      }

      return question;
    }

    function findCategoryId(categories: any, name: any) {
      let id = null;
      for (let i = 0; i < categories.length; i++) {
        if (name.category === categories[i].name) {
          id = categories[i].id
        }
      }
      return id;
    }

    function findAppId(apps: any, name: any) {
      let id = null;
      for (let i = 0; i < apps.length; i++) {
        if (name.app === apps[i].name) {
          id = apps[i].id
        }
      }
      return id;
    }

    function printApps() {
      if (apps.length === 0) {
        console.log('Collaborator List is Empty');
      }
      else {
        for (let i = 0; i < apps.length; i++) {
          console.log((i + 1) + '-', apps[i].name);
        }
      }
    }
  }
}
