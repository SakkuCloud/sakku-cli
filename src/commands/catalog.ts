// External Modules
import { Command, flags } from '@oclif/command';
import * as inquirer from 'inquirer';
import cli from 'cli-ux';

// Project Modules
import { catalogService } from '../_service/catalog.service';
import {
  enter_your_core_msg,
  enter_your_ram_msg,
  enter_your_disk_msg,
  enter_your_app_name_msg
} from '../consts/msg';

export default class Whoami extends Command {
  static description = 'List all different Program Catalogs';

  static examples = [
    `$ sakku catalog`,
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };


  async run() {
    // @ts-ignore
    let categories;
    let id: any;
    let appDataObj = { cpu: null, mem: null, disk: null, name: null };
    let self = this;
    let appId: any;
    let apps: any;

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
        let question = createQuestionApp(apps);
        return inquirer.prompt([question])
      })
      .then(function (answer) {
        appId = findAppId(apps, answer);
        return cli.prompt(enter_your_core_msg, { required: true });
      })
      .then(function (result) {
        // @ts-ignore
        appDataObj.cpu = parseInt(result);
        return cli.prompt(enter_your_ram_msg, { required: true });
      })
      .then(function (result) {
        // @ts-ignore
        appDataObj.mem = parseInt(result);
        return cli.prompt(enter_your_disk_msg, { required: true });
      })
      .then(function (result) {
        // @ts-ignore
        appDataObj.disk = parseInt(result);
        return cli.prompt(enter_your_app_name_msg, { required: true });
      })
      .then(function (result) {
        appDataObj.name = result;
        return catalogService.catalogDeploy(self, appId, appDataObj);
      })
      .then(function (result) {
        console.log('Your app is successfully submitted.');
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

    function createQuestionCategoty(categories: any) {
      let question = {
        name: 'category',
        message: 'Choose your category: ',
        type: 'list',
        choices: []
      };

      for (let i = 0; i < categories.length; i++) {
        // @ts-ignore
        question.choices.push(categories[i].name);
      }

      return question;
    }


    function createQuestionApp(categories: any) {
      let question = {
        name: 'app',
        message: 'Choose your app: ',
        type: 'list',
        choices: []
      };

      for (let i = 0; i < categories.length; i++) {
        // @ts-ignore
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
  }
}
