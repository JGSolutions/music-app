import { Response, Request } from "express";
import { IPlatformTypes } from "../../../models/artist.types";
import { adminFirebase } from "./fb";
import { SpotifySDK } from "../../sdk/spotify.sdk";
import { getConnectServices } from "../utils/connect-services-firebase";
import { spotifyKeys } from "../../sdk/api-keys";
// import { IAuthorizationToken } from "../../../models/spotify.model";

// const db = adminFirebase.firestore();
const auth = adminFirebase.auth();

export const addAlbumPlaylist = async (request: Request, response: Response) => {
  const authorized = request.headers["authorization"]!;
  const platform = request.query.platform;
  const albumid = request.query.albumid;
  let res;

  try {
    await auth.getUser(authorized);
  } catch (err) {
    response.status(401).send(err);
    return;
  }

  const connectedServices = await getConnectServices(authorized);

  switch (platform) {
    case IPlatformTypes.spotify:
      // eslint-disable-next-line max-len
      SpotifySDK.initialize(connectedServices[platform].token, connectedServices[platform].refresh_token, spotifyKeys.clientId, spotifyKeys.secretApi, authorized);
      res = await SpotifySDK.getAlbumTracks(albumid as string);

      break;
  }

  return response.status(200).send(res);
};
