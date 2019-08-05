import { Command, flags } from '@oclif/command';
import { cli } from 'cli-ux';
const { exec } = require('child_process');


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
    choices: [{ name: 'docker image' }, { name: 'executable binary' }, { name: 'raw source' }],
  };

  static flags = {
    help: flags.help({ char: 'h', hidden: true }),
    app: flags.string({ char: 'a', description: 'app name' }),
    // image: flags.string({char: 'i', exclusive: ['binary', 'source'], description: 'docker-image file'}),
    // binary: flags.string({char: 'b', exclusive: ['image', 'source'], description: 'executable binary file'}),
    // source: flags.boolean({char: 's', exclusive: ['binary', 'image']})
  };

  async run() {
    const { flags } = this.parse(Deploy);
    // let appName = await (flags.app ? await flags.app : await cli.prompt('please enter app name', {required: true}));
    exec('docker', (err, stdout, stderr) => {
      if (err) {
        console.error('====!!!!=====>', err);
        return;
      }
      console.log('=====@@@@====>', typeof stdout);
    });
  }
}
