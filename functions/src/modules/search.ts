/* eslint-disable max-len */
import { Response, Request } from "express";
import { adminFirebase } from "./fb";
import { MixcloudSDK } from "../../sdk/mixcloud.sdk";
import { getConnectServices } from "../utils/connect-services-firebase";
import { IPlatformTypes } from "../../../models/artist.types";
import { SpotifySDK } from "../../sdk/spotify.sdk";
import { spotifyKeys } from "../../sdk/api-keys";
import { keys } from "lodash";

export const search = async (request: Request, response: Response) => {
  const authorized = request.headers["authorization"]!;
  const searchValue = request.query.search;

  try {
    await adminFirebase.auth().getUser(authorized);
  } catch (err) {
    return response.status(401).send(err);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const connectedServices = await getConnectServices(authorized);
  const platformKeys = keys(connectedServices);

  platformKeys.forEach(async (key) => {
    switch (key) {
      case IPlatformTypes.mixcloud:
        MixcloudSDK.initialize(connectedServices[key].token);
        // pData.push(MixcloudSDK.following());
        break;
      case IPlatformTypes.spotify:
        SpotifySDK.initialize(connectedServices[key].token, connectedServices[key].refresh_token, spotifyKeys.clientId, spotifyKeys.secretApi, authorized);
        SpotifySDK.search(searchValue as string);
        break;
    }
  });

  return response.status(200).send(searchValue);
};
