/* eslint-disable max-len */
import { Response, Request } from "express";
import { adminFirebase } from "./fb";
import { MixcloudSDK } from "../../sdk/mixcloud.sdk";
import { IPlatformTypes } from "../../sdk/IPlatforms.types";
import { getConnectServices } from "../utils/connect-services-firebase";

export const mixcloudAudio = async (request: Request, response: Response) => {
  const authorized = request.headers["authorization"]!;

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
  // const f = "blob:https://www.mixcloud.com/b951b9c1-ee1a-485f-a65a-057d1d91e56b";

  // const blob = new Blob(["Hello", "World!"]);

  // const buffer = await new Promise((resolve) => {
  //   const fileReader = new FileReader();
  //   fileReader.addEventListener("loadend", () => resolve(fileReader.result));
  //   fileReader.readAsArrayBuffer(blob);
  // });
  // const res = await MixcloudSDK.audioStream();

  response.status(200).send("ff");
};
