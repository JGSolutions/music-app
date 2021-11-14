/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { Response, Request } from "express";
import { adminFirebase } from "./fb";
import { flatten, keys } from "lodash";
import { auth } from "../../sdk/soundcloud.sdk";
import { soundcloudKeys, spotifyKeys } from "../../sdk/api-keys";
import { getConnectServices } from "../utils/connect-services-firebase";
import { IPlatformTypes } from "../../../models/artist.types";
import { SpotifySDK } from "../../sdk/spotify.sdk";

export const playlists = async (request: Request, response: Response) => {
  const authorized = request.headers["authorization"]!;

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
      case IPlatformTypes.soundcloud:
        auth.config(soundcloudKeys.clientId, soundcloudKeys.secretApi, soundcloudKeys.uriRedirect, connectedServices[key].token, connectedServices[key].refresh_token, authorized);
        pData.push(auth.playlists());
        break;
      case IPlatformTypes.spotify:
        SpotifySDK.initialize(connectedServices[key].token, connectedServices[key].refresh_token, spotifyKeys.clientId, spotifyKeys.secretApi, authorized);
        pData.push(SpotifySDK.getPlaylists());
        break;
    }
  });

  Promise.all(pData).then((promiseData) => {
    const allPlatformData = promiseData.map((data) => data);
    const flattenData = flatten(allPlatformData);

    response.status(200).send(flattenData);
  }).catch((err) => {
    console.log(err);
    response.status(500).send(err);
  });
};

export const playlistDetails = async (request: Request, response: Response) => {
  const authorized = request.headers["authorization"]!;
  const playlistId = request.query.playlistid as string;
  const platform = request.query.platform;
  let pData;

  try {
    await adminFirebase.auth().getUser(authorized);
  } catch (err) {
    response.status(401).send(err);
    return;
  }

  const connectedServices = await getConnectServices(authorized);
  switch (platform) {
    case IPlatformTypes.soundcloud:
      auth.config(soundcloudKeys.clientId, soundcloudKeys.secretApi, soundcloudKeys.uriRedirect, connectedServices[platform].token, connectedServices[platform].refresh_token, authorized);
      pData = auth.getplayListDetails(playlistId);
      break;
    case IPlatformTypes.spotify:
      SpotifySDK.initialize(connectedServices[platform].token, connectedServices[platform].refresh_token, spotifyKeys.clientId, spotifyKeys.secretApi, authorized);
      pData = SpotifySDK.getPlaylistDetails(playlistId);
      break;
  }

  try {
    const res = await pData;
    response.status(200).send(res);
  } catch (err) {
    console.log(err);
    response.status(500).send(err);
  }
};

export const deletePlaylist = async (request: Request, response: Response) => {
  const authorized = request.headers["authorization"]!;
  const playlistId = request.query.playlistid as string;
  const platform = request.query.platform;
  let pData;

  try {
    await adminFirebase.auth().getUser(authorized);
  } catch (err) {
    response.status(401).send(err);
    return;
  }

  const connectedServices = await getConnectServices(authorized);
  switch (platform) {
    case IPlatformTypes.soundcloud:
      auth.config(soundcloudKeys.clientId, soundcloudKeys.secretApi, soundcloudKeys.uriRedirect, connectedServices[platform].token, connectedServices[platform].refresh_token, authorized);
      pData = auth.deletePlaylist(playlistId);
      break;
    case IPlatformTypes.spotify:
      // SpotifySDK.initialize(connectedServices[platform].token, connectedServices[platform].refresh_token, spotifyKeys.clientId, spotifyKeys.secretApi, authorized);
      // pData = SpotifySDK.getPlaylistDetails(playlistId);
      break;
  }

  try {
    await pData;
    response.status(200).send({
      "message": "done",
    });
  } catch (err) {
    response.status(500).send(err);
  }
};
