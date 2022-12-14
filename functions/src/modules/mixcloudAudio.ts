/* eslint-disable max-len */
import { Response, Request } from "express";
import { adminFirebase } from "../config/fb";
import { MixcloudSDK } from "../../sdk/mixcloud.sdk";
import { getConnectServices } from "../utils/connect-services-firebase";
import { IPlatformTypes } from "../../../models/artist.types";

export const mixcloudAudio = async (request: Request, response: Response) => {
  const authorized = request.headers["authorization"]!;

  let requestBody: { externalUrl: string };

  try {
    requestBody = request.body;
  } catch (err) {
    return response.status(403).send("Invalid Body Request");
  }

  if (!authorized) {
    return response.status(401).send("Invalid authenticated");
  }

  try {
    await adminFirebase.auth().getUser(authorized);
  } catch (err) {
    return response.status(401).send(err);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const connectedServices = await getConnectServices(authorized);

  MixcloudSDK.initialize(connectedServices[IPlatformTypes.mixcloud].token);

  try {
    const { data: result } = await MixcloudSDK.audioStream(requestBody.externalUrl);
    return response.status(200).send({ url: result.url });
  } catch (err) {
    return response.status(500).send({ url: err });
  }
};
