// External Modules
import { Command, flags } from '@oclif/command';

// Project Modules
import { dockerRepositoryService } from '../../_service/docker.repository.service';
import cli from 'cli-ux';
import { messages } from '../../consts/msg';
import { resolve } from 'dns';

export default class Ps extends Command {
  static description = 'Get all user repositories hosted by Sakku registry';

  static examples = [
    `$ sakku image:ps`,
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };

  async run() {
    let self = this;
    let repoList: any;
    let repoInfo: any;
    let repoFinalList: {
      "name": string,
      "tag": string,
      "size": number,
      "createDate": string
    }[] = [];
    let repoTemp: {
      "name": string,
      "tag": string,
      "size": number,
      "createDate": string
    } = {
      "name": '',
      "tag": '',
      "size": 0,
      "createDate": ''
    };
    let columns = {
      name: {
        minWidth: 7,
      },
      tag: {
        minWidth: 10,
      },
      size: {
        minWidth: 10,
      },
      createDate: {
        header: 'create date',
        minWidth: 20,
      }
    };
    try{
      await cli.action.start(messages.w8_msg);
      repoList = await dockerRepositoryService.ps(self);
      let repoParam = {
          "includeCreated": true, 
          "includeSize": true,
          "timeType": "ISO_8601"
      };

      for (const repoName of repoList.data.result.repositories) {
          let repoResult = await dockerRepositoryService.getRepoInfo(self, repoName, repoParam);
          repoInfo = repoResult.data.result;
          for (const tag of repoInfo.tags) {
            let repoTemp: {
              "name": string,
              "tag": string,
              "size": number,
              "createDate": string
            } = {
              "name": '',
              "tag": '',
              "size": 0,
              "createDate": ''
            };
            repoTemp.name = repoInfo.name;
            repoTemp.tag = tag.name;
            repoTemp.size = tag.size;
            repoTemp.createDate = tag.createDate;
            repoFinalList.push(repoTemp);
          }
      }
      cli.action.stop(messages.done_msg);
      cli.table(repoFinalList,
        {
          columns: [
          {
            key: 'name',
            label: 'Name'
          },
          {
            key: 'tag',
            label: 'Tag'
          },
          {
            key: 'size',
            label: 'Size'
          },
          {
            key: 'createDate',
            label: 'Create Date'
          },
        ],
          colSep: ' | '
        }
      );

    }catch(e) {
      console.log(e);
    }
  }
}