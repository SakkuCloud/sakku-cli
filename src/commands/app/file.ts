// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import inquirer = require('inquirer');

// Project Modules
import { appService } from '../../_service/app.service';
import { common } from '../../utils/common';
import { messages } from '../../consts/msg';

export default class File extends Command {
    static description = 'Shows files & folders of an app';

    static examples = [
        `$ sakku app:file -d`,
        `$ sakku app:file -u`
    ];

    static flags = {
        help: flags.help({ char: 'h' }),
        download: flags.boolean({ char: 'd', description: 'Download a file', exclusive: ['upload'] }),
        upload: flags.boolean({ char: 'u', description: 'Upload a file', exclusive: ['download'] }),
    };

    static args = [
        {
            name: 'app',
            required: true,
            description: 'app id',
            hidden: false
        },
    ];

    async run() {
        const { args, flags } = this.parse(File);
        let self = this;
        let appId: any;
        let containerId: string;
        let path: string = '/';
        let data;
        let answer: { instance: string };
        let dlPath;
        let remotePath;

        appId = args.app;

        if (flags.download) {
            try {
                data = (await appService.get(this, appId)).data
                let result = data.result!;
                if (result.instances.length === 0) {
                    this.log(messages.noInstance);
                }
                else {
                    let instances = result.instances;
                    let choices: { name: string }[] = [];
                    instances.forEach(ins => {
                        choices.push({ name: ins.containerId.toString() });
                    });

                    answer = await inquirer.prompt({
                        name: 'instance',
                        message: 'which instance :',
                        type: 'list',
                        choices
                    });
                    containerId = answer.instance;

                    path = (await cli.prompt(messages.enter_man_path, { required: true }));
                    dlPath = (await cli.prompt(messages.enter_dl_path, { required: true }));
                    let params = { path: path, containerId: containerId };
                    data = (await appService.getDownloadLink(this, appId, params)).data.result;
                    data = (await appService.download(this, data, dlPath, data.split('-')[2]));
                    console.log('Download Completed!');
                }
            }
            catch (err) {
                common.logError(err);
            }
        }
        else if (flags.upload) {
            try {
                data = (await appService.get(this, appId)).data
                let result = data.result!;
                if (result.instances.length === 0) {
                    this.log(messages.noInstance);
                }
                else {
                    let instances = result.instances;
                    let choices: { name: string }[] = [];
                    instances.forEach(ins => {
                        choices.push({ name: ins.containerId.toString() });
                    });

                    answer = await inquirer.prompt({
                        name: 'instance',
                        message: 'which instance :',
                        type: 'list',
                        choices
                    });
                    containerId = answer.instance;

                    path = (await cli.prompt(messages.upload_path, { required: true }));
                    remotePath = (await cli.prompt(messages.remote_path, { required: true }));
                    let params = { path: remotePath, containerId: containerId };
                    await appService.upload(this, appId, path, params);
                    console.log('Upload Completed!');
                }
            }
            catch (err) {
                common.logError(err);
            }
        }
    }
}
