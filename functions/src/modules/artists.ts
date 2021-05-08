/* eslint-disable max-len */
import { Response, Request } from "express";
import { adminFirebase } from "./fb";
import { flatten, keys, reduce, orderBy } from "lodash";
import { MixcloudSDK } from "../../sdk/mixcloud.sdk";
import { IPlatformTypes } from "../../sdk/IPlatforms.types";
import { SpotifySDK } from "../../sdk/spotify.sdk";
import { spotifyKeys } from "../../sdk/api-keys";
import { getConnectServices } from "../utils/connect-services-firebase";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const stringSimilarity = require("string-similarity");

export const artists = async (request: Request, response: Response) => {
  const authorized = request.headers["authorization"]!;

  if (!authorized) {
    response.status(401).send("Invalid authenticated");
  }

  try {
    await adminFirebase.auth().getUser(authorized);
  } catch (err) {
    response.status(401).send(err);
    return;
  }

  const connectedServices = await getConnectServices(authorized);
  const platformKeys = keys(connectedServices);
  const pData: unknown[] = [];

  platformKeys.forEach(async (key) => {
    switch (key) {
      case IPlatformTypes.mixcloud:
        MixcloudSDK.initialize(connectedServices[key].token);
        pData.push(MixcloudSDK.following());
        break;
      case IPlatformTypes.spotify:
        SpotifySDK.initialize(connectedServices[key].token, connectedServices[key].refresh_token, spotifyKeys.clientId, spotifyKeys.secretApi, authorized);
        pData.push(SpotifySDK.following("artist"));
        break;
    }
  });

  Promise.all(pData).then((promiseData) => {
    const allPlatformData = promiseData.map((data) => data);
    const flattenData = flatten(allPlatformData);
    const allArtistsKeys = flattenData.map((data: any) => data.id);
    const sortedData = orderBy(flattenData, (o: any) => o.name);

    const res = reduce(sortedData, (result: any, value: any) => {
      const artistKeys = keys(result);

      const matches = stringSimilarity.findBestMatch(value.name, artistKeys.length > 0 ? artistKeys : allArtistsKeys);

      if (matches.bestMatch.rating >= 0.75) {
        result[matches.bestMatch.target] = result[matches.bestMatch.target] || [];
        result[matches.bestMatch.target].push(value);
      } else {
        result[value.name] = result[value.name] || [];
        result[value.name].push(value);
      }

      return result;
    }, {});

    response.status(200).send(res);
  });
};
