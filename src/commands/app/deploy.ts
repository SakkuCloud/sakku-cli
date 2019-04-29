import {Command, flags} from '@oclif/command';
import {cli} from 'cli-ux';

import deployBinary from '../../deployment/deploy-binary';
import deployImage from '../../deployment/deploy-image';
import deploySrc from '../../deployment/deploy-source';
import inquirer = require('inquirer');

export default class Deploy extends Command {
  static description = 'deploy app';

  static question = {
    name: 'type',
    message: 'choose type of deploy',
    type: 'list',
    choices: [{name: 'docker image'}, {name: 'executable binary'}, {name: 'raw source'}],
  };

  static flags = {
    help: flags.help({char: 'h', hidden: true}),
    app: flags.string({char: 'a', description: 'app name'}),
    image: flags.string({char: 'i', exclusive: ['binary', 'source'], description: 'docker-image file'}),
    binary: flags.string({char: 'b', exclusive: ['image', 'source'], description: 'executable binary file'}),
    source: flags.boolean({char: 's', exclusive: ['binary', 'image']})
  };

  async run() {
    const {flags} = this.parse(Deploy);
    let appName = await (flags.app ? await flags.app : await cli.prompt('please enter app name', {required: true}));
    if (flags.source) {
      //deploy raw source with s flag
      cli.action.start('deployment started');
      await deploySrc(this, appName)
        .catch(reason => {
          cli.action.stop('Stoped!');
          this.log(reason);
        });
      if (cli.action.running) {
        cli.action.stop('done');
      }
    } else if (flags.binary) {
      //deploy executable binary with b flag
      cli.action.start('deployment started');
      await deployBinary(this, flags.binary, appName)
        .catch(reason => {
          cli.action.stop('Stoped!');
          this.log(reason);
        });
      if (cli.action.running) {
        cli.action.stop('done');
      }
    } else if (flags.image) {
      //deploy docker image with i flag
      cli.action.start('deployment started');
      await deployImage(this, flags.image, appName)
        .catch(reason => {
          cli.action.stop('Stoped!');
          this.log(reason);
        });
      if (cli.action.running) {
        cli.action.stop('done');
      }
    } else {
      //deploy with no flag set
      await inquirer.prompt(
        [Deploy.question],
      ).then(async answer => {
        // @ts-ignore
        switch (answer.type) {
        case 'executable binary':
          let bin = await cli.prompt('enter executable binary file path');
          cli.action.start('deploying');
          await deployBinary(this, bin, appName)
            .catch(reason => {
              cli.action.stop('Stoped!');
              this.log(reason);
            });
          if (cli.action.running) {
            cli.action.stop('done');
          }
          break;
        case 'docker image':
          let img = await cli.prompt('enter docker image file path');
          cli.action.start('deploying');
          await deployImage(this, img, appName)
            .catch(reason => {
              cli.action.stop('Stoped!');
              this.log(reason);
            });
          if (cli.action.running) {
            cli.action.stop('done');
          }
          break;
        case 'raw source':
          cli.action.start('deploying');
          await deploySrc(this, appName)
            .catch(reason => {
              cli.action.stop('Stoped!');
              this.log(reason);
            });
          if (cli.action.running) {
            cli.action.stop('done');
          }
        }
      });
    }
  }
}
