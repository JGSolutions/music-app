/* eslint-disable max-len */
import { Response, Request } from "express";
import { adminFirebase } from "./fb";
import { flatten } from "lodash";
import { MixcloudSDK } from "../../sdk/mixcloud.sdk";
import { IPlatformTypes } from "../../sdk/IPlatforms.types";
import { SpotifySDK } from "../../sdk/spotify.sdk";
import { ArtistBodyRequest } from "../models/IArtists.types";
import { spotifyKeys } from "../../sdk/api-keys";

export const artist = async (request: Request, response: Response) => {
  const authorized = request.headers["authorization"]!;
  let requestBody: ArtistBodyRequest[];

  try {
    requestBody = JSON.parse(request.body);
  } catch (err) {
    response.status(403).send("Invalid Body Request");
    return;
  }

  if (!authorized) {
    response.status(401).send("Invalid authenticated");
  }

  try {
    await adminFirebase.auth().getUser(authorized);
  } catch (err) {
    response.status(401).send(err);
    return;
  }

  const connectedServicesRef = await adminFirebase.firestore().collection("connectedServices").doc(authorized).get();
  const connectedServices = connectedServicesRef.data() as FirebaseFirestore.DocumentData;
  const pData: unknown[] = [];

  requestBody.forEach(async (key: ArtistBodyRequest) => {
    switch (key.type) {
      case IPlatformTypes.mixcloud:
        MixcloudSDK.initialize(connectedServices[key.type].token);
        pData.push(MixcloudSDK.artistSongs(key.username));
        break;
      case IPlatformTypes.spotify:
        SpotifySDK.initialize(
          connectedServices[key.type].token,
          connectedServices[key.type].refresh_token,
          spotifyKeys.clientId, spotifyKeys.secretApi,
          authorized
        );

        pData.push(SpotifySDK.artistSongs(key.id));
        break;
    }
  });

  Promise.all(pData).then((promiseData) => {
    const allPlatformData = promiseData.map((data) => data);
    const flattenData = flatten(allPlatformData);
    response.status(200).send(flattenData);
  });
};
