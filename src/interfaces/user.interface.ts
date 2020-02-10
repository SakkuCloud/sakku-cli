export declare interface IUserStats {
  totalCores: number;
  totalRam: number;
  totalDisk: number;
  limitRam: number;
  limitCPU: number;
  limitDisk: number;
  limitAppCount: number;
  limitInstance: number;
}

export declare interface IUser {
  username?: string;
  mobile?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string;
  password?: string;
  nationalNumber?: string;
  userStats?: IUserStats;
}

export declare interface IOverview {
  token: string;
  user_balance: number;
  total_apps: number;
  user?: IUser;
}
