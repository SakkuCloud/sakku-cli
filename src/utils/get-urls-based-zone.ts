// External Modules
import { Command } from "@oclif/command";

// Project Modules
import { readDatacenterInfo } from "./read-datacenter-info";

export function getBaseUrl(ctx: Command) {
  let zoneInfo = readDatacenterInfo(ctx);
  return zoneInfo.protocol.toLocaleLowerCase() + '://' + zoneInfo.baseApiAddress;
}

export function getWebSocketUrl(ctx: Command) {
  let zoneInfo = readDatacenterInfo(ctx);
  return 'wss://' + zoneInfo.registryAddress + '/ws';
}

export function getSakkuRegUrl(ctx: Command) {
  let zoneInfo = readDatacenterInfo(ctx);
  return zoneInfo.protocol.toLocaleLowerCase() + '://' + zoneInfo.registryAddress;
}

export function getSakkuRegRaw(ctx: Command) {
  let zoneInfo = readDatacenterInfo(ctx);
  return zoneInfo.registryAddress;
}
