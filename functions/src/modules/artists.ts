/* eslint-disable max-len */
/* eslint-disable guard-for-in */
import {Response, Request} from "express";
import {adminFirebase} from "./fb";
import {flatten, groupBy, keys, reduce} from "lodash";
import {MixcloudSDK} from "../../sdk/mixcloud.sdk";
import {IPlatformTypes} from "../../sdk/IPlatforms.types";
import {SpotifySDK} from "../../sdk/spotify.sdk";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const stringSimilarity = require("string-similarity");
const db = adminFirebase.firestore();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const artists = async (request: Request, response: Response) => {
  const decodedUID = Buffer.from(request.headers["authorization"] as string, "base64").toString("ascii");
  if (!decodedUID) {
    response.status(401).send("Not authenticated");
  }

  const connectedServicesRef = await db.collection("connectedServices").doc(decodedUID).get();
  const connectedServices = connectedServicesRef.data() as FirebaseFirestore.DocumentData;
  const platformKeys = keys(connectedServicesRef.data());
  const pData: unknown[] = [];

  platformKeys.forEach(async (key) => {
    switch (key) {
      case IPlatformTypes.mixcloud:
        MixcloudSDK.initialize(connectedServices[key].token);
        pData.push(MixcloudSDK.following());
        break;
      case IPlatformTypes.spotify:
        SpotifySDK.initialize(connectedServices[key].token);
        pData.push(SpotifySDK.following("artist"));
        break;
    }
  });

  Promise.all(pData).then((promiseData: any[]) => {
    const allPlatformData: any[] = [];
    promiseData.forEach((r) => {
      allPlatformData.push(r);
    });
    const groupedArtists = groupBy(flatten(allPlatformData), (e) => e.name);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const allArtistsKeys = keys(groupedArtists);

    const res = reduce(flatten(allPlatformData), (result: any, value: any) => {
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
