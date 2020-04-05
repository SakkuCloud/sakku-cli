// External Modules
import { Command, flags } from '@oclif/command';
import { cli } from 'cli-ux';

// Project Modules
import { appService } from '../../_service/app.service';
import { IAppsAccess, IAppsPort } from '../../interfaces/app.interface';
import { writeApps } from '../../utils/writer';
import { common } from '../../utils/common';

export default class PS extends Command {
  static description = 'showing all [running/all] app';

  static flags = {
    help: flags.help({ char: 'h' }),
    all: flags.boolean({ char: 'a', description: 'show all apps' }),
  };

  async run() {
    const { flags } = this.parse(PS);
    let promiseArray = [];

    try {
      let data = await appService.list(this);
      writeApps(this, data);

      for (let i = 0; i < data.length; i++) {
        promiseArray.push(appService.getCollaborators(this, data[i].id));
      }

      let collsData = await Promise.all(promiseArray);
      for (let i = 0; i < collsData.length; i++) {
        data[i].colls = collsData[i].data.result;
      }

      cli.table(data,
        {
          columns: [{
            key: 'id',
            label: 'ID'
          },
          {
            key: 'name',
            label: 'Name'
          },
          {
            key: 'created',
            label: 'Create Time'
          },
          {
            key: 'status',
            label: 'Status'
          },
          {
            key: 'ports',
            label: 'PORT',
            get: (row: any) => row.ports && row.ports.host && row.ports.map((port: IAppsPort) => port.host + '-' + port.container)
              .filter((ports: IAppsPort) => ports).join('-') || '-'
          },
          {
            key: 'deployType',
            label: 'TYPE',
            get: (row: any) => row.deployType ? row.deployType : '-'
          },
          {
            key: 'access',
            label: 'Access',
            get: (row: any) => row.colls && typeof row.colls === 'object' && row.colls.map((access: IAppsAccess) => {
              let returnValue = null;
              if (access.hasOwnProperty('person')) {
                if (access.person) {
                  returnValue = (access.person.firstName || 'UNKNOWN') + ' ' + (access.person.lastName || 'UNKNOWN');
                }
              }
              return returnValue;
            }).filter((access: IAppsAccess) => access).join(', ') || 'No Collaboration'
          }],
          colSep: ' | '
        });
    }
    catch (err) {
      common.logError(err);
    }
  }
}
