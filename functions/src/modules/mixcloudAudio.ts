/* eslint-disable max-len */
import { Response, Request } from "express";
import { adminFirebase } from "./fb";
import { MixcloudSDK } from "../../sdk/mixcloud.sdk";
import { IPlatformTypes } from "../../sdk/IPlatforms.types";
import { getConnectServices } from "../utils/connect-services-firebase";

export const mixcloudAudio = async (request: Request, response: Response) => {
  const authorized = request.headers["authorization"]!;

  let requestBody: { externalUrl: string };

  try {
    requestBody = request.body;
  } catch (err) {
    response.status(403).send("Invalid Body Request");
    return;
  }

  if (!authorized) {
    response.status(401).send("Invalid authenticated");
  }

  try {
    await adminFirebase.auth().getUser(authorized);
  } catch (err) {
    response.status(401).send(err);
    return;
  }

  const connectedServices = await getConnectServices(authorized);

  MixcloudSDK.initialize(connectedServices[IPlatformTypes.mixcloud].token);

  const { data: result } = await MixcloudSDK.audioStream(requestBody.externalUrl);
  response.status(200).send({ url: result.url });
};
