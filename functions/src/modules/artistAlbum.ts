/* eslint-disable max-len */
import { Response, Request } from "express";
import { adminFirebase } from "./fb";
import { getConnectServices } from "../utils/connect-services-firebase";
import { IPlatformTypes } from "../../../models/artist.types";
import { SpotifySDK } from "../../sdk/spotify.sdk";
import { spotifyKeys } from "../../sdk/api-keys";

export const artistAlbum = async (request: Request, response: Response) => {
  const authorized = request.headers["authorization"]!;

  try {
    await adminFirebase.auth().getUser(authorized);
  } catch (err) {
    return response.status(401).send(err);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const connectedServices = await getConnectServices(authorized);

  switch (request.query.platform) {
    case IPlatformTypes.spotify:
      SpotifySDK.initialize(connectedServices[request.query.platform].token, connectedServices[request.query.platform].refresh_token, spotifyKeys.clientId, spotifyKeys.secretApi, authorized);

      // eslint-disable-next-line no-case-declarations
      const data = await SpotifySDK.getArtistAlbum(request.query.id as string);
      response.status(200).send(data);

      break;
  }

  return response.status(200).send([]);
};
