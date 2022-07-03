// External Modules
import { Command } from "@oclif/command";

// Project Modules
import {
  api_sakku_base_url_khatam,
  api_sakku_base_url_sandbox,
  api_sakku_base_url_serverius,
  sakku_panel_auth_url_khatam,
  sakku_panel_auth_url_serverius,
  sakku_panel_auth_url_sandbox,
  webSocket_url_khatam,
  webSocket_url_sandbox,
  webSocket_url_serverius,
} from "../consts/urls";
import {
  sakkuRegRawKhatam,
  sakkuRegRawServerius,
  sakkuRegRawSandbox,
  sakkuRegUrlKhatam,
  sakkuRegUrlServerius,
  sakkuRegUrlSandbox,
} from "../consts/val";
import { readDatacenterZone } from "./read-datacenter-zone";

export function getBaseUrl(ctx: Command) {
  let zone = readDatacenterZone(ctx);
  return zone === "khatam" ? api_sakku_base_url_khatam
    : (zone === "sandbox" ? api_sakku_base_url_sandbox : api_sakku_base_url_serverius);
}

export function getWebSocketUrl(ctx: Command) {
  let zone = readDatacenterZone(ctx);
  return zone === "khatam" ? webSocket_url_khatam
    : (zone === "sandbox" ? webSocket_url_sandbox : webSocket_url_serverius);
}

export function getPanelAuthUrl(ctx: Command) {
  let zone = readDatacenterZone(ctx);
  return zone === "khatam" ? sakku_panel_auth_url_khatam
    : (zone === "sandbox" ? sakku_panel_auth_url_sandbox : sakku_panel_auth_url_serverius);
}

export function getSakkuRegUrl(ctx: Command) {
  let zone = readDatacenterZone(ctx);
  return zone === "khatam" ? sakkuRegUrlKhatam
    : (zone === "sandbox" ? sakkuRegUrlSandbox : sakkuRegUrlServerius);
}

export function getSakkuRegRaw(ctx: Command) {
  let zone = readDatacenterZone(ctx);
  return zone === "khatam" ? sakkuRegRawKhatam
    : (zone === "sandbox" ? sakkuRegRawSandbox : sakkuRegRawServerius);
}
