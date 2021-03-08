// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';
const util = require('util');
const exec = util.promisify(require('child_process').exec);


// Project Modules
import { messages } from '../../consts/msg';
export default class Build extends Command {
  static description = 'app build';

  static examples = [
    `$ sakku app:build
Enter your docker file dir
Enter your app ports`,
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };

  static args = [
    {
      name: 'dockerFileDir',
      required: false,
      description: 'dockerFileDir',
      hidden: false
    },
    {
      name: 'imageName',
      required: false,
      description: 'imageName',
      hidden: false
    },
  ];

  async run() {
    const { args, flags } = this.parse(Build);
    let dockerFileDir: string;
    let imageName: string;
    let imageTag: string;

    if (args.hasOwnProperty('dockerFileDir') && args.dockerFileDir) {
      dockerFileDir = args.dockerFileDir;
    }
    else {
      dockerFileDir = await cli.prompt(messages.enter_docker_file_address, { required: true });
    }

    if (args.hasOwnProperty('imageName') && args.imageName) {
      imageName = args.imageName;
    }
    else {
      imageName = await cli.prompt(messages.enter_image_name, { required: true });
    }

    if (args.hasOwnProperty('imageName') && args.imageTag) {
      imageTag = args.imageTag;
    }
    else {
      imageTag = await cli.prompt(messages.enter_local_image_tag, { required: false });
    }
    
    let buildCommand = imageTag ? ('docker build -t ' + imageName + ':' + imageTag + ' ' + dockerFileDir ) : ('docker build -t ' + imageName + ' ' + dockerFileDir);
    const { stdout, stderr } = await exec(buildCommand);
    console.log('test' + stdout);
    if (stderr) {
      console.error(`error: ${stderr}`);
    }
  }
}
