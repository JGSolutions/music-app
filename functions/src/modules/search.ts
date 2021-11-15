/* eslint-disable no-case-declarations */
/* eslint-disable max-len */
import { Response, Request } from "express";
import { MixcloudSDK } from "../../sdk/mixcloud.sdk";
import { getConnectServices } from "../utils/connect-services-firebase";
import { IArtists, IPlatformTypes } from "../../../models/artist.types";
import { SpotifySDK } from "../../sdk/spotify.sdk";
import { soundcloudKeys, spotifyKeys } from "../../sdk/api-keys";
import { keys, sortBy as _sortBy } from "lodash";
import { ISong } from "../../../models/song.types";
import { auth } from "../../sdk/soundcloud.sdk";

export const search = async (request: Request, response: Response) => {
  const authorized = request.headers["authorization"]!;
  const searchValue = request.query.search;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const connectedServices = await getConnectServices(authorized);
  const platformKeys = keys(connectedServices);
  const pData: unknown[] = [];

  platformKeys.forEach(async (key) => {
    switch (key) {
      case IPlatformTypes.soundcloud:
        auth.config(soundcloudKeys.clientId, soundcloudKeys.secretApi, soundcloudKeys.uriRedirect, connectedServices[key].token, connectedServices[key].refresh_token, authorized);
        pData.push(auth.search(searchValue as string));
        break;
      case IPlatformTypes.mixcloud:
        MixcloudSDK.initialize(connectedServices[key].token);
        pData.push(MixcloudSDK.search(searchValue as string));
        break;
      case IPlatformTypes.spotify:
        SpotifySDK.initialize(connectedServices[key].token, connectedServices[key].refresh_token, spotifyKeys.clientId, spotifyKeys.secretApi, authorized);
        pData.push(SpotifySDK.search(searchValue as string));
        break;
    }
  });

  Promise.all(pData).then((promiseData: any[]) => {
    const tracks: ISong[] = [];
    const artists: IArtists[] = [];

    promiseData.forEach((data: any) => {
      data.tracks.forEach((e: any) => {
        tracks.push(e);
      });

      data.artists.forEach((e: any) => {
        artists.push(e);
      });
    });

    return response.status(200).send({
      tracks: _sortBy(tracks, [(o) => o.name]),
      artists,
    });
  });

  return;
};
