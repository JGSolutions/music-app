/* eslint-disable max-len */
import { Response, Request } from "express";
import { getConnectServices } from "../utils/connect-services-firebase";
import { auth } from "../../sdk/soundcloud.sdk";
import { soundcloudKeys } from "../../sdk/api-keys";

export const soundcloudAudio = async (request: Request, response: Response) => {
  const authorized = request.headers["authorization"]!;

  const connectedServices = await getConnectServices(authorized);
  auth.config(soundcloudKeys.clientId, soundcloudKeys.secretApi, soundcloudKeys.uriRedirect, connectedServices["soundcloud"].token, connectedServices["soundcloud"].refresh_token, authorized);

  try {
    const { data: result } = await auth.audioStream(request.query.externalUrl as string);
    return response.status(200).send(result);
  } catch (err) {
    return response.status(500).send(err);
  }
};
