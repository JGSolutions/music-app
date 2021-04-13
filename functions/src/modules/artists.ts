/* eslint-disable max-len */
/* eslint-disable guard-for-in */
import {Response, Request} from "express";
import {adminFirebase} from "./fb";
import {keys} from "lodash";
import {MixcloudSDK} from "../../sdk/mixcloud.sdk";
import {IPlatformTypes} from "../../sdk/IPlatforms.types";

const db = adminFirebase.firestore();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const artists = async (request: Request, response: Response) => {
  const decodedUID = Buffer.from(request.headers["authorization"] as string, "base64").toString("ascii");
  if (!decodedUID) {
    response.status(401).send("Not authenticated");
  }

  const connectedServicesRef = await db.collection("connectedServices").doc(decodedUID).get();
  const connectedServices = connectedServicesRef.data() as FirebaseFirestore.DocumentData;
  const platformKeys = keys(connectedServicesRef.data());
  const pData: unknown[] = [];

  platformKeys.forEach(async (key) => {
    switch (key) {
      case IPlatformTypes.mixcloud:
        MixcloudSDK.initialize(connectedServices[key].token);
        pData.push(MixcloudSDK.following());
        break;
    }
  });

  Promise.all(pData).then((promiseData: any[]) => {
    response.status(200).send(promiseData[0]);
  });
};
