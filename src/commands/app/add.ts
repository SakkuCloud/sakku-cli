import {Command, flags} from '@oclif/command'
import cli from 'cli-ux'
import * as fs from 'fs-extra'

import {appService} from '../../_service/app.service'
import {
  abort_msg,
  done_msg,
  enter_your_app_name_msg,
  enter_your_app_port_msg,
  enter_your_args_msg,
  enter_your_cmd_msg,
  enter_your_disk_msg,
  enter_your_environment_key_msg,
  enter_your_environment_value_msg,
  enter_your_host_port_msg,
  enter_your_label_key_msg,
  enter_your_label_value_msg,
  enter_your_link_alias_msg,
  enter_your_link_name_msg,
  enter_your_max_core_msg,
  enter_your_max_core_per_instance_msg,
  enter_your_max_instance_msg,
  enter_your_max_ram_msg,
  enter_your_max_ram_per_instance_msg,
  enter_your_min_core_msg,
  enter_your_min_core_per_instance_msg,
  enter_your_min_instance_msg,
  enter_your_min_ram_msg,
  enter_your_min_ram_per_instance_msg,
  w8_msg
} from '../../consts/msg'
import {writeLocalApps} from '../../utils/writer'

export default class Add extends Command {
  static description = 'add new app'

  static examples = [
    '$ sakku app:add',
  ]
  static port = {host: '', app: ''}
  static link = {name: '', alias: ''}
  static flags = {
    help: flags.help({char: 'h'})
  }

  async run() {
    let maxInstance: any
    let minInstance: any
    let maxCorePerInstance: any
    let minCorePerInstance: any
    let maxRamPerInstance: any
    let minRamPerInstance: any
    let disk: any
    let minRam: any
    let maxRam: any
    let minCore: any
    let maxCore: any
    let args = []
    let ports = []
    let links = []
    let environments: {
      [key: string]: string;
    } = {}
    let labels: {
      [key: string]: string;
    } = {}
    let name: any = await cli.prompt(enter_your_app_name_msg, {required: true})
    do {
      minRam = await cli.prompt(enter_your_min_ram_msg, {required: true})
    } while (isNaN(Number(minRam)))
    do {
      maxRam = await cli.prompt(enter_your_max_ram_msg, {required: true})
    } while (isNaN(Number(maxRam)))
    do {
      minCore = await cli.prompt(enter_your_min_core_msg, {required: true})
    } while (isNaN(Number(minCore)))
    do {
      maxCore = await cli.prompt(enter_your_max_core_msg, {required: true})
    } while (isNaN(Number(maxCore)))
    do {
      disk = await cli.prompt(enter_your_disk_msg, {required: true})
    } while (isNaN(Number(disk)))
    do {
      minRamPerInstance = await cli.prompt(enter_your_min_ram_per_instance_msg, {required: true})
    } while (isNaN(Number(minRamPerInstance)))
    do {
      maxRamPerInstance = await cli.prompt(enter_your_max_ram_per_instance_msg, {required: true})
    } while (isNaN(Number(maxRamPerInstance)))
    do {
      minCorePerInstance = await cli.prompt(enter_your_min_core_per_instance_msg, {required: true})
    } while (isNaN(Number(minCorePerInstance)))
    do {
      maxCorePerInstance = await cli.prompt(enter_your_max_core_per_instance_msg, {required: true})
    } while (isNaN(Number(maxCorePerInstance)))
    do {
      minInstance = await cli.prompt(enter_your_min_instance_msg, {required: true})
    } while (isNaN(Number(minInstance)))
    do {
      maxInstance = await cli.prompt(enter_your_max_instance_msg, {required: true})
    } while (isNaN(Number(maxInstance)))
    let cmd = await cli.prompt(enter_your_cmd_msg, {required: true})
    do {
      args.push(await cli.prompt(enter_your_args_msg))
    } while (await cli.confirm('is there other args any more?'))
    do {
      do {
        Add.port.host = await cli.prompt(enter_your_host_port_msg, {required: false})
      } while (isNaN(Number(Add.port.host)))
      do {
        Add.port.app = await cli.prompt(enter_your_app_port_msg, {required: false})
      } while (isNaN(Number(Add.port.app)))
      ports.push(Add.port)
    } while (await cli.confirm('is there other ports any more?'))
    do {
      Add.link.name = await cli.prompt(enter_your_link_name_msg)
      Add.link.alias = await cli.prompt(enter_your_link_alias_msg)
      links.push(Add.link)
    } while (await cli.confirm('is there other links any more?'))
    do {
      let param: string = await cli.prompt(enter_your_environment_key_msg)
      environments[param] = await cli.prompt(enter_your_environment_value_msg)
    } while (await cli.confirm('is there other environments any more?'))
    do {
      let param: string = await cli.prompt(enter_your_label_key_msg)
      labels[param] = await cli.prompt(enter_your_label_value_msg)
    } while (await cli.confirm('is there other labels any more?'))
    try {
      let response = await appService.create(this, {
        name,
        minRam,
        maxRam,
        minCore,
        maxCore,
        disk,
        minRamPerInstance,
        maxRamPerInstance,
        minCorePerInstance,
        maxCorePerInstance,
        minInstance,
        maxInstance,
        cmd,
        args,
        ports,
        labels,
        links,
        environments,
        image: {name: 'nginx', registry: 'dockerhub'}
      })
      this.log(JSON.stringify(response))
    } catch (e) {
      this.log(JSON.stringify(e))
    }
    await cli.action.start(w8_msg)
    try {
      await fs.mkdirSync(name)
      await fs.realpath(name, (_, resolvedPath) => {
        writeLocalApps(this, `${name}:'${resolvedPath}'`)
      })
      cli.action.stop(done_msg)
      this.log(`${name} is ready to deploy :)`)
    } catch (_) {
      cli.action.stop(abort_msg)
      this.log('folder name already exist!!')
    }
  }
}
