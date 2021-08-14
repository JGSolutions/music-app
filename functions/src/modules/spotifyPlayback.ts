import { Response, Request } from "express";
import { adminFirebase } from "./fb";
import { SpotifySDK } from "../../sdk/spotify.sdk";
import { getConnectServices } from "../utils/connect-services-firebase";
import { spotifyKeys } from "../../sdk/api-keys";

export const spotifyPlayback = async (request: Request, response: Response) => {
  const authorized = request.headers["authorization"]!;

  try {
    await adminFirebase.auth().getUser(authorized);
  } catch (err) {
    response.status(401).send(err);
    return;
  }

  const connectedServices = await getConnectServices(authorized);
  // eslint-disable-next-line max-len
  SpotifySDK.initialize(connectedServices["spotify"].token, connectedServices["spotify"].refresh_token, spotifyKeys.clientId, spotifyKeys.secretApi, authorized);
  await SpotifySDK.playback(request.query.trackid as string);

  return response.status(200).send("done");
};
