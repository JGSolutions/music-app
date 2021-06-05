/* eslint-disable max-len */
import { Response, Request } from "express";
import { adminFirebase } from "./fb";
import { flatten } from "lodash";
import { MixcloudSDK } from "../../sdk/mixcloud.sdk";
import { SpotifySDK } from "../../sdk/spotify.sdk";
import { spotifyKeys } from "../../sdk/api-keys";
import { getConnectServices } from "../utils/connect-services-firebase";
import { IArtistBodyRequest, IPlatformTypes } from "../../../models/artist.types";

export const artist = async (request: Request, response: Response) => {
  const authorized = request.headers["authorization"]!;
  let requestBody: IArtistBodyRequest[];

  try {
    requestBody = JSON.parse(request.body);
  } catch (err) {
    return response.status(403).send("Invalid Body Request");
  }

  if (!authorized) {
    return response.status(401).send("Invalid authenticated");
  }

  try {
    await adminFirebase.auth().getUser(authorized);
  } catch (err) {
    return response.status(401).send(err);
  }

  const connectedServices = await getConnectServices(authorized);
  const platformPromiseData: unknown[] = [];

  requestBody.forEach(async (key: IArtistBodyRequest) => {
    switch (key.type) {
      case IPlatformTypes.mixcloud:
        MixcloudSDK.initialize(connectedServices[key.type].token);
        platformPromiseData.push(MixcloudSDK.artistSongs(key.username));
        break;
      case IPlatformTypes.spotify:
        SpotifySDK.initialize(connectedServices[key.type].token, connectedServices[key.type].refresh_token, spotifyKeys.clientId, spotifyKeys.secretApi, authorized);
        platformPromiseData.push(SpotifySDK.artistSongs(key.id));
        break;
    }
  });

  Promise.all(platformPromiseData).then((promiseData) => {
    const allPlatformData = promiseData.map((data) => data);
    const flattenData = flatten(allPlatformData);
    return response.status(200).send(flattenData);
  });

  return;
};
