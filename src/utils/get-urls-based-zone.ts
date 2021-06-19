// External Modules
import { Command } from "@oclif/command";

// Project Modules
import { readDatacenterInfo } from "./read-datacenter-info";

export function getBaseUrl(ctx: Command) {
  let zoneInfo = readDatacenterInfo(ctx);
  let baseRawUrl = zoneInfo.baseApiAddress.slice(-1) === '/' ? zoneInfo.baseApiAddress : zoneInfo.baseApiAddress + '/';
  return zoneInfo.protocol.toLocaleLowerCase() + '://' + baseRawUrl;
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

export function getPanelUrl(ctx: Command) {
  let zoneInfo = readDatacenterInfo(ctx);
  return zoneInfo.protocol.toLocaleLowerCase() + '://' + zoneInfo.panelAddress;
}
