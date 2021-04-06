import {throwError} from "rxjs";
import axios from "axios";

export const MixcloudAuthorization = {
  url: "",
  clientId: "",
  secretApi: "",
  mixcloudDomain: "https://www.mixcloud.com",
  redirectUri: "",

  config(clientId: string, secretApi: string, redirectUri: string): void {
    this.clientId = clientId;
    this.secretApi = secretApi;
    this.redirectUri = redirectUri;
  },

  authorizeUrl(): string {
    if (!this.clientId) {
      throwError("Please provide a client id");
    }
    const q = `?client_id=${this.clientId}&redirect_uri=${this.redirectUri}`;
    return `${this.mixcloudDomain}/oauth/authorize${q}`;
  },

  createAccessToken(oAuthCode: string): string {
    if (!this.clientId || !this.secretApi) {
      throwError("Api keys are not provided!");
    }

    const redirectUrl = `${this.redirectUri}`;
    // eslint-disable-next-line max-len
    return `${this.mixcloudDomain}/oauth/access_token?client_id=${this.clientId}&redirect_uri=${redirectUrl}&client_secret=${this.secretApi}&code=${oAuthCode}`;
  },

};

export const MixcloudSDK = {
  username: {},
  accessToken: "",
  queryParamAccessToken: "",
  mixcloudApiDomain: "https://api.mixcloud.com",

  async initialize(accessToken: string): Promise<void> {
    this.queryParamAccessToken = `access_token=${accessToken}`;
    this.accessToken = accessToken;
    // this.username = await this.getUsername();
  },

  async getUsername(): Promise<string> {
    // eslint-disable-next-line max-len
    const url = `${this.mixcloudApiDomain}/me/?${this.queryParamAccessToken}`;
    const res: any = await axios(url);

    return await res.data.username;
  },

  async feed(): Promise<any> {
    // eslint-disable-next-line max-len
    const url = `${this.mixcloudApiDomain}/me/feed/?${this.queryParamAccessToken}&limit=1000`;
    const res: any = axios(url);
    const {data} = await res;
    return data.data;
  },
};
