export interface IAuthUser {
  id: number;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthResponse {
  access_token: string;
  user: IAuthUser;
}