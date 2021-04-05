import {throwError} from "rxjs";

export const authorization = {
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
