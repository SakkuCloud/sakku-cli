export enum IAppsStatus {
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
  STAGED = 'STAGED',
  REMOVED = 'REMOVED',
  DEPLOYING = 'DEPLOYING'
}

export enum IAppsDeployType {
  APP = 'APP',
  CODE = 'CODE',
  DOCKER_IMAGE = 'DOCKER_IMAGE',
  DOCKER_FILE = 'DOCKER_FILE'
}

export enum IAppsAccessLevel {
  VIEW = 'VIEW',
  MODIFY = 'MODIFY',
  MODERATE = 'MODERATE'
}
