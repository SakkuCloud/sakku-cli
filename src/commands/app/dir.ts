// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import inquirer = require('inquirer');

// Project Modules
import { appService } from '../../_service/app.service';
import { common } from '../../utils/common';
import { messages } from '../../consts/msg';
import table from 'cli-ux/lib/styled/table';

export default class Dir extends Command {
    static description = 'Shows files & folders of an app';

    static examples = [
        `$ sakku app:dir`,
    ];

    static flags = {
        help: flags.help({ char: 'h' }),
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
        const { args, flags } = this.parse(Dir);
        let self = this;
        let appId: any;
        let containerId: string;
        let page: number = 0;
        let size: number = 30;
        let path: string = '/';
        let data;
        let defaultSize: number = 10;
        let answer: { instance: string };

        appId = args.app;

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
                let counter = 0;
                let tableData = [];
                let continueLoop = true;
                let askQuestion = true;

                do {
                    if (askQuestion) {
                        path = (await cli.prompt(messages.enter_path, { required: false })) || '/';
                        page = parseInt(await cli.prompt(messages.enter_page_number, { required: true }));
                        size = parseInt(await cli.prompt(messages.enter_page_size, { required: false })) || defaultSize;
                    }

                    let params = { page: page, path: path, containerId: containerId, size: size };
                    data = (await appService.dir(this, appId, params)).data.result;
                    tableData = [];

                    for (let i = 0; i < data.fileVOs.length; i++) {
                        tableData.push({
                            counter: ++counter,
                            name: data.fileVOs[i].name,
                            size: data.fileVOs[i].size,
                            created: data.fileVOs[i].created
                        });
                    }

                    for (let i = 0; i < data.folderVOS.length; i++) {
                        tableData.push({
                            counter: ++counter,
                            name: data.folderVOS[i].name
                        });
                    }

                    let dataLength = tableData.length;

                    cli.table(tableData,
                        {
                            columns:
                                [{
                                    key: 'counter',
                                    label: 'Row'
                                },
                                {
                                    key: 'name',
                                    label: 'Name'
                                },
                                {
                                    key: 'size',
                                    label: 'Size'
                                },
                                {
                                    key: 'timestamp',
                                    label: 'Created'
                                }],
                            colSep: ' | '
                        });

                    if (dataLength >= size) {
                        let answer = await cli.confirm(messages.nextPage);
                        if (answer === true) {
                            askQuestion = false;
                            page = page + 1;
                            continueLoop = true;
                        }
                        else {
                            let answer = await cli.confirm(messages.continue);
                            if (answer === true) {
                                counter = 0;
                                askQuestion = true;
                                continueLoop = true;
                            }
                            else {
                                continueLoop = false;
                            }
                        }
                    }
                    else {
                        let answer = await cli.confirm(messages.continue);
                        if (answer === true) {
                            counter = 0;
                            askQuestion = true;
                            continueLoop = true;
                        }
                        else {
                            continueLoop = false;
                        }
                    }
                } while (continueLoop)
            }
        }
        catch (err) {
            common.logError(err);
        }
    }
}
