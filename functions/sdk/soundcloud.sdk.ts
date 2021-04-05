import {throwError} from "rxjs";

export const auth = {
  url: "",
  clientId: "",
  soundcloudDomain: "https://api.soundcloud.com",
  redirectUri: "",

  config(clientId: string, redirectUri: string): void {
    this.clientId = clientId;
    this.redirectUri = redirectUri;
  },

  authorizeUrl(): string {
    if (!this.clientId) {
      throwError("Please provide a client id");
    }
    // eslint-disable-next-line max-len
    const q = `?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=code&scope=non-expiring`;
    return `${this.soundcloudDomain}/connect${q}`;
  },

  // createAccessToken(oAuthCode: string): string {
  //   if (!this.clientId) {
  //     throwError("Api keys are not provided!");
  //   }

  //   const redirectUrl = `${this.redirectUri}`;
  //   eslint-disable-next-line max-len
  //   return `${this.soundcloudDomain}/oauth/access_token?client_id=${this.clientId}&redirect_uri=${redirectUrl}&code=${oAuthCode}`;
  // },

};

