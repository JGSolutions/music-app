import { throwError } from "rxjs";
import axios from "axios";

export const auth = {
  url: "",
  clientId: "",
  clientSecret: "",
  soundcloudDomain: "https://api.soundcloud.com",
  redirectUri: "",

  config(clientId: string, clientSecret: string, redirectUri: string): void {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  },

  authorizeUrl(): string {
    if (!this.clientId) {
      throwError("Please provide a client id");
    }
    // eslint-disable-next-line max-len
    const q = `?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=code`;
    return `${this.soundcloudDomain}/connect${q}`;
  },

  async oauthToken(oAuthCode: string): Promise<string> {
    const postHeaders = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const apiUrl = `${this.soundcloudDomain}/oauth2/token`;
    // eslint-disable-next-line max-len
    const params = `grant_type=authorization_code&client_id=${this.clientId}&code=${oAuthCode}&client_secret=${this.clientSecret}&redirect_uri=${this.redirectUri}`;
    return await axios.post(apiUrl, params, postHeaders);
  },

};

