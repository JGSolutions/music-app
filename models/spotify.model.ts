export interface IAuthorizationToken {
  access_token: string;
  token_type: string;
  scope: string;
  expres_in: number;
  refresh_token: string;
}

export interface IRefreshAuthorizationToken {
  access_token: string;
  token_type: string;
  scope: string;
  expres_in: number;
}
