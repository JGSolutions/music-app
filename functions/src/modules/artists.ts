/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { Response, Request } from "express";
import { flatten, keys, reduce, orderBy } from "lodash";
import { MixcloudSDK } from "../../sdk/mixcloud.sdk";
import { auth } from "../../sdk/soundcloud.sdk";
import { SpotifySDK } from "../../sdk/spotify.sdk";
import { soundcloudKeys, spotifyKeys } from "../../sdk/api-keys";
import { getConnectServices } from "../utils/connect-services-firebase";
import { IArtists, IPlatformTypes } from "../../../models/artist.types";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const stringSimilarity = require("string-similarity");

export const artists = async (request: Request, response: Response) => {
  const authorized = request.headers["authorization"]!;
  const connectedServices = await getConnectServices(authorized);
  const platformKeys = keys(connectedServices);
  const pData: unknown[] = [];

  platformKeys.forEach(async (key) => {
    switch (key) {
      case IPlatformTypes.soundcloud:
        auth.config(soundcloudKeys.clientId, soundcloudKeys.secretApi, soundcloudKeys.uriRedirect, connectedServices[key].token, connectedServices[key].refresh_token, authorized);
        pData.push(auth.following());
        break;
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

    const res: Record<string, IArtists[]> = reduce(sortedData, (result: any, value: any) => {
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
  }).catch((err) => {
    response.status(500).send(err);
  });
};
