/* eslint-disable max-len */
import { Response, Request } from "express";
import { MixcloudSDK } from "../../sdk/mixcloud.sdk";
import { SpotifySDK } from "../../sdk/spotify.sdk";
import { soundcloudKeys, spotifyKeys } from "../../sdk/api-keys";
import { getConnectServices } from "../utils/connect-services-firebase";
import { IArtistBodyRequest, IArtists, IPlatformTypes } from "../../../models/artist.types";
import { ISong } from "../../../models/song.types";
import { auth } from "../../sdk/soundcloud.sdk";

export const artist = async (request: Request, response: Response) => {
  const authorized = request.headers["authorization"]!;
  let requestBody: IArtistBodyRequest[];

  try {
    requestBody = JSON.parse(request.body);
  } catch (err) {
    return response.status(403).send("Invalid Body Request");
  }

  const connectedServices = await getConnectServices(authorized);
  const platformPromiseData: unknown[] = [];

  requestBody.forEach(async (key: IArtistBodyRequest) => {
    switch (key.type) {
      case IPlatformTypes.mixcloud:
        MixcloudSDK.initialize(connectedServices[key.type].token);
        platformPromiseData.push(MixcloudSDK.artistSongs(key.username));
        break;
      case IPlatformTypes.soundcloud:
        auth.config(soundcloudKeys.clientId, soundcloudKeys.secretApi, soundcloudKeys.uriRedirect, connectedServices[key.type].token, connectedServices[key.type].refresh_token, authorized);
        platformPromiseData.push(auth.artistSongs(key.id));
        break;
      case IPlatformTypes.spotify:
        SpotifySDK.initialize(connectedServices[key.type].token, connectedServices[key.type].refresh_token, spotifyKeys.clientId, spotifyKeys.secretApi, authorized);
        platformPromiseData.push(SpotifySDK.artistSongs(key.id));
        break;
    }
  });

  Promise.all(platformPromiseData).then((promiseData) => {
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
      tracks,
      artists,
    });
  }).catch((err) => {
    response.status(500).send(err);
  });

  return;
};
