// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import inquirer = require('inquirer');

// Project Modules
import { appService } from '../../_service/app.service';
import { common } from '../../utils/common';
import { messages } from '../../consts/msg';
import { IAppsPort } from '../../interfaces/app.interface';

export default class File extends Command {
    static description = 'Shows files & folders of an app';

    static examples = [
        `$ sakku app:pipeline`
    ];

    static flags = {
        help: flags.help({ char: 'h' }),
        file: flags.string({ char: 'f', description: 'Docker Compose file' }),
    };

    async run() {
        const { args, flags } = this.parse(File);
        let self = this;
        // let self = this;
        let composeFile: string = '/';

        if (flags.file) {
            composeFile = flags.file;
        } 
        else {
            composeFile = await cli.prompt(messages.enter_docker_compose_file, { required: true });
        }

        try {
            let result = await appService.getAppGroupConfig(this, composeFile);
            result = JSON.parse(result);
            
            if(result.error) {
                common.logError(result);
            } 
            else {
                let appConfigs = result.result ? result.result : [];
                this.log(messages.app_config_review);
                cli.table(appConfigs,
                    {
                      columns: [
                      {
                        key: 'name',
                        label: 'Name'
                      },
                      {
                        key: 'cpu',
                        label: 'Cpu'
                      },
                      {
                        key: 'mem',
                        label: 'Ram'
                      },
                      {
                        key: 'disk',
                        label: 'Disk'
                      },
                      {
                        key: 'scalingMode',
                        label: 'Scaling Mode'
                      },
                      {
                        key: 'ports',
                        label: 'Ports',
                        get: (row: any) => row.ports && row.ports.host && row.ports.map((port: IAppsPort) => port.host + '-' + port.container)
                  .filter((ports: IAppsPort) => ports).join('-') || '-'
                      },
                      {
                        key: 'image',
                        label: 'Application Image',
                        get: (row: any) => row.name && row.registry ? 'name: ' + row.name + '; registry: ' + row.registry + '; ' : '-'
                      },
                      {
                        key: 'network',
                        label: 'Network'
                      },
                    ],
                      colSep: ' | '
                    }
                );
                this.log('\n');
                let continueProcess = await cli.confirm(messages.create_pipeline_permission);
                if (continueProcess){
                    let pipelineResult = await appService.createPipeline(this, appConfigs);
                    this.log(pipelineResult.data);
                    this.log(messages.pipeline_app_under_construction);
                }
                else {
                    this.log(messages.operation_cancel);
                }
            }
        }
        catch (err) {
            common.logError(err);
        }
    }
}
