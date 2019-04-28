import {IAppsAccessLevel, IAppsStatus, IAppsDeployType} from './../enums/apps.enum';
import {IUser} from './user.interface';

export declare interface IApp {
  id: number;
  name: string;
  desc?: string;
  created: Date | string;
  access?: IAppsAccess[];
  configuration?: IAppsConfiguration;
  status?: IAppsStatus;
  deployType?: IAppsDeployType;
  ports?: IAppsPort[];
}

export declare interface IAppVO {
  id: number;
  ownerId: number;
  name: string;
  uid: number;
  instances: IAppInstance[];
  desc: string;
  created?: string | Date;
  access: IAppsAccess[];
  configuration: IAppsConfiguration;
  status: IAppsStatus;
  deployType: IAppsDeployType;
  ports: IAppsPort[];
}

export declare interface IAppInstance {
  containerId: number;
  workerHost?: string;
  metadata?: string;
}

export declare interface IAppsPort {
  container: number;
  host: number;
  type?: string;
  endpoint?: string;
}

export declare interface IAppsConfiguration {
  cmd?: string;
  args?: string[];
  instances?: number;
  disk?: number;
  gpus?: number;
  maxCPU?: number;
  minCPU?: number;
  minCPUPerInstance?: number;
  maxRam?: number;
  minRam?: number;
  minRamPerInstance?: number;
}

export declare interface IAppsAccess {
  id: number;
  created?: string | Date;
  expiration?: string | Date;
  accessLevel?: IAppsAccessLevel;
  person?: IUser;
}
