// External Modules
import { Command, flags } from "@oclif/command";
import cli from "cli-ux";

// Project Modules
import { readDatacenterInfo } from "../../utils/read-datacenter-info";
import color from "@oclif/color";

export default class Get extends Command {
  static description = "zone:get";

  static examples = [`$ sakku zone:get`];

  static flags = {
    help: flags.help({ char: "h" }),
  };

  async run() {
    try {
      let zoneMessage = readDatacenterInfo(this).description;
      console.log(color.green(zoneMessage));
    } catch (e) {
      console.log(e);
    }
  }
}
